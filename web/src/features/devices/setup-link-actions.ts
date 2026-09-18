"use server";

import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { createSetupLink } from "./setup-links";

export type SetupLinkResult = { url: string } | { error: string };

/** Staff make a person's one-click setup link, to paste into an e-mail or a message. */
export async function createPersonSetupLink(personId: string): Promise<SetupLinkResult> {
  await requireStaff();
  if (!z.uuid().safeParse(personId).success) return { error: "Kişi bulunamadı." };
  const db = await getDb();
  const [person] = await db.select({ id: users.id }).from(users).where(and(eq(users.id, personId), isNull(users.removedAt)));
  if (!person) return { error: "Kişi bulunamadı." };
  return { url: await createSetupLink(person.id) };
}
