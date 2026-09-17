import "server-only";
import { and, asc, eq, inArray, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { projectUpdates, projects, ticketAttachments, ticketMessages } from "@/db/schema";
import { isPendingAttachment } from "./link";
import { deleteStoredFile, removeStaleTempFiles } from "./storage";

const CLEANUP_BATCH = 100;

type NewAttachment = Pick<typeof ticketAttachments.$inferInsert, "companyId" | "uploadedById" | "originalName" | "mimeType" | "sizeBytes" | "storageKey">;

export async function createPendingAttachment(values: NewAttachment) {
  const db = await getDb();
  const [row] = await db.insert(ticketAttachments).values(values).returning();
  return row;
}

const fileColumns = {
  id: ticketAttachments.id,
  name: ticketAttachments.originalName,
  mimeType: ticketAttachments.mimeType,
  sizeBytes: ticketAttachments.sizeBytes,
};

function groupByOwner(rows: (AttachmentView & { ownerId: string })[]) {
  const byOwner: Record<string, AttachmentView[]> = {};
  for (const { ownerId, ...attachment } of rows) (byOwner[ownerId] ??= []).push(attachment);
  return byOwner;
}

/**
 * The attachment with the visibility of whatever it hangs on, for the download route to authorize:
 * a ticket message, a project update (with the project's company), or neither while it is still pending.
 */
export async function getAttachmentForDownload(id: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      attachment: ticketAttachments,
      messageIsInternal: ticketMessages.isInternal,
      updateIsInternal: projectUpdates.isInternal,
      updateCompanyId: projects.companyId,
    })
    .from(ticketAttachments)
    .leftJoin(ticketMessages, eq(ticketMessages.id, ticketAttachments.messageId))
    .leftJoin(projectUpdates, eq(projectUpdates.id, ticketAttachments.projectUpdateId))
    .leftJoin(projects, eq(projects.id, projectUpdates.projectId))
    .where(eq(ticketAttachments.id, id))
    .limit(1);
  return row ?? null;
}

/** Attachments of a ticket's messages, grouped by message id. Customers never get those of internal notes. */
export async function listTicketAttachments(ticketId: string, { includeInternal }: { includeInternal: boolean }) {
  const db = await getDb();
  const rows = await db
    .select({ ...fileColumns, ownerId: ticketMessages.id })
    .from(ticketAttachments)
    .innerJoin(ticketMessages, eq(ticketMessages.id, ticketAttachments.messageId))
    .where(and(eq(ticketMessages.ticketId, ticketId), includeInternal ? undefined : eq(ticketMessages.isInternal, false)))
    .orderBy(asc(ticketAttachments.createdAt));
  return groupByOwner(rows);
}

/** Attachments of a project's updates, grouped by update id. Customers never get those of internal notes. */
export async function listProjectUpdateAttachments(projectId: string, { includeInternal }: { includeInternal: boolean }) {
  const db = await getDb();
  const rows = await db
    .select({ ...fileColumns, ownerId: projectUpdates.id })
    .from(ticketAttachments)
    .innerJoin(projectUpdates, eq(projectUpdates.id, ticketAttachments.projectUpdateId))
    .where(and(eq(projectUpdates.projectId, projectId), includeInternal ? undefined : eq(projectUpdates.isInternal, false)))
    .orderBy(asc(ticketAttachments.createdAt));
  return groupByOwner(rows);
}

/** Best effort: deletes uploads that were never sent with a message or an update, and their files. */
export async function removeAbandonedUploads(olderThanMs: number) {
  const db = await getDb();
  const cutoff = new Date(Date.now() - olderThanMs);
  const stale = await db
    .select({ id: ticketAttachments.id })
    .from(ticketAttachments)
    .where(and(isPendingAttachment(), lt(ticketAttachments.createdAt, cutoff)))
    .limit(CLEANUP_BATCH);
  if (stale.length > 0) {
    const removed = await db
      .delete(ticketAttachments)
      // re-check pending: a message or an update may have claimed the upload in the meantime
      .where(and(inArray(ticketAttachments.id, stale.map((s) => s.id)), isPendingAttachment()))
      .returning({ storageKey: ticketAttachments.storageKey });
    for (const { storageKey } of removed) await deleteStoredFile(storageKey);
  }
  await removeStaleTempFiles(olderThanMs);
}

/** Removes the rows and the files of everything attached to a project update that is about to be deleted. */
export async function removeUpdateAttachments(updateId: string) {
  const db = await getDb();
  const removed = await db
    .delete(ticketAttachments)
    .where(eq(ticketAttachments.projectUpdateId, updateId))
    .returning({ storageKey: ticketAttachments.storageKey });
  for (const { storageKey } of removed) await deleteStoredFile(storageKey);
}

export type AttachmentView = { id: string; name: string; mimeType: string; sizeBytes: number };
