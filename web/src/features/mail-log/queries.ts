import "server-only";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { emailLog } from "@/db/schema";

const MAIL_LOG_LIMIT = 100;

export async function listRecentMails() {
  const db = await getDb();
  return db.select().from(emailLog).orderBy(desc(emailLog.createdAt)).limit(MAIL_LOG_LIMIT);
}
