"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { DOCUMENT_KINDS, documents, projects } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";

const MOCK_FILE_BYTES = 180_000;

const addSchema = z.object({
  title: z.string().trim().min(3, { error: "Doküman adını yazın." }).max(120),
  kind: z.enum(DOCUMENT_KINDS, { error: "Türünü seçin." }),
  projectId: z.union([z.uuid(), z.literal("")]),
});

const slug = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Mockup: stores the document record only; the file itself is generated on download. */
export async function addDocument(companyId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const staff = await requireStaff();
  const parsed = addSchema.safeParse({ title: text(formData, "title"), kind: text(formData, "kind"), projectId: text(formData, "projectId") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { title, kind, projectId } = parsed.data;

  const db = await getDb();
  if (projectId) {
    const [project] = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, projectId), eq(projects.companyId, companyId)));
    if (!project) return failure("Seçilen proje bu firmaya ait değil.");
  }
  await db.insert(documents).values({ companyId, projectId: projectId || null, title, kind, fileName: `${slug(title)}.pdf`, sizeBytes: MOCK_FILE_BYTES, uploadedById: staff.id });

  revalidatePath(`/yonetim/musteriler/${companyId}`);
  revalidatePath("/panel", "layout");
  return success(`"${title}" eklendi, müşteri panelinde görünüyor.`);
}
