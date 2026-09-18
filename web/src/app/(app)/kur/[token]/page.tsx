import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/app/AuthLayout";
import { Icon } from "@/components/app/Icon";
import { findSetupLink } from "@/features/devices/setup-links";
import { formatDate } from "@/lib/format";

// personal links: never in a search index
export const metadata: Metadata = { title: "GoTech Desk kurulumu", robots: { index: false, follow: false } };

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export default async function SetupPage({ params }: PageProps<"/kur/[token]">) {
  const { token } = await params;
  const person = await findSetupLink(token);

  if (!person) {
    return (
      <AuthLayout heading="Bağlantı geçersiz" text="Bu kurulum bağlantısının süresi dolmuş ya da daha önce kullanılmış.">
        <p className="notice">GoTech ekibinden size yeni bir kurulum bağlantısı göndermesini isteyin.</p>
        <Link className="btn btn-ghost" href="/">Ana sayfa</Link>
      </AuthLayout>
    );
  }

  const staff = person.role === "staff";
  return (
    <AuthLayout
      heading={`Merhaba ${firstName(person.name)}`}
      text={staff ? "GoTech ekip bilgisayarınıza GoTech Desk'i kurun." : `${person.companyName ?? "Firmanız"} için bilgisayarınıza GoTech Desk'i kurun.`}
    >
      <ol className="desk-steps">
        <li>
          <strong>Windows:</strong> indirip açın.{" "}
          {staff
            ? "Uygulama e-postanız dolu olarak açılır, şifrenizle giriş yaparsınız."
            : "Bilgisayarınız şifre sormadan adınıza kaydolur."}
        </li>
        <li>
          <strong>Mac:</strong> indirin, uygulamayı Uygulamalar klasörüne sürükleyip bir kez açın, sonra aşağıdaki
          &quot;Bu Mac&apos;i bağla&quot; düğmesine basın.
        </li>
      </ol>
      <div className="desk-downloads">
        <a className="btn" href={`/kur/${token}/windows`}>
          <Icon name="download" size={18} />
          Windows için indir
        </a>
        <a className="btn btn-ghost" href={`/kur/${token}/mac`}>
          <Icon name="download" size={18} />
          macOS için indir
        </a>
        <a className="btn btn-ghost" href={`gotechdesk://kur/${token}`}>
          Bu Mac&apos;i bağla
        </a>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>
        Bu bağlantı size özeldir ve bir kez kullanılır; {formatDate(person.expiresAt)} tarihine kadar geçerlidir. Kimseyle paylaşmayın.
      </p>
    </AuthLayout>
  );
}
