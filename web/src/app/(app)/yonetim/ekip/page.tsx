import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { PeopleList, PeopleNotice, RemovedPeopleList } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { StaffDeviceList } from "@/components/app/staff-devices";
import { listCompaniesWithCustomers, listRemovedStaff, listStaff } from "@/features/customers/queries";
import { listStaffDevices } from "@/features/devices/staff-devices";
import { invitePerson, removeStaffMember, restoreStaffMember } from "@/features/team/actions";
import { readNotice } from "@/features/team/membership";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekip" };

export default async function TeamMembersPage({ searchParams }: PageProps<"/yonetim/ekip">) {
  const user = await requireStaff();
  const [{ uyari }, staff, removedStaff, staffDevices, companies] = await Promise.all([
    searchParams,
    listStaff(),
    listRemovedStaff(),
    listStaffDevices(),
    listCompaniesWithCustomers(),
  ]);

  return (
    <>
      <PageHeader title="Ekip" description="Yönetim paneline girebilen GoTech ekibi. Talepler bu kişilere atanabilir." />
      <div className="t-layout">
        <div className="stack">
          <PeopleNotice message={readNotice(uyari)} />
          <PeopleList people={staff} tone="team" youId={user.id} removeAction={(personId) => removeStaffMember.bind(null, personId)} />
          <RemovedPeopleList
            people={removedStaff}
            tone="team"
            restore={(personId) => restoreStaffMember.bind(null, personId)}
            hint="Geri alınan kişi eski şifresiyle girer; GoTech Desk bilgisayarları yeniden ekip listesine döner."
          />
          <Section title="GoTech Desk bilgisayarları" href="/yonetim/hesap" linkLabel="Kendi bilgisayarlarım">
            <p className="desk-notice notice">
              Müşteri bilgisayarlarına yalnızca bu listedeki bilgisayarlar bağlanabilir. GoTech Desk&apos;e ekip hesabıyla giriş yapılan bilgisayar listeye kendiliğinden eklenir; diğerleri hesap sayfasından eklenir.
            </p>
            <StaffDeviceList devices={staffDevices} />
          </Section>
        </div>
        <InvitePersonForm
          action={invitePerson}
          title="Kişi ekle"
          submitLabel="Davet gönder"
          hint="Kişi şifresini belirleyince yönetim paneline girebilir."
          companies={companies.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </>
  );
}
