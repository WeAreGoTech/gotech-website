import type { Metadata } from "next";
import { About, Beyond, Faq } from "@/components/home/CompanySections";
import { Contact, HomeFooter } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { CtaBand, Modules, Process } from "@/components/home/HomeBands";
import { HomeEffects } from "@/components/home/HomeEffects";
import h from "@/components/home/home.module.css";
import { HomeNav } from "@/components/home/HomeNav";
import { Notice } from "@/components/home/Notice";
import { SectionHead } from "@/components/home/parts";
import { ProductFinder } from "@/components/home/ProductFinder";
import { EDonusum, Services } from "@/components/home/ServiceSections";
import { Support } from "@/components/home/SupportSections";
import { TopBar } from "@/components/home/TopBar";
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
      <TopBar settings={settings} />
      <HomeNav />
      <main id="icerik">
        <Hero content={content} />
        <section className={h.sec} id="urunler">
          <div className={h.wrap}>
            <SectionHead
              center
              eyebrow="Mikro ürün ailesi"
              title="İşletmenize uygun"
              accent="Mikro çözümü"
              lede="Küçük işletmeden grup şirketine dört ürün. Hangisinin size uyduğunu aşağıdaki cümleyle deneyin; kesin seçimi ücretsiz keşif görüşmesinde birlikte yapıyoruz."
            />
            <ProductFinder />
          </div>
        </section>
        <Services />
        <Modules />
        <Process />
        <EDonusum />
        <Support settings={settings} />
        <CtaBand settings={settings} />
        <Beyond />
        <About settings={settings} />
        <Faq />
        <Contact settings={settings} content={content} />
      </main>
      <HomeFooter settings={settings} content={content} onHome />
    </div>
  );
}
