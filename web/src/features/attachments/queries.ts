import "server-only";
import { and, asc, eq, inArray, isNull, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { ticketAttachments, ticketMessages } from "@/db/schema";
import { deleteStoredFile, removeStaleTempFiles } from "./storage";

const CLEANUP_BATCH = 100;

type NewAttachment = Pick<typeof ticketAttachments.$inferInsert, "companyId" | "uploadedById" | "originalName" | "mimeType" | "sizeBytes" | "storageKey">;

export async function createPendingAttachment(values: NewAttachment) {
  const db = await getDb();
  const [row] = await db.insert(ticketAttachments).values(values).returning();
  return row;
}

/** The attachment with the visibility of its message (null while pending), for the download route to authorize. */
export async function getAttachmentForDownload(id: string) {
  const db = await getDb();
  const [row] = await db
    .select({ attachment: ticketAttachments, isInternal: ticketMessages.isInternal })
    .from(ticketAttachments)
    .leftJoin(ticketMessages, eq(ticketMessages.id, ticketAttachments.messageId))
    .where(eq(ticketAttachments.id, id))
    .limit(1);
  return row ?? null;
}

/** Attachments of a ticket's messages, grouped by message id. Customers never get those of internal notes. */
export async function listTicketAttachments(ticketId: string, { includeInternal }: { includeInternal: boolean }) {
  const db = await getDb();
  const rows = await db
    .select({
      id: ticketAttachments.id,
      messageId: ticketMessages.id,
      name: ticketAttachments.originalName,
      mimeType: ticketAttachments.mimeType,
      sizeBytes: ticketAttachments.sizeBytes,
    })
    .from(ticketAttachments)
    .innerJoin(ticketMessages, eq(ticketMessages.id, ticketAttachments.messageId))
    .where(and(eq(ticketMessages.ticketId, ticketId), includeInternal ? undefined : eq(ticketMessages.isInternal, false)))
    .orderBy(asc(ticketAttachments.createdAt));

  const byMessage: Record<string, AttachmentView[]> = {};
  for (const { messageId, ...attachment } of rows) (byMessage[messageId] ??= []).push(attachment);
  return byMessage;
}

/** Best effort: deletes uploads that were never sent with a message, and their files. */
export async function removeAbandonedUploads(olderThanMs: number) {
  const db = await getDb();
  const cutoff = new Date(Date.now() - olderThanMs);
  const stale = await db
    .select({ id: ticketAttachments.id })
    .from(ticketAttachments)
    .where(and(isNull(ticketAttachments.ticketId), lt(ticketAttachments.createdAt, cutoff)))
    .limit(CLEANUP_BATCH);
  if (stale.length > 0) {
    const removed = await db
      .delete(ticketAttachments)
      // re-check pending: a message may have claimed the upload in the meantime
      .where(and(inArray(ticketAttachments.id, stale.map((s) => s.id)), isNull(ticketAttachments.ticketId)))
      .returning({ storageKey: ticketAttachments.storageKey });
    for (const { storageKey } of removed) await deleteStoredFile(storageKey);
  }
  await removeStaleTempFiles(olderThanMs);
}

export type AttachmentView = { id: string; name: string; mimeType: string; sizeBytes: number };
