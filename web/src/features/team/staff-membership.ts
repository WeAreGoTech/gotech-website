import "server-only";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { MEMBER_ERRORS } from "./membership";

export const STAFF_PAGE = "/yonetim/ekip";

export type StaffChange = "remove" | "restore";

/**
 * Takes a team member out of GoTech, or brings them back. Out means no panel, no GoTech Desk session, and
 * their computers leave every customer's whitelist with the next heartbeat. Nobody removes themselves, so
 * at least one team member always stays. Returns a Turkish message when refused, null when done.
 */
export async function changeStaff(meId: string, personId: string, change: StaffChange): Promise<string | null> {
  if (!z.uuid().safeParse(personId).success) return MEMBER_ERRORS.notFound;
  if (change === "remove" && personId === meId) return MEMBER_ERRORS.selfRemove;

  const db = await getDb();
  const [person] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, personId), eq(users.role, "staff"), change === "remove" ? isNull(users.removedAt) : isNotNull(users.removedAt)));
  if (!person) return MEMBER_ERRORS.notFound;

  if (change === "remove") {
    await db.update(users).set({ removedAt: new Date() }).where(eq(users.id, person.id));
    await db.delete(sessions).where(eq(sessions.userId, person.id));
  } else {
    await db.update(users).set({ removedAt: null }).where(eq(users.id, person.id));
  }
  // team lists, ticket assignees and the devices page all read the team
  revalidatePath("/yonetim", "layout");
  return null;
}
