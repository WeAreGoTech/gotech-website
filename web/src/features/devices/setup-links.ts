import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, deskSetupLinks, users } from "@/db/schema";
import { hashToken, newToken } from "@/lib/auth/tokens";
import { env } from "@/lib/env";
import type { ClaimInput } from "./api-schemas";
import { registerDevice, type RegisterResult } from "./register";

// A person's one-click GoTech Desk setup: the link downloads the app with the token in the installer's name, and the
// app registers the computer to them at its first start, with no password. Staff links only fill in the e-mail: a
// team computer is trusted by every customer, so it still takes the password.
const SETUP_LINK_DAYS = 7;
const DAY_MS = 86_400_000;

export const setupPageUrl = (token: string) => `${env.siteUrl}/kur/${token}`;

/** A fresh link for that person; earlier ones stay valid until used or expired. */
export async function createSetupLink(userId: string): Promise<string> {
  const token = newToken();
  const db = await getDb();
  await db.insert(deskSetupLinks).values({ id: hashToken(token), userId, expiresAt: new Date(Date.now() + SETUP_LINK_DAYS * DAY_MS) });
  return setupPageUrl(token);
}

/** What an invitation e-mail says about setting up GoTech Desk: every invited person gets their own link. */
export async function setupLinkForMail(userId: string) {
  return { setupLink: await createSetupLink(userId), setupDays: SETUP_LINK_DAYS };
}

export type SetupPerson = {
  linkId: string;
  userId: string;
  name: string;
  email: string;
  role: "staff" | "customer";
  companyName: string | null;
  expiresAt: Date;
};

/** Who an unused, unexpired link is for; null for anything else, including a person taken out since. */
export async function findSetupLink(token: string): Promise<SetupPerson | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      linkId: deskSetupLinks.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      companyName: companies.name,
      expiresAt: deskSetupLinks.expiresAt,
    })
    .from(deskSetupLinks)
    .innerJoin(users, eq(users.id, deskSetupLinks.userId))
    .leftJoin(companies, eq(companies.id, users.companyId))
    .where(and(eq(deskSetupLinks.id, hashToken(token)), isNull(deskSetupLinks.usedAt), gt(deskSetupLinks.expiresAt, new Date()), isNull(users.removedAt)))
    .limit(1);
  return row ?? null;
}

export type SetupResult =
  | { status: "invalid" }
  | { status: "password"; email: string }
  | Exclude<RegisterResult, { status: "ok" }>
  | (Extract<RegisterResult, { status: "ok" }> & { customerCode: string });

/** Registers the computer to the link's customer and spends the link; a staff link only hands back the e-mail. */
export async function setUpFromLink(token: string, device: Omit<ClaimInput, "unattendedPassword">): Promise<SetupResult> {
  const person = await findSetupLink(token);
  if (!person) return { status: "invalid" };
  if (person.role === "staff") return { status: "password", email: person.email };

  const db = await getDb();
  const [company] = await db
    .select({ customerCode: companies.customerCode })
    .from(users)
    .innerJoin(companies, eq(companies.id, users.companyId))
    .where(eq(users.id, person.userId));
  if (!company) return { status: "unknown_company" };

  const result = await registerDevice({ ...device, unattendedPassword: null, customerCode: company.customerCode, personId: person.userId });
  if (result.status !== "ok") return result;
  // spent only once the computer is in: a refusal (another company's, a team computer) leaves the link usable
  await db.update(deskSetupLinks).set({ usedAt: new Date() }).where(and(eq(deskSetupLinks.id, person.linkId), isNull(deskSetupLinks.usedAt)));
  return { ...result, customerCode: company.customerCode };
}
