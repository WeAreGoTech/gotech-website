import type { Metadata } from "next";
import { Contact } from "@/components/home/ContactSection";
import { ReferenceBand, SoftwareHero } from "@/components/yazilim/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Yazılım çözümleri: web, portal, e-ticaret ve Mikro'ya özel geliştirme",
  description: "GoTech'in kendi yazılım ekibiyle kurumlara özel web siteleri, e-ticaret, müşteri ve bayi portalları, saha panelleri ve Mikro'ya özel ekran, rapor ve entegrasyonlar. İzmir.",
};

/** Yazılım: giriş ve geliştirdiğimiz yazılım türleri (süzülebilir), referans ve iletişim. */
export default async function YazilimCozumleriPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <SoftwareHero />
      <ReferenceBand />
      <Contact
        settings={settings}
        content={content}
        title="Projenizi anlatın"
        lead="Ne yapmak istediğinizi kısaca yazın; yazılım ekibimiz değerlendirip size dönsün."
        submitLabel="Projeyi anlatın"
        note="Mesajınız yazılım ekibimize düşer; ihtiyacınızı konuşmak için sizinle iletişime geçiyoruz."
      />
    </main>
  );
}
