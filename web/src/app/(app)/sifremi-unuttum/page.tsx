import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/app/auth-forms";
import { AuthLayout } from "@/components/app/AuthLayout";

export const metadata: Metadata = { title: "Şifremi unuttum" };

// Also opened from the GoTech Desk app's sign-in dialog, where the panel password is now what registers a computer.
export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Şifrenizi mi unuttunuz?"
      text="E-posta adresinizi yazın, yeni şifre belirlemeniz için bir bağlantı gönderelim. Davet e-postanız kaybolduysa da buradan yenisini alabilirsiniz."
    >
      <ForgotPasswordForm />
      <Link className="muted" href="/giris" style={{ fontSize: ".9rem" }}>Giriş sayfasına dön</Link>
    </AuthLayout>
  );
}
