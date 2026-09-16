import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectView } from "@/components/app/ProjectView";
import { listDocuments } from "@/features/documents/queries";
import { listInvoices } from "@/features/invoices/queries";
import { getProject } from "@/features/projects/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Proje" };

export default async function CustomerProjectPage({ params }: PageProps<"/panel/projeler/[id]">) {
  const user = await requireCustomer();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id, user.companyId) : null;
  if (!project) notFound();

  const [documents, invoices] = await Promise.all([listDocuments({ companyId: user.companyId, projectId: id }), listInvoices(user.companyId)]);
  return (
    <ProjectView
      project={project}
      documents={documents}
      invoices={invoices.filter((i) => i.projectId === id)}
      backHref="/panel/projeler"
      invoiceBase="/panel/faturalar"
    />
  );
}
