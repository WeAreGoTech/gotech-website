import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export async function getProfile(userId: string) {
  const db = await getDb();
  const [profile] = await db
    .select({ name: users.name, email: users.email, title: users.title, phone: users.phone, notifyByEmail: users.notifyByEmail, role: users.role })
    .from(users)
    .where(eq(users.id, userId));
  return profile ?? null;
}
