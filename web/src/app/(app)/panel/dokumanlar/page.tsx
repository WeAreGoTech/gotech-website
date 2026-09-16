import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { DocumentList } from "@/components/app/documents";
import { listDocuments } from "@/features/documents/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Dokümanlar" };

export default async function CustomerDocumentsPage() {
  const user = await requireCustomer();
  const documents = await listDocuments({ companyId: user.companyId });

  return (
    <>
      <PageHeader title="Dokümanlar" description="Sözleşmeler, teklifler, kullanım kılavuzları ve bakım raporları. Açmak için üzerine tıklayın." />
      <DocumentList documents={documents} />
    </>
  );
}
