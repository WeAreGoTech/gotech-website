"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { PROJECT_STAGES, SERVICE_KINDS, companies, projectMilestones, projects } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { dayOffset } from "@/lib/dates";
import { failure, fieldErrors, text, type ActionState } from "@/lib/forms";
import { DEFAULT_MILESTONES } from "./labels";

const createSchema = z.object({
  companyId: z.uuid({ error: "Firmayı seçin." }),
  name: z.string().trim().min(3, { error: "Proje adını yazın." }).max(120),
  service: z.enum(SERVICE_KINDS, { error: "Hizmet türünü seçin." }),
  summary: z.string().trim().max(500),
  dueOn: z.union([z.iso.date({ error: "Geçerli bir tarih seçin." }), z.literal("")]),
});

export async function createProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = createSchema.safeParse({
    companyId: text(formData, "companyId"),
    name: text(formData, "name"),
    service: text(formData, "service"),
    summary: text(formData, "summary"),
    dueOn: text(formData, "dueOn"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const input = parsed.data;

  const db = await getDb();
  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.id, input.companyId));
  if (!company) return failure("Firma bulunamadı.");

  const project = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(projects)
      .values({ companyId: input.companyId, name: input.name, service: input.service, summary: input.summary, startsOn: dayOffset(0), dueOn: input.dueOn ? new Date(input.dueOn) : null })
      .returning();
    await tx.insert(projectMilestones).values(DEFAULT_MILESTONES[input.service].map((title, position) => ({ projectId: created.id, title, position })));
    return created;
  });

  revalidatePath("/yonetim/projeler");
  redirect(`/yonetim/projeler/${project.id}`);
}

export async function toggleMilestone(projectId: string, milestoneId: string) {
  await requireStaff();
  const db = await getDb();
  const [milestone] = await db.select().from(projectMilestones).where(eq(projectMilestones.id, milestoneId));
  if (!milestone || milestone.projectId !== projectId) throw new Error("Aşama bulunamadı.");
  await db
    .update(projectMilestones)
    .set({ completedAt: milestone.completedAt ? null : new Date() })
    .where(eq(projectMilestones.id, milestoneId));
  revalidatePath(`/yonetim/projeler/${projectId}`);
  revalidatePath("/panel", "layout");
}

export async function updateProjectStage(projectId: string, formData: FormData) {
  await requireStaff();
  const stage = z.enum(PROJECT_STAGES).parse(text(formData, "stage"));
  const db = await getDb();
  await db.update(projects).set({ stage }).where(eq(projects.id, projectId));
  revalidatePath(`/yonetim/projeler/${projectId}`);
  revalidatePath("/panel", "layout");
}
