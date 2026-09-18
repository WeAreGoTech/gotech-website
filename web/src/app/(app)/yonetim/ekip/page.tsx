import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { PeopleList } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { StaffDeviceList } from "@/components/app/staff-devices";
import { listCompaniesWithCustomers, listStaff } from "@/features/customers/queries";
import { listStaffDevices } from "@/features/devices/staff-devices";
import { invitePerson } from "@/features/team/actions";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekip" };

export default async function TeamMembersPage() {
  const user = await requireStaff();
  const [staff, staffDevices, companies] = await Promise.all([listStaff(), listStaffDevices(), listCompaniesWithCustomers()]);

  return (
    <>
      <PageHeader title="Ekip" description="Yönetim paneline girebilen GoTech ekibi. Talepler bu kişilere atanabilir." />
      <div className="t-layout">
        <div className="stack">
          <PeopleList people={staff} tone="team" youId={user.id} />
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
