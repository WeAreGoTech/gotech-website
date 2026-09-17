import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getProfile } from "@/features/account/queries";
import { NotificationForm, PasswordForm, ProfileForm } from "./account-forms";
import { PageHeader } from "./AppShell";

/** extra: cards only one of the two panels shows, e.g. the team's own GoTech Desk computers. */
export async function AccountView({ userId, extra }: { userId: string; extra?: ReactNode }) {
  const profile = await getProfile(userId);
  if (!profile) notFound();

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="Hesabım" description="Profil bilgileriniz, şifreniz ve bildirim tercihleriniz." />
      <div className="stack">
        <ProfileForm profile={profile} />
        {extra}
        <PasswordForm />
        <NotificationForm enabled={profile.notifyByEmail} audience={profile.role} />
      </div>
    </div>
  );
}
