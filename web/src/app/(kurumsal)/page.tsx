import type { Metadata } from "next";
import type { SiteSettings } from "@/components/kurumsal/content";
import { Contact } from "@/components/site/ui/Contact";
import { Intro, Products, Services, Software } from "@/components/vitrin/Sections";
import { Stage } from "@/components/vitrin/Stage";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: { absolute: "GoTech | Mikro Yazılım İş Ortağı · İzmir" },
  description:
    "İzmir'de Mikro Jump ve Mikro Fly yetkili bayisi: satış, kurulum, e-Dönüşüm, eğitim ve destek. 2017'den beri Mikro Yazılım iş ortağı; Jumper ve Flyer Silver Partner.",
};

/** Arama motorları için işletme bilgisi (yalnız doğrulanmış alanlar; adres ve saat panelden). */
function businessJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "GoTech",
    description: "Mikro Yazılım yetkili bayisi ve iş ortağı: Mikro Jump ve Mikro Fly satışı, kurulumu, e-Dönüşüm, eğitim ve destek.",
    url: process.env.SITE_URL || "http://localhost:3000",
    email: settings.email,
    ...(settings.salesPhone && { telephone: settings.salesPhone }),
    foundingDate: "2017",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.split("\n").slice(0, 2).join(", "),
      addressLocality: "İzmir",
      addressCountry: "TR",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: "İzmir",
  };
}

/**
 * Ana sayfa ("vitrin", 29.09): az metin, fotoğraf ağırlıklı. Giriş + imiyle açılan fotoğraf sahnesi (kim, ne, Mikro logosu),
 * kısa tanıtım, genişleyen hizmet panelleri, Jump/Fly seçicisi, özel yazılım ve iletişim.
 */
export default async function HomePage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(settings)).replace(/</g, "\\u003c") }} />
      <Stage content={content} />
      <Intro />
      <Services />
      <Products />
      <Software />
      <Contact settings={settings} content={content} />
    </main>
  );
}
