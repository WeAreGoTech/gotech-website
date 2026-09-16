import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { InvoiceForm } from "@/components/app/InvoiceForm";
import { listCompaniesWithCustomers } from "@/features/customers/queries";
import { listProjects } from "@/features/projects/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Fatura kes" };

export default async function NewInvoicePage() {
  await requireStaff();
  const [companies, projects] = await Promise.all([listCompaniesWithCustomers(), listProjects()]);
  const options = companies.map((c) => ({
    id: c.id,
    name: c.name,
    projects: projects.filter((p) => p.companyId === c.id).map((p) => ({ id: p.id, name: p.name })),
  }));

  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader back={{ href: "/yonetim/faturalar", label: "Faturalara dön" }} title="Fatura kes" description="Tutarlar KDV hariç girilir; toplam KDV dahil hesaplanır." />
      <InvoiceForm companies={options} />
    </div>
  );
}
