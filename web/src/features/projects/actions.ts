"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { companies, projectMilestones, projects, users } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { DEFAULT_MILESTONES } from "./labels";
import { revalidateProjects } from "./revalidate";
import { createProjectSchema, projectFieldsSchema, stageSchema } from "./schemas";

const NOT_FOUND = "Proje bulunamadı.";
const NOT_STAFF = "Proje yalnızca ekip üyelerine atanabilir.";

const projectFields = (formData: FormData) => ({
  name: text(formData, "name"),
  service: text(formData, "service"),
  summary: text(formData, "summary"),
  assigneeId: text(formData, "assigneeId"),
  startsOn: text(formData, "startsOn"),
  dueOn: text(formData, "dueOn"),
});

/** The columns both create and edit write; empty date and assignee fields become null. */
const projectValues = (input: ReturnType<typeof projectFieldsSchema.parse>) => ({
  name: input.name,
  service: input.service,
  summary: input.summary,
  assigneeId: input.assigneeId || null,
  startsOn: new Date(input.startsOn),
  dueOn: input.dueOn ? new Date(input.dueOn) : null,
});

async function isStaffMember(assigneeId: string) {
  const db = await getDb();
  const [member] = await db.select({ role: users.role }).from(users).where(eq(users.id, assigneeId));
  return member?.role === "staff";
}

export async function createProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = createProjectSchema.safeParse({ ...projectFields(formData), companyId: text(formData, "companyId"), stage: text(formData, "stage") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const input = parsed.data;

  const db = await getDb();
  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.id, input.companyId));
  if (!company) return failure("Firma bulunamadı.");
  if (input.assigneeId && !(await isStaffMember(input.assigneeId))) return failure(NOT_STAFF);

  const project = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(projects)
      .values({ ...projectValues(input), companyId: input.companyId, stage: input.stage })
      .returning();
    await tx.insert(projectMilestones).values(DEFAULT_MILESTONES[input.service].map((title, position) => ({ projectId: created.id, title, position })));
    return created;
  });

  revalidateProjects();
  redirect(`/yonetim/projeler/${project.id}`);
}

/** Edits everything but the company; the milestones of an existing project are never rewritten, even when the service changes. */
export async function updateProject(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = projectFieldsSchema.safeParse(projectFields(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  const input = parsed.data;
  if (input.assigneeId && !(await isStaffMember(input.assigneeId))) return failure(NOT_STAFF);

  const db = await getDb();
  const updated = await db.update(projects).set(projectValues(input)).where(eq(projects.id, projectId)).returning({ id: projects.id });
  if (updated.length === 0) return failure(NOT_FOUND);

  revalidateProjects();
  return success("Değişiklikler kaydedildi.");
}

export async function updateProjectStage(projectId: string, formData: FormData) {
  await requireStaff();
  const stage = stageSchema.parse(text(formData, "stage"));
  const db = await getDb();
  await db.update(projects).set({ stage }).where(eq(projects.id, projectId));
  revalidateProjects();
}
