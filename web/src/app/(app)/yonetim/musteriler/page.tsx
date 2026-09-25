import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { CompanyList } from "@/components/app/company-list";
import { AddCustomerForm } from "@/components/app/customer-forms";
import { ModalButton } from "@/components/app/Modal";
import { listCompaniesWithCustomers } from "@/features/customers/queries";
import { listProjects } from "@/features/projects/queries";
import { countOpenTicketsByCompany } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Müşteriler" };

export default async function CustomersPage() {
  await requireStaff();
  const [companies, projects, openTickets] = await Promise.all([listCompaniesWithCustomers(), listProjects(), countOpenTicketsByCompany()]);

  const rows = companies.map((company) => ({
    id: company.id,
    name: company.name,
    people: company.customers.length,
    activeProjects: projects.filter((p) => p.companyId === company.id && p.stage !== "live").length,
    openTickets: openTickets.get(company.id) ?? 0,
    closed: company.closedAt !== null,
    search: [company.name, ...company.customers.flatMap((p) => [p.name, p.email])].join(" ").toLocaleLowerCase("tr-TR"),
  }));

  return (
    <div className="profile">
      <PageHeader
        title="Müşteriler"
        description="Müşteri firmaları ve panele girebilen kişiler."
        actions={
          <ModalButton icon="plus" label="Müşteri ekle">
            <AddCustomerForm companies={companies.filter((c) => !c.closedAt).map((c) => ({ id: c.id, name: c.name }))} />
          </ModalButton>
        }
      />
      <CompanyList rows={rows} />
    </div>
  );
}
