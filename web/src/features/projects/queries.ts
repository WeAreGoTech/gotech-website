import "server-only";
import { and, asc, desc, eq, gte, inArray, isNull, lte, max, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import { companies, projectMilestones, projectUpdates, projects, users } from "@/db/schema";
import { dayOffset } from "@/lib/dates";

type Milestone = typeof projectMilestones.$inferSelect;

const assignee = alias(users, "project_assignee");

function summarize(milestones: Milestone[]) {
  const doneCount = milestones.filter((m) => m.completedAt).length;
  const next = milestones.find((m) => !m.completedAt) ?? null;
  const progress = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0;
  return { doneCount, total: milestones.length, progress, next };
}

/** Projects with progress, next milestone and the date of the newest note the customer can see. */
async function selectProjects(scope: SQL | undefined) {
  const db = await getDb();
  const rows = await db
    .select({ project: projects, companyName: companies.name, assigneeName: assignee.name })
    .from(projects)
    .innerJoin(companies, eq(companies.id, projects.companyId))
    .leftJoin(assignee, eq(assignee.id, projects.assigneeId))
    .where(scope)
    .orderBy(desc(projects.startsOn));
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.project.id);
  const [milestones, lastUpdates] = await Promise.all([
    db.select().from(projectMilestones).where(inArray(projectMilestones.projectId, ids)).orderBy(asc(projectMilestones.position)),
    db
      .select({ projectId: projectUpdates.projectId, at: max(projectUpdates.createdAt) })
      .from(projectUpdates)
      .where(and(inArray(projectUpdates.projectId, ids), eq(projectUpdates.isInternal, false)))
      .groupBy(projectUpdates.projectId),
  ]);
  const lastUpdateAt = new Map(lastUpdates.map((u) => [u.projectId, u.at]));

  return rows.map(({ project, companyName, assigneeName }) => ({
    ...project,
    companyName,
    assigneeName,
    lastUpdateAt: lastUpdateAt.get(project.id) ?? null,
    ...summarize(milestones.filter((m) => m.projectId === project.id)),
  }));
}

/** Pass companyId to limit to one customer. */
export const listProjects = (companyId?: string) => selectProjects(companyId ? eq(projects.companyId, companyId) : undefined);

/** Projects a team member is responsible for, for the team's overview page. */
export const listAssignedProjects = (assigneeId: string) => selectProjects(eq(projects.assigneeId, assigneeId));

export async function getProject(id: string, companyId?: string) {
  const db = await getDb();
  const scope: SQL[] = [eq(projects.id, id)];
  if (companyId) scope.push(eq(projects.companyId, companyId));
  const [row] = await db
    .select({ project: projects, companyName: companies.name, assigneeName: assignee.name })
    .from(projects)
    .innerJoin(companies, eq(companies.id, projects.companyId))
    .leftJoin(assignee, eq(assignee.id, projects.assigneeId))
    .where(and(...scope));
  if (!row) return null;

  const milestones = await db.select().from(projectMilestones).where(eq(projectMilestones.projectId, id)).orderBy(asc(projectMilestones.position));
  return { ...row.project, companyName: row.companyName, assigneeName: row.assigneeName, milestones, ...summarize(milestones) };
}

/** Progress notes of a project, newest first. Customers never get the internal ones. */
export async function listProjectUpdates(projectId: string, { includeInternal }: { includeInternal: boolean }) {
  const db = await getDb();
  return db
    .select({
      id: projectUpdates.id,
      authorId: projectUpdates.authorId,
      authorName: users.name,
      body: projectUpdates.body,
      isInternal: projectUpdates.isInternal,
      createdAt: projectUpdates.createdAt,
    })
    .from(projectUpdates)
    .innerJoin(users, eq(users.id, projectUpdates.authorId))
    .where(and(eq(projectUpdates.projectId, projectId), includeInternal ? undefined : eq(projectUpdates.isInternal, false)))
    .orderBy(desc(projectUpdates.createdAt));
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
export type ProjectUpdate = Awaited<ReturnType<typeof listProjectUpdates>>[number];
