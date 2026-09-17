import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectView } from "@/components/app/ProjectView";
import { listDocuments } from "@/features/documents/queries";
import { getProject } from "@/features/projects/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Proje" };

export default async function CustomerProjectPage({ params }: PageProps<"/panel/projeler/[id]">) {
  const user = await requireCustomer();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id, user.companyId) : null;
  if (!project) notFound();

  const documents = await listDocuments({ companyId: user.companyId, projectId: id });
  return (
    <ProjectView
      project={project}
      documents={documents}
      backHref="/panel/projeler"
    />
  );
}
