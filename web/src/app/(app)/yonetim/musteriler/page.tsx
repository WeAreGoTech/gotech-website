import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/AppShell";
import { Icon } from "@/components/app/Icon";
import { InviteCustomerForm } from "@/components/app/team-forms";
import { listCompaniesWithCustomers } from "@/features/customers/queries";
import { listProjects } from "@/features/projects/queries";
import { countOpenTicketsByCompany } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Müşteriler" };

export default async function CustomersPage() {
  await requireStaff();
  const [companies, projects, openTickets] = await Promise.all([listCompaniesWithCustomers(), listProjects(), countOpenTicketsByCompany()]);

  const summary = (companyId: string) => {
    const active = projects.filter((p) => p.companyId === companyId && p.stage !== "live").length;
    return { active, open: openTickets.get(companyId) ?? 0 };
  };

  return (
    <>
      <PageHeader title="Müşteriler" description="Firmalar, panele girebilen kişiler, projeler ve açık talepler." />
      <div className="t-layout">
        <ul className="w-list">
          {companies.map((company) => {
            const { active, open } = summary(company.id);
            return (
              <li key={company.id}>
                <Link className="w-row" href={`/yonetim/musteriler/${company.id}`}>
                  <span className="w-icon"><Icon name="building" size={18} /></span>
                  <span className="w-row-main">
                    <strong>{company.name}</strong>
                    <small>{company.customers.length} kişi, {active} süren proje</small>
                  </span>
                  <span className="w-row-side">
                    <span className="amount">{open}</span>
                    <small>açık talep</small>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <InviteCustomerForm companies={companies.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </>
  );
}
