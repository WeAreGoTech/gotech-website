import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { SiteTextsForm } from "@/components/app/site-content";
import { getSiteConfig } from "@/features/site-content/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Site içeriği" };

export default async function SiteContentPage() {
  await requireStaff();
  const { settings, content } = await getSiteConfig();

  return (
    <div style={{ maxWidth: 820 }}>
      <PageHeader
        title="Site içeriği"
        description="Sitenin iletişim bilgileri, giriş bölümü metinleri, rakamlar ve alt bilgi."
        actions={<a className="btn btn-ghost btn-small" href="/" target="_blank" rel="noreferrer">Siteyi aç</a>}
      />
      <SiteTextsForm settings={settings} content={content} />
    </div>
  );
}
