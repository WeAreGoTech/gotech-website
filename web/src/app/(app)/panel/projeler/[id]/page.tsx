import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { MilestoneTimeline, StageBar } from "@/components/app/projects";
import { ProjectView } from "@/components/app/ProjectView";
import { listProjectUpdateAttachments } from "@/features/attachments/queries";
import { listDocuments } from "@/features/documents/queries";
import { getProject, listProjectUpdates } from "@/features/projects/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Proje" };

export default async function CustomerProjectPage({ params }: PageProps<"/panel/projeler/[id]">) {
  const user = await requireCustomer();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id, user.companyId) : null;
  if (!project) notFound();

  const [documents, updates, attachments] = await Promise.all([
    listDocuments({ companyId: user.companyId, projectId: id }),
    listProjectUpdates(id, { includeInternal: false }),
    listProjectUpdateAttachments(id, { includeInternal: false }),
  ]);

  return (
    <ProjectView
      project={project}
      documents={documents}
      updates={updates}
      attachments={attachments}
      backHref="/panel/projeler"
      stageBar={<StageBar stage={project.stage} />}
      milestones={<MilestoneTimeline project={project} />}
    />
  );
}
