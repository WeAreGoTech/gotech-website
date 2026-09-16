import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { PeopleList } from "@/components/app/people";
import { InvitePersonForm } from "@/components/app/staff-forms";
import { listStaff } from "@/features/customers/queries";
import { inviteStaff } from "@/features/team/actions";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ekip" };

export default async function TeamMembersPage() {
  const user = await requireStaff();
  const staff = await listStaff();

  return (
    <>
      <PageHeader title="Ekip" description="Yönetim paneline girebilen GoTech ekibi. Talepler bu kişilere atanabilir." />
      <div className="t-layout">
        <PeopleList people={staff} tone="team" youId={user.id} />
        <InvitePersonForm action={inviteStaff} title="Ekibe kişi ekle" submitLabel="Davet gönder" hint="Kişi şifresini belirleyince yönetim paneline girebilir." />
      </div>
    </>
  );
}
