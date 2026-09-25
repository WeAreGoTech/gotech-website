import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/app/auth-forms";
import { AuthLayout } from "@/components/app/AuthLayout";
import { DEMO_ACCOUNTS } from "@/db/seed";
import { getCurrentUser, homeFor } from "@/lib/auth/session";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Giriş" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(homeFor(user.role));

  return (
    <AuthLayout heading="Tekrar hoş geldiniz" text="Destek taleplerinizi açmak ve takip etmek için giriş yapın.">
      <LoginForm />
      <p className="muted" style={{ margin: 0, fontSize: ".9rem" }}>
        Şifrenizi unuttuysanız <Link href="/sifremi-unuttum">yeni bağlantı isteyin</Link>.
      </p>
      <p className="muted" style={{ margin: 0, fontSize: ".9rem" }}>Hesabınız yok mu? Hesapları GoTech ekibi açar ve giriş bilgilerinizi size iletir.</p>
      {!env.isProduction && (
        <div className="demo-box">
          <p><b>Deneme hesapları</b>, yalnızca geliştirmede görünür</p>
          <p>Ekip: {DEMO_ACCOUNTS.staff.email} / {DEMO_ACCOUNTS.staff.password}</p>
          <p>Müşteri: {DEMO_ACCOUNTS.customer.email} / {DEMO_ACCOUNTS.customer.password}</p>
        </div>
      )}
    </AuthLayout>
  );
}
