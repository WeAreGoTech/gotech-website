import type { Metadata } from "next";
import { About, Beyond, Faq } from "@/components/home/CompanySections";
import { Contact, HomeFooter } from "@/components/home/ContactSection";
import { Hero, PartnerBand, ReferenceStrip } from "@/components/home/Hero";
import { HomeEffects } from "@/components/home/HomeEffects";
import h from "@/components/home/home.module.css";
import { HomeNav } from "@/components/home/HomeNav";
import { Notice } from "@/components/home/Notice";
import { SectionHead } from "@/components/home/parts";
import { ProductFinder } from "@/components/home/ProductFinder";
import { Services } from "@/components/home/ServiceSections";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import type { SiteSettings } from "@/components/kurumsal/content";
import { getSiteConfig } from "@/features/site-content/queries";

// Telefon, adres, hero metni ve rakamlar panelden okunuyor: sayfa build anında dondurulmamalı.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "GoTech | Mikro Yazılım Yetkili İş Ortağı · İzmir" },
  description:
    "Mikro Yazılım kurulumu, e-Dönüşüm, eğitim ve teknik destek. 2017'den beri İzmir'de yetkili iş ortağı; Mikro Jump Basic, Jump, Jump Bulut ve Fly.",
};

const ROOT_ID = "anasayfa";

/** Arama motorları için işletme bilgisi (yalnız doğrulanmış alanlar; adres ve saat panelden). */
function businessJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "GoTech",
    description: "Mikro Yazılım yetkili iş ortağı: Mikro kurulumu, e-Dönüşüm, eğitim ve destek.",
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

export default async function HomePage() {
  const { settings, content } = await getSiteConfig();

  return (
    <div id={ROOT_ID} className={h.home}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(settings)).replace(/</g, "\\u003c") }} />
      <SmoothScroll />
      <HomeEffects rootId={ROOT_ID} />
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <Notice />
      <HomeNav />
      <main id="icerik">
        <Hero content={content} />
        <PartnerBand content={content} />
        <ReferenceStrip />
        <section className={`${h.sec} ${h.ground}`} id="urunler">
          <div className={h.wrap}>
            <SectionHead
              center
              eyebrow="Ürün bulucu"
              title="Size uygun Mikro'yu birlikte bulalım"
              lede="İşletmenizi tek cümleyle anlatın, uygun Mikro ürünü hemen öne çıksın. Kesin seçimi ücretsiz keşif görüşmesinde birlikte yapıyoruz."
            />
            <ProductFinder />
          </div>
        </section>
        <Services settings={settings} />
        <Beyond />
        <About settings={settings} />
        <Faq />
        <Contact settings={settings} content={content} />
      </main>
      <HomeFooter settings={settings} content={content} onHome />
    </div>
  );
}
