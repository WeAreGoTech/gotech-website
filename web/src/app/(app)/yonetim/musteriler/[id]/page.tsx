import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackButton } from "@/components/app/AppShell";
import { Section, Stat } from "@/components/app/dashboard";
import { DocumentList } from "@/components/app/documents";
import { Icon } from "@/components/app/Icon";
import { InvoiceList } from "@/components/app/invoices";
import { PeopleList } from "@/components/app/people";
import { ProjectCard } from "@/components/app/projects";
import { AddDocumentForm } from "@/components/app/staff-forms";
import { TicketList } from "@/components/app/TicketList";
import { resendInvite } from "@/features/customers/actions";
import { getCompany, listCompanyPeople } from "@/features/customers/queries";
import { addDocument } from "@/features/documents/actions";
import { listDocuments } from "@/features/documents/queries";
import { listInvoices } from "@/features/invoices/queries";
import { listProjects } from "@/features/projects/queries";
import { listCompanyTickets } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";
import { formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Müşteri" };

export default async function CompanyPage({ params }: PageProps<"/yonetim/musteriler/[id]">) {
  await requireStaff();
  const { id } = await params;
  const company = z.uuid().safeParse(id).success ? await getCompany(id) : null;
  if (!company) notFound();

  const [people, projects, invoices, documents, tickets] = await Promise.all([
    listCompanyPeople(id),
    listProjects(id),
    listInvoices(id),
    listDocuments({ companyId: id }),
    listCompanyTickets(id),
  ]);
  const unpaid = invoices.filter((i) => i.state === "pending" || i.state === "overdue");
  const overdue = unpaid.filter((i) => i.state === "overdue");
  const openTickets = tickets.filter((t) => t.status !== "closed");

  return (
    <>
      <BackButton href="/yonetim/musteriler" label="Müşterilere dön" />
      <header className="t-head">
        <span className="w-icon is-large"><Icon name="building" size={24} /></span>
        <div className="t-head-text">
          <h1>{company.name}</h1>
          <div className="t-meta"><span>{formatDate(company.createdAt)} tarihinden beri müşteri</span></div>
        </div>
      </header>

      <div className="stats">
        <Stat hero label="Açık bakiye" icon="wallet" value={formatMoney(unpaid.reduce((s, i) => s + i.total, 0))} note={overdue.length ? `${overdue.length} fatura vadesi geçmiş` : `${unpaid.length} fatura bekliyor`} alert={overdue.length > 0} />
        <Stat label="Açık talepler" icon="inbox" value={openTickets.length} note={`Toplam ${tickets.length} talep`} />
        <Stat label="Projeler" icon="folder" value={projects.length} note={`${projects.filter((p) => p.stage === "live").length} canlıda`} />
      </div>

      <div className="two-col">
        <div>
          <Section title="Açık talepler">
            {openTickets.length ? <TicketList rows={openTickets} audience="staff" /> : <ul className="w-list"><li className="empty-row">Açık talep yok.</li></ul>}
          </Section>
          <Section title="Projeler">
            {projects.length ? (
              <div className="projects">{projects.map((p) => <ProjectCard key={p.id} project={p} href={`/yonetim/projeler/${p.id}`} />)}</div>
            ) : (
              <ul className="w-list"><li className="empty-row">Henüz proje yok. Projeler sayfasından yeni proje açabilirsiniz.</li></ul>
            )}
          </Section>
          <Section title="Faturalar"><InvoiceList invoices={invoices} basePath="/yonetim/faturalar" /></Section>
          <Section title="Dokümanlar"><DocumentList documents={documents} /></Section>
        </div>
        <div>
          <Section title="Kişiler">
            <PeopleList people={people} tone="customer" resendAction={(personId) => resendInvite.bind(null, personId)} />
          </Section>
          <Section title="Doküman paylaş">
            <AddDocumentForm action={addDocument.bind(null, id)} projects={projects.map((p) => ({ id: p.id, name: p.name }))} />
          </Section>
        </div>
      </div>
    </>
  );
}
