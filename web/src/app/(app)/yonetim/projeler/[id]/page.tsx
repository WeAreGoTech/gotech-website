import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectView } from "@/components/app/ProjectView";
import { StageForm } from "@/components/app/staff-forms";
import { listDocuments } from "@/features/documents/queries";
import { listInvoices } from "@/features/invoices/queries";
import { toggleMilestone, updateProjectStage } from "@/features/projects/actions";
import { getProject } from "@/features/projects/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Proje" };

export default async function TeamProjectPage({ params }: PageProps<"/yonetim/projeler/[id]">) {
  await requireStaff();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id) : null;
  if (!project) notFound();

  const [documents, invoices] = await Promise.all([listDocuments({ projectId: id }), listInvoices(project.companyId)]);
  return (
    <ProjectView
      project={project}
      documents={documents}
      invoices={invoices.filter((i) => i.projectId === id)}
      backHref="/yonetim/projeler"
      invoiceBase="/yonetim/faturalar"
      showCompany
      stageControl={<StageForm action={updateProjectStage.bind(null, id)} stage={project.stage} />}
      toggleAction={(milestoneId) => toggleMilestone.bind(null, id, milestoneId)}
    />
  );
}
