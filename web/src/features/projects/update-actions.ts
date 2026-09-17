"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projectUpdates, projects } from "@/db/schema";
import { AttachmentLinkError, linkAttachments, readAttachmentIds } from "@/features/attachments/link";
import { removeUpdateAttachments } from "@/features/attachments/queries";
import { requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { revalidateProjects } from "./revalidate";
import { projectUpdateSchema } from "./schemas";

const NOT_FOUND = "Proje bulunamadı.";
// the checked value the "İç not" checkbox submits
const INTERNAL_CHECKED = "on";

export async function addProjectUpdate(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const staff = await requireStaff();
  const parsed = projectUpdateSchema.safeParse({ body: text(formData, "body"), isInternal: text(formData, "internal") === INTERNAL_CHECKED });
  if (!parsed.success) return fieldErrors(parsed.error);
  const attachments = readAttachmentIds(formData);
  if ("error" in attachments) return failure(attachments.error);

  const db = await getDb();
  const [project] = await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, projectId));
  if (!project) return failure(NOT_FOUND);
  const { body, isInternal } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx.insert(projectUpdates).values({ projectId, authorId: staff.id, body, isInternal }).returning({ id: projectUpdates.id });
      await linkAttachments(tx, attachments.ids, { uploadedById: staff.id, companyId: project.companyId }, { projectUpdateId: created.id });
    });
  } catch (error) {
    if (error instanceof AttachmentLinkError) return failure(error.message);
    throw error;
  }

  revalidateProjects();
  return success(isInternal ? "İç not eklendi." : "İlerleme notu eklendi.");
}

/** A team member can remove a note they wrote themselves, together with its files. */
export async function deleteProjectUpdate(projectId: string, updateId: string) {
  const staff = await requireStaff();
  const db = await getDb();
  const [update] = await db.select().from(projectUpdates).where(eq(projectUpdates.id, updateId));
  if (!update || update.projectId !== projectId || update.authorId !== staff.id) return;

  await removeUpdateAttachments(updateId);
  await db.delete(projectUpdates).where(eq(projectUpdates.id, updateId));
  revalidateProjects();
}
