import type { Metadata } from "next";
import Link from "next/link";
import { SetPasswordForm } from "@/components/app/auth-forms";
import { AuthLayout } from "@/components/app/AuthLayout";
import { findUsablePasswordToken } from "@/lib/auth/password-tokens";

export const metadata: Metadata = { title: "Şifre belirleyin" };

export default async function SetPasswordPage({ searchParams }: PageProps<"/sifre-belirle">) {
  const { token } = await searchParams;
  const rawToken = typeof token === "string" ? token : "";
  const usable = rawToken ? await findUsablePasswordToken(rawToken) : null;

  return (
    <AuthLayout heading="Şifrenizi belirleyin" text="Kaydettiğiniz anda panelinize giriş yapmış olursunuz.">
      {usable ? (
        <SetPasswordForm token={rawToken} />
      ) : (
        <>
          <p className="notice">Bu bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir bağlantı isteyebilirsiniz.</p>
          <Link className="btn" href="/sifremi-unuttum">Yeni bağlantı iste</Link>
          <Link className="muted" href="/giris" style={{ fontSize: ".9rem" }}>Giriş sayfasına git</Link>
        </>
      )}
    </AuthLayout>
  );
}
