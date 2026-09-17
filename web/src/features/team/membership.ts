import "server-only";
import { and, count, eq, isNotNull, isNull, ne, type SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";

export const TEAM_PAGE = "/panel/ekip";
export const companyPage = (companyId: string) => `/yonetim/musteriler/${companyId}`;

const NOTICE_PARAM = "uyari";

export const MEMBER_ERRORS = {
  notAdmin: "Bu işlem için firma yetkilisi olmanız gerekiyor.",
  notFound: "Kişi bulunamadı.",
  lastAdmin: "Firmada en az bir firma yetkilisi kalmalı. Önce başka birini yetkili yapın.",
  selfRemove: "Kendinizi çıkaramazsınız.",
};

/** Sends the person back to the people page with a Turkish warning above the list. */
export const noticeHref = (page: string, message: string) => `${page}?${NOTICE_PARAM}=${encodeURIComponent(message)}`;

export const readNotice = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// "Active" means not removed; someone who has not set a password yet still counts as a member.
const activeMember = (companyId: string) => and(eq(users.companyId, companyId), eq(users.role, "customer"), isNull(users.removedAt));

const isUuid = (value: string) => z.uuid().safeParse(value).success;

/** An active customer of that company, or null. */
export async function findMember(companyId: string, personId: string) {
  if (!isUuid(personId)) return null;
  const db = await getDb();
  const [member] = await db
    .select({ id: users.id, name: users.name, isCompanyAdmin: users.isCompanyAdmin })
    .from(users)
    .where(and(eq(users.id, personId), activeMember(companyId)));
  return member ?? null;
}

/** Someone this company removed earlier, or null. */
export async function findRemovedMember(companyId: string, personId: string) {
  if (!isUuid(personId)) return null;
  const db = await getDb();
  const [member] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(and(eq(users.id, personId), eq(users.companyId, companyId), eq(users.role, "customer"), isNotNull(users.removedAt)));
  return member ?? null;
}

/**
 * The company of a customer, for staff controls that only know the person. Removed people are
 * included so staff can bring them back; changeMember decides what each change may do.
 */
export async function findMemberCompany(personId: string) {
  if (!isUuid(personId)) return null;
  const db = await getDb();
  const [row] = await db
    .select({ companyId: users.companyId })
    .from(users)
    .where(and(eq(users.id, personId), eq(users.role, "customer")));
  return row?.companyId ?? null;
}

async function countMembers(where: SQL | undefined) {
  const db = await getDb();
  const [{ value }] = await db.select({ value: count() }).from(users).where(where);
  return value;
}

/** The company's first person becomes its admin; colleagues invited later do not. */
export const isFirstMember = (companyId: string) => countMembers(activeMember(companyId)).then((value) => value === 0);

function revalidateMembership(companyId: string) {
  revalidatePath(TEAM_PAGE);
  revalidatePath("/yonetim/musteriler");
  revalidatePath(companyPage(companyId));
  revalidatePath("/yonetim/cihazlar");
}

/** Brings a removed person back as a normal member; they sign in again with their old password. */
async function restoreMember(companyId: string, personId: string): Promise<string | null> {
  const member = await findRemovedMember(companyId, personId);
  if (!member) return MEMBER_ERRORS.notFound;
  const db = await getDb();
  await db.update(users).set({ removedAt: null }).where(eq(users.id, member.id));
  revalidateMembership(companyId);
  return null;
}

export type MemberChange = "promote" | "demote" | "remove" | "restore";

/**
 * Applies a people change under the company's invariants: the target must be an active person of
 * that company and at least one firma yetkilisi has to stay. Returns a Turkish message when the
 * change is refused, null when it went through.
 */
export async function changeMember(companyId: string, personId: string, change: MemberChange): Promise<string | null> {
  if (change === "restore") return restoreMember(companyId, personId);
  const member = await findMember(companyId, personId);
  if (!member) return MEMBER_ERRORS.notFound;

  if (member.isCompanyAdmin && change !== "promote") {
    const others = await countMembers(and(activeMember(companyId), eq(users.isCompanyAdmin, true), ne(users.id, member.id)));
    if (others === 0) return MEMBER_ERRORS.lastAdmin;
  }

  const db = await getDb();
  if (change === "remove") {
    // soft removal: history stays, the account can no longer sign in anywhere
    await db.update(users).set({ removedAt: new Date(), isCompanyAdmin: false }).where(eq(users.id, member.id));
    await db.delete(sessions).where(eq(sessions.userId, member.id));
  } else {
    await db.update(users).set({ isCompanyAdmin: change === "promote" }).where(eq(users.id, member.id));
  }

  revalidateMembership(companyId);
  return null;
}
