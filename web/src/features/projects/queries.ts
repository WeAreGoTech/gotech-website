import "server-only";
import { and, asc, desc, eq, gte, inArray, isNull, lte, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, projectMilestones, projects } from "@/db/schema";
import { dayOffset } from "@/lib/dates";

type Milestone = typeof projectMilestones.$inferSelect;

function summarize(milestones: Milestone[]) {
  const doneCount = milestones.filter((m) => m.completedAt).length;
  const next = milestones.find((m) => !m.completedAt) ?? null;
  const progress = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0;
  return { doneCount, total: milestones.length, progress, next };
}

/** Projects with progress and next milestone; pass companyId to limit to one customer. */
export async function listProjects(companyId?: string) {
  const db = await getDb();
  const rows = await db
    .select({ project: projects, companyName: companies.name })
    .from(projects)
    .innerJoin(companies, eq(companies.id, projects.companyId))
    .where(companyId ? eq(projects.companyId, companyId) : undefined)
    .orderBy(desc(projects.startsOn));
  if (rows.length === 0) return [];

  const milestones = await db
    .select()
    .from(projectMilestones)
    .where(inArray(projectMilestones.projectId, rows.map((r) => r.project.id)))
    .orderBy(asc(projectMilestones.position));

  return rows.map(({ project, companyName }) => ({
    ...project,
    companyName,
    ...summarize(milestones.filter((m) => m.projectId === project.id)),
  }));
}

export async function getProject(id: string, companyId?: string) {
  const db = await getDb();
  const scope: SQL[] = [eq(projects.id, id)];
  if (companyId) scope.push(eq(projects.companyId, companyId));
  const [row] = await db
    .select({ project: projects, companyName: companies.name })
    .from(projects)
    .innerJoin(companies, eq(companies.id, projects.companyId))
    .where(and(...scope));
  if (!row) return null;

  const milestones = await db.select().from(projectMilestones).where(eq(projectMilestones.projectId, id)).orderBy(asc(projectMilestones.position));
  return { ...row.project, companyName: row.companyName, milestones, ...summarize(milestones) };
}

/** Open milestones due within the next days, across all customers. */
export async function listUpcomingMilestones(days: number) {
  const db = await getDb();
  return db
    .select({
      id: projectMilestones.id,
      title: projectMilestones.title,
      dueOn: projectMilestones.dueOn,
      projectId: projects.id,
      projectName: projects.name,
      companyName: companies.name,
    })
    .from(projectMilestones)
    .innerJoin(projects, eq(projects.id, projectMilestones.projectId))
    .innerJoin(companies, eq(companies.id, projects.companyId))
    .where(and(isNull(projectMilestones.completedAt), gte(projectMilestones.dueOn, dayOffset(-30)), lte(projectMilestones.dueOn, dayOffset(days))))
    .orderBy(asc(projectMilestones.dueOn));
}

export type ProjectSummary = Awaited<ReturnType<typeof listProjects>>[number];
export type ProjectDetail = NonNullable<Awaited<ReturnType<typeof getProject>>>;
