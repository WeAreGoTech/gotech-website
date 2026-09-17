import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectView } from "@/components/app/ProjectView";
import { StageForm } from "@/components/app/staff-forms";
import { listDocuments } from "@/features/documents/queries";
import { toggleMilestone, updateProjectStage } from "@/features/projects/actions";
import { getProject } from "@/features/projects/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Proje" };

export default async function TeamProjectPage({ params }: PageProps<"/yonetim/projeler/[id]">) {
  await requireStaff();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id) : null;
  if (!project) notFound();

  const documents = await listDocuments({ projectId: id });
  return (
    <ProjectView
      project={project}
      documents={documents}
      backHref="/yonetim/projeler"
      showCompany
      stageControl={<StageForm action={updateProjectStage.bind(null, id)} stage={project.stage} />}
      toggleAction={(milestoneId) => toggleMilestone.bind(null, id, milestoneId)}
    />
  );
}
