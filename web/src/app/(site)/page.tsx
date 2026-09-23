import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { About, Beyond, Faq } from "@/components/home/CompanySections";
import { Contact, HomeFooter } from "@/components/home/ContactSection";
import { Hero, PartnerBand } from "@/components/home/Hero";
import { HomeEffects } from "@/components/home/HomeEffects";
import h from "@/components/home/home.module.css";
import { HomeNav } from "@/components/home/HomeNav";
import { Notice } from "@/components/home/Notice";
import { SectionHead } from "@/components/home/parts";
import { ProductFinder } from "@/components/home/ProductFinder";
import { EDonusum, Roadmap, Services } from "@/components/home/ServiceSections";
import { Migration, Support } from "@/components/home/SupportSections";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { getSiteConfig } from "@/features/site-content/queries";

// Mikro'nun sitesindeki Gilroy'a en yakın ücretsiz yazı; yalnız ana sayfada yükleniyor
const figtree = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-figtree", display: "swap" });

// Telefon, adres, hero metni ve rakamlar panelden okunuyor: sayfa build anında dondurulmamalı.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "GoTech | Mikro Yazılım Yetkili İş Ortağı · İzmir" },
  description:
    "Mikro Yazılım kurulumu, e-Dönüşüm, eğitim ve 7/24 destek. 2017'den beri İzmir'de yetkili iş ortağı; Mikro Run, Jump, Fly ve Müşavir.",
};

const ROOT_ID = "anasayfa";

export default async function HomePage() {
  const { settings, content } = await getSiteConfig();

  return (
    <div id={ROOT_ID} className={`${figtree.variable} ${h.home}`}>
      <SmoothScroll />
      <HomeEffects rootId={ROOT_ID} />
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <Notice />
      <HomeNav />
      <main id="icerik">
        <Hero content={content} />
        <PartnerBand content={content} />
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
        <Services />
        <EDonusum />
        <Roadmap />
        <Migration />
        <Support settings={settings} />
        <Beyond />
        <About />
        <Faq />
        <Contact settings={settings} />
      </main>
      <HomeFooter settings={settings} content={content} />
    </div>
  );
}
