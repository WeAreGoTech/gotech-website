import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { PeopleList, PeopleNotice } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { listCompanyPeople } from "@/features/customers/queries";
import { countDevicesByUser } from "@/features/devices/queries";
import { demoteColleague, inviteColleague, promoteColleague, removeColleague } from "@/features/team/actions";
import { readNotice } from "@/features/team/membership";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekibim" };

export default async function CustomerTeamPage({ searchParams }: PageProps<"/panel/ekip">) {
  const user = await requireCustomer();
  const [{ uyari }, people, deviceCounts] = await Promise.all([searchParams, listCompanyPeople(user.companyId), countDevicesByUser(user.companyId)]);

  return (
    <>
      <PageHeader title="Ekibim" description="Firmanızdan panele girebilen kişiler. Talepleri, projeleri ve dokümanları hepsi görebilir." />
      <PeopleNotice message={readNotice(uyari)} />
      <div className="t-layout">
        <PeopleList
          people={people}
          tone="customer"
          youId={user.id}
          deviceCounts={deviceCounts}
          controls={
            user.isCompanyAdmin
              ? {
                  promote: (personId) => promoteColleague.bind(null, personId),
                  demote: (personId) => demoteColleague.bind(null, personId),
                  remove: (personId) => removeColleague.bind(null, personId),
                }
              : undefined
          }
        />
        {user.isCompanyAdmin ? (
          <InvitePersonForm
            action={inviteColleague}
            title="İş arkadaşı ekle"
            submitLabel="Davet gönder"
            hint="Kişiye şifre belirleme bağlantısı içeren bir e-posta gider."
          />
        ) : (
          <p className="card muted">Kişileri yalnızca firma yetkilisi ekleyip çıkarabilir. Yeni bir kişi gerekiyorsa firma yetkilinizle görüşün.</p>
        )}
      </div>
    </>
  );
}
