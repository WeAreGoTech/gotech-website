import type { Metadata } from "next";
import type { SiteSettings } from "@/components/kurumsal/content";
import { HOME_FAQ } from "@/components/site/content";
import { Hero } from "@/components/site/home/Hero";
import { Intro } from "@/components/site/home/Intro";
import { EDocs, Process, Products, Software } from "@/components/site/home/Sections";
import { Support } from "@/components/site/home/Support";
import { Contact } from "@/components/site/ui/Contact";
import { Faq } from "@/components/site/ui/Faq";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: { absolute: "GoTech | Mikro Yazılım İş Ortağı · İzmir" },
  description:
    "Mikro Jump ve Mikro Fly kurulumu, e-Dönüşüm, eğitim ve destek. 2017'den beri İzmir'de Mikro Yazılım iş ortağı; Jumper ve Flyer Silver Partner.",
};

/** Arama motorları için işletme bilgisi (yalnız doğrulanmış alanlar; adres ve saat panelden). */
function businessJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "GoTech",
    description: "Mikro Yazılım iş ortağı: Mikro Jump ve Mikro Fly kurulumu, e-Dönüşüm, eğitim ve destek.",
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
 * Ana sayfa: kim olduğumuz ve ne yaptığımız (giriş), kısa tanıtım, hangi Mikro (ürün bulucu), nasıl çalıştığımız
 * (altı adım), e-Dönüşüm, kurulum sonrası destek, özel yazılım, SSS ve iletişim.
 */
export default async function HomePage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(settings)).replace(/</g, "\\u003c") }} />
      <Hero content={content} />
      <Intro />
      <Products />
      <Process />
      <EDocs />
      <Support hours={settings.workingHours} phone={settings.supportPhone || settings.salesPhone} />
      <Software />
      <Faq items={HOME_FAQ} />
      <Contact settings={settings} content={content} />
    </main>
  );
}
