import { notFound } from "next/navigation";
import { getProfile } from "@/features/account/queries";
import { NotificationForm, PasswordForm, ProfileForm } from "./account-forms";
import { PageHeader } from "./AppShell";

export async function AccountView({ userId }: { userId: string }) {
  const profile = await getProfile(userId);
  if (!profile) notFound();

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="Hesabım" description="Profil bilgileriniz, şifreniz ve bildirim tercihleriniz." />
      <div className="stack">
        <ProfileForm profile={profile} />
        <PasswordForm />
        <NotificationForm enabled={profile.notifyByEmail} audience={profile.role} />
      </div>
    </div>
  );
}
