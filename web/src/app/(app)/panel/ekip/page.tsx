import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { PeopleList } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { listCompanyPeople } from "@/features/customers/queries";
import { countDevicesByUser } from "@/features/devices/queries";
import { inviteColleague } from "@/features/team/actions";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekibim" };

export default async function CustomerTeamPage() {
  const user = await requireCustomer();
  const [people, deviceCounts] = await Promise.all([listCompanyPeople(user.companyId), countDevicesByUser(user.companyId)]);

  return (
    <>
      <PageHeader title="Ekibim" description="Firmanızdan panele girebilen kişiler. Talepleri, projeleri ve dokümanları hepsi görebilir." />
      <div className="t-layout">
        <PeopleList people={people} tone="customer" youId={user.id} deviceCounts={deviceCounts} />
        <InvitePersonForm
          action={inviteColleague}
          title="İş arkadaşı ekle"
          submitLabel="Davet gönder"
          hint="Kişiye şifre belirleme bağlantısı içeren bir e-posta gider."
        />
      </div>
    </>
  );
}
