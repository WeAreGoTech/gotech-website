import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { PeopleList } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { StaffDeviceList } from "@/components/app/staff-devices";
import { listStaff } from "@/features/customers/queries";
import { listStaffDevices } from "@/features/devices/staff-devices";
import { inviteStaff } from "@/features/team/actions";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekip" };

export default async function TeamMembersPage() {
  const user = await requireStaff();
  const [staff, staffDevices] = await Promise.all([listStaff(), listStaffDevices()]);

  return (
    <>
      <PageHeader title="Ekip" description="Yönetim paneline girebilen GoTech ekibi. Talepler bu kişilere atanabilir." />
      <div className="t-layout">
        <div className="stack">
          <PeopleList people={staff} tone="team" youId={user.id} />
          <Section title="GoTech Desk bilgisayarları" href="/yonetim/hesap" linkLabel="Kendi bilgisayarlarım">
            <p className="desk-notice notice">
              Müşteri bilgisayarlarına yalnızca bu listedeki bilgisayarlar bağlanabilir. Herkes kendi bilgisayarlarını hesap sayfasından ekler.
            </p>
            <StaffDeviceList devices={staffDevices} />
          </Section>
        </div>
        <InvitePersonForm action={inviteStaff} title="Ekibe kişi ekle" submitLabel="Davet gönder" hint="Kişi şifresini belirleyince yönetim paneline girebilir." />
      </div>
    </>
  );
}
