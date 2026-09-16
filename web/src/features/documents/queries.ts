import "server-only";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, documents, projects, users } from "@/db/schema";

export async function listDocuments({ companyId, projectId }: { companyId?: string; projectId?: string } = {}) {
  const db = await getDb();
  const scope: SQL[] = [];
  if (companyId) scope.push(eq(documents.companyId, companyId));
  if (projectId) scope.push(eq(documents.projectId, projectId));
  const rows = await db
    .select({ document: documents, companyName: companies.name, projectName: projects.name, uploadedBy: users.name })
    .from(documents)
    .innerJoin(companies, eq(companies.id, documents.companyId))
    .innerJoin(users, eq(users.id, documents.uploadedById))
    .leftJoin(projects, eq(projects.id, documents.projectId))
    .where(scope.length ? and(...scope) : undefined)
    .orderBy(desc(documents.createdAt));
  return rows.map((r) => ({ ...r.document, companyName: r.companyName, projectName: r.projectName, uploadedBy: r.uploadedBy }));
}

export async function getDocument(id: string) {
  const db = await getDb();
  const [row] = await db
    .select({ document: documents, companyName: companies.name })
    .from(documents)
    .innerJoin(companies, eq(companies.id, documents.companyId))
    .where(eq(documents.id, id));
  return row ? { ...row.document, companyName: row.companyName } : null;
}

export type DocumentRow = Awaited<ReturnType<typeof listDocuments>>[number];
