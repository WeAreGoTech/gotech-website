import "server-only";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "@/db";
import { ticketAttachments } from "@/db/schema";
import { ATTACHMENT_FIELD, MAX_FILES_PER_MESSAGE, UPLOAD_ERRORS } from "./rules";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export const ATTACHMENTS_UNAVAILABLE = "Eklediğiniz dosyalardan biri artık kullanılamıyor. Dosyaları kaldırıp yeniden ekleyin.";

const attachmentIdsSchema = z.array(z.uuid({ error: ATTACHMENTS_UNAVAILABLE })).max(MAX_FILES_PER_MESSAGE, { error: UPLOAD_ERRORS.count });

/** An upload nothing has claimed yet, so it can still be linked or cleaned up. */
export const isPendingAttachment = () => and(isNull(ticketAttachments.ticketId), isNull(ticketAttachments.projectUpdateId));

/** Thrown inside a transaction so the message is rolled back together with the failed link. */
export class AttachmentLinkError extends Error {}

/** The attachment ids posted by the picker's hidden inputs, deduplicated; null with a message when invalid. */
export function readAttachmentIds(formData: FormData): { ids: string[] } | { error: string } {
  const values = [...new Set(formData.getAll(ATTACHMENT_FIELD).map(String))];
  const parsed = attachmentIdsSchema.safeParse(values);
  return parsed.success ? { ids: parsed.data } : { error: parsed.error.issues[0].message };
}

type Uploader = { uploadedById: string; companyId: string };
/** Where the files end up: a ticket message or a project update. */
type LinkTarget = { ticketId: string; messageId: string } | { projectUpdateId: string };

/**
 * Attaches pending uploads to a message or a project update. Every id must be pending, uploaded by the same user
 * and belong to the same company; otherwise throws AttachmentLinkError and nothing is linked.
 */
export async function linkAttachments(tx: Transaction, ids: string[], { uploadedById, companyId }: Uploader, target: LinkTarget) {
  if (ids.length === 0) return;
  const linked = await tx
    .update(ticketAttachments)
    .set(target)
    .where(
      and(
        inArray(ticketAttachments.id, ids),
        isPendingAttachment(),
        eq(ticketAttachments.uploadedById, uploadedById),
        eq(ticketAttachments.companyId, companyId),
      ),
    )
    .returning({ id: ticketAttachments.id });
  if (linked.length !== ids.length) throw new AttachmentLinkError(ATTACHMENTS_UNAVAILABLE);
}
