import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackButton } from "@/components/app/AppShell";
import { Section, Stat } from "@/components/app/dashboard";
import { DeviceList, InstallLinks, StatusUnknownNotice } from "@/components/app/devices";
import { DocumentList } from "@/components/app/documents";
import { Icon } from "@/components/app/Icon";
import { PeopleList, PeopleNotice, RemovedPeopleList } from "@/components/app/people";
import { ProjectCard } from "@/components/app/projects";
import { AddDocumentForm } from "@/components/app/staff-forms";
import { AddPersonForm } from "@/components/app/team-forms";
import { TicketList } from "@/components/app/TicketList";
import { demotePerson, promotePerson, removePerson, resendInvite, restorePerson } from "@/features/customers/actions";
import { getCompany, listCompanyPeople, listRemovedCompanyPeople } from "@/features/customers/queries";
import { removeDevice } from "@/features/devices/actions";
import { countDevicesByUser, listDevices } from "@/features/devices/queries";
import { addDocument } from "@/features/documents/actions";
import { listDocuments } from "@/features/documents/queries";
import { listProjects } from "@/features/projects/queries";
import { readNotice } from "@/features/team/membership";
import { listCompanyTickets } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Müşteri" };

const PEOPLE_CONTROLS = {
  promote: (personId: string) => promotePerson.bind(null, personId),
  demote: (personId: string) => demotePerson.bind(null, personId),
  remove: (personId: string) => removePerson.bind(null, personId),
};

export default async function CompanyPage({ params, searchParams }: PageProps<"/yonetim/musteriler/[id]">) {
  await requireStaff();
  const [{ id }, { uyari }] = await Promise.all([params, searchParams]);
  const company = z.uuid().safeParse(id).success ? await getCompany(id) : null;
  if (!company) notFound();

  const [people, removedPeople, projects, documents, tickets, deviceList, deviceCounts] = await Promise.all([
    listCompanyPeople(id),
    listRemovedCompanyPeople(id),
    listProjects(id),
    listDocuments({ companyId: id }),
    listCompanyTickets(id),
    listDevices(id),
    countDevicesByUser(id),
  ]);
  const openTickets = tickets.filter((t) => t.status !== "closed");

  return (
    <>
      <BackButton href="/yonetim/musteriler" label="Müşterilere dön" />
      <header className="t-head">
        <span className="w-icon is-large"><Icon name="building" size={24} /></span>
        <div className="t-head-text">
          <h1>{company.name}</h1>
          <div className="t-meta">
            <span>{formatDate(company.createdAt)} tarihinden beri müşteri</span>
            <span>Firma kodu: <b>{company.customerCode}</b></span>
          </div>
        </div>
      </header>

      <div className="stats">
        <Stat hero label="Açık talepler" icon="inbox" value={openTickets.length} note={`Toplam ${tickets.length} talep`} />
        <Stat label="Projeler" icon="folder" value={projects.length} note={`${projects.filter((p) => p.stage === "live").length} canlıda`} />
        <Stat label="Firma kodu" icon="monitor" value={company.customerCode} note={`${deviceList.devices.length} cihaz kayıtlı`} />
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
          <Section title="Dokümanlar"><DocumentList documents={documents} /></Section>
        </div>
        <div>
          <Section title="Kişiler">
            <PeopleNotice message={readNotice(uyari)} />
            <PeopleList
              people={people}
              tone="customer"
              deviceCounts={deviceCounts}
              resendAction={(personId) => resendInvite.bind(null, personId)}
              controls={PEOPLE_CONTROLS}
              setupLinks
            />
            <AddPersonForm companyId={id} />
            <RemovedPeopleList people={removedPeople} restore={(personId) => restorePerson.bind(null, personId)} />
          </Section>
          <Section title="Cihazlar" href="/yonetim/cihazlar" linkLabel="Tüm cihazlar">
            <InstallLinks customerCode={company.customerCode} />
            <StatusUnknownNotice show={!deviceList.statusKnown} />
            <DeviceList devices={deviceList.devices} audience="staff" removeAction={(deviceId) => removeDevice.bind(null, deviceId)} />
          </Section>
          <Section title="Doküman paylaş">
            <AddDocumentForm action={addDocument.bind(null, id)} projects={projects.map((p) => ({ id: p.id, name: p.name }))} />
          </Section>
        </div>
      </div>
    </>
  );
}
