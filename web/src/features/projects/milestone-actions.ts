"use server";

import { asc, eq, max } from "drizzle-orm";
import { getDb } from "@/db";
import { projectMilestones } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { revalidateProjects } from "./revalidate";
import { milestoneSchema } from "./schemas";

const FIRST_POSITION = 0;

const milestoneFields = (formData: FormData) => ({ title: text(formData, "title"), dueOn: text(formData, "dueOn") });

const dueDate = (value: string) => (value ? new Date(value) : null);

async function orderedMilestones(projectId: string) {
  const db = await getDb();
  return db.select().from(projectMilestones).where(eq(projectMilestones.projectId, projectId)).orderBy(asc(projectMilestones.position));
}

export async function addMilestone(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = milestoneSchema.safeParse(milestoneFields(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const db = await getDb();
  const [last] = await db.select({ position: max(projectMilestones.position) }).from(projectMilestones).where(eq(projectMilestones.projectId, projectId));
  await db.insert(projectMilestones).values({
    projectId,
    title: parsed.data.title,
    dueOn: dueDate(parsed.data.dueOn),
    position: last?.position === null || last?.position === undefined ? FIRST_POSITION : last.position + 1,
  });

  revalidateProjects();
  return success("Adım eklendi.");
}

/** Renames a step and sets its date. The row form is validated in the browser too, so invalid input is simply ignored here. */
export async function saveMilestone(projectId: string, milestoneId: string, formData: FormData) {
  await requireStaff();
  const parsed = milestoneSchema.safeParse(milestoneFields(formData));
  if (!parsed.success) return;
  const db = await getDb();
  const [milestone] = await db.select({ projectId: projectMilestones.projectId }).from(projectMilestones).where(eq(projectMilestones.id, milestoneId));
  if (milestone?.projectId !== projectId) return;
  await db
    .update(projectMilestones)
    .set({ title: parsed.data.title, dueOn: dueDate(parsed.data.dueOn) })
    .where(eq(projectMilestones.id, milestoneId));
  revalidateProjects();
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  await requireStaff();
  const db = await getDb();
  const [milestone] = await db.select({ projectId: projectMilestones.projectId }).from(projectMilestones).where(eq(projectMilestones.id, milestoneId));
  if (milestone?.projectId !== projectId) return;
  await db.delete(projectMilestones).where(eq(projectMilestones.id, milestoneId));
  revalidateProjects();
}

/** Moves a step one place up (-1) or down (1) and renumbers the whole list so positions stay 0..n-1. */
export async function moveMilestone(projectId: string, milestoneId: string, direction: number) {
  await requireStaff();
  const rows = await orderedMilestones(projectId);
  const index = rows.findIndex((m) => m.id === milestoneId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= rows.length) return;

  const reordered = [...rows];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  const db = await getDb();
  await db.transaction(async (tx) => {
    for (const [position, milestone] of reordered.entries()) {
      if (milestone.position !== position) await tx.update(projectMilestones).set({ position }).where(eq(projectMilestones.id, milestone.id));
    }
  });
  revalidateProjects();
}

export async function toggleMilestone(projectId: string, milestoneId: string) {
  await requireStaff();
  const db = await getDb();
  const [milestone] = await db.select().from(projectMilestones).where(eq(projectMilestones.id, milestoneId));
  if (!milestone || milestone.projectId !== projectId) throw new Error("Adım bulunamadı.");
  await db
    .update(projectMilestones)
    .set({ completedAt: milestone.completedAt ? null : new Date() })
    .where(eq(projectMilestones.id, milestoneId));
  revalidateProjects();
}
