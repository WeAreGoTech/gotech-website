import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";
import { BackButton } from "@/components/app/AppShell";
import { AddCustomerForm } from "@/components/app/customer-forms";
import { DeviceList, InstallLinks, StatusUnknownNotice } from "@/components/app/devices";
import { DocumentList } from "@/components/app/documents";
import { Avatar } from "@/components/app/Icon";
import { ModalButton } from "@/components/app/Modal";
import { PeopleList, PeopleNotice, RemovedPeopleList } from "@/components/app/people";
import { ProjectCard } from "@/components/app/projects";
import { AddDocumentForm } from "@/components/app/staff-forms";
import { TicketList } from "@/components/app/TicketList";
import { demotePerson, promotePerson, removePerson, resendInvite, restorePerson } from "@/features/customers/actions";
import { getCompany, listCompanyPeople, listRemovedCompanyPeople } from "@/features/customers/queries";
import { removeDevice } from "@/features/devices/actions";
import { countDevicesByUser, listDevices } from "@/features/devices/queries";
import { addDocument } from "@/features/documents/actions";
import { listDocuments } from "@/features/documents/queries";
import { listProjects } from "@/features/projects/queries";
import { companyPage, readNotice } from "@/features/team/membership";
import { listCompanyTickets } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Müşteri" };

const PEOPLE_CONTROLS = {
  promote: (personId: string) => promotePerson.bind(null, personId),
  demote: (personId: string) => demotePerson.bind(null, personId),
  remove: (personId: string) => removePerson.bind(null, personId),
};

// The page's sections, one at a time; "kisiler" is the default, so people actions that redirect land on it.
const TABS = [
  { key: "kisiler", label: "Kişiler" },
  { key: "talepler", label: "Talepler" },
  { key: "projeler", label: "Projeler" },
  { key: "cihazlar", label: "Cihazlar" },
  { key: "dokumanlar", label: "Dokümanlar" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const pickTab = (value: string | undefined): TabKey => TABS.find((t) => t.key === value)?.key ?? "kisiler";

const Empty = ({ children }: { children: ReactNode }) => (
  <ul className="w-list">
    <li className="empty-row">{children}</li>
  </ul>
);

export default async function CompanyPage({ params, searchParams }: PageProps<"/yonetim/musteriler/[id]">) {
  await requireStaff();
  const [{ id }, { uyari, sekme }] = await Promise.all([params, searchParams]);
  const company = z.uuid().safeParse(id).success ? await getCompany(id) : null;
  if (!company) notFound();
  const tab = pickTab(readNotice(sekme));

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
  const closedTickets = tickets.filter((t) => t.status === "closed");
  const counts: Record<TabKey, number> = {
    kisiler: people.length,
    talepler: openTickets.length,
    projeler: projects.length,
    cihazlar: deviceList.devices.length,
    dokumanlar: documents.length,
  };
  const page = companyPage(id);

  return (
    <div className="profile">
      <BackButton href="/yonetim/musteriler" label="Müşterilere dön" />
      <header className="profile-head">
        <Avatar name={company.name} tone="customer" />
        <div>
          <h1>{company.name}</h1>
          <p>
            {formatDate(company.createdAt)} tarihinden beri müşteri · {people.length} kişi
          </p>
        </div>
      </header>

      <div className="w-actions">
        <ModalButton look="action" accent icon="plus" label="Müşteri ekle">
          <AddCustomerForm companyId={id} />
        </ModalButton>
        <ModalButton look="action" icon="file" label="Doküman paylaş">
          <AddDocumentForm action={addDocument.bind(null, id)} projects={projects.map((p) => ({ id: p.id, name: p.name }))} />
        </ModalButton>
        <ModalButton look="action" icon="download" label="Kurulum linki" title="GoTech Desk kurulum linki">
          <InstallLinks />
          <p className="muted">Kişi kurduktan sonra panel e-postası ve şifresiyle giriş yapar; bilgisayarı kendiliğinden firmaya eklenir.</p>
        </ModalButton>
      </div>

      <nav className="w-tabs" aria-label="Firma bölümleri">
        {TABS.map((t) => (
          <Link key={t.key} href={t.key === "kisiler" ? page : `${page}?sekme=${t.key}`} scroll={false} aria-current={tab === t.key ? "page" : undefined}>
            {t.label}
            <span className={`w-tab-count${t.key === "talepler" && counts.talepler > 0 ? " is-alert" : ""}`}>{counts[t.key]}</span>
          </Link>
        ))}
      </nav>

      {tab === "kisiler" && (
        <>
          <PeopleNotice message={readNotice(uyari)} />
          {people.length ? (
            <PeopleList
              people={people}
              tone="customer"
              deviceCounts={deviceCounts}
              resendAction={(personId) => resendInvite.bind(null, personId)}
              controls={PEOPLE_CONTROLS}
              setupLinks
              passwordReset
            />
          ) : (
            <Empty>Henüz kişi yok. &quot;Müşteri ekle&quot; ile ilk kişiyi ekleyin.</Empty>
          )}
          <RemovedPeopleList people={removedPeople} restore={(personId) => restorePerson.bind(null, personId)} />
        </>
      )}

      {tab === "talepler" && (
        <>
          <div className="w-group">
            <h3 className="w-group-title">Açık</h3>
            {openTickets.length ? <TicketList rows={openTickets} audience="staff" /> : <Empty>Açık talep yok.</Empty>}
          </div>
          {closedTickets.length > 0 && (
            <div className="w-group">
              <h3 className="w-group-title">Kapanan</h3>
              <TicketList rows={closedTickets} audience="staff" />
            </div>
          )}
        </>
      )}

      {tab === "projeler" &&
        (projects.length ? (
          <div className="projects">{projects.map((p) => <ProjectCard key={p.id} project={p} href={`/yonetim/projeler/${p.id}`} />)}</div>
        ) : (
          <Empty>Henüz proje yok. Projeler sayfasından yeni proje açabilirsiniz.</Empty>
        ))}

      {tab === "cihazlar" && (
        <>
          <StatusUnknownNotice show={!deviceList.statusKnown} />
          <DeviceList devices={deviceList.devices} audience="staff" removeAction={(deviceId) => removeDevice.bind(null, deviceId)} />
        </>
      )}

      {tab === "dokumanlar" && <DocumentList documents={documents} />}
    </div>
  );
}
