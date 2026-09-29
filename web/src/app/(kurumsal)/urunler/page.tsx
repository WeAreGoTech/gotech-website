import type { Metadata } from "next";
import { PRODUCTS_HERO } from "@/components/site/content";
import { CompareSection, ProductLines, productsFaq, ProsCons } from "@/components/site/pages/Products";
import { Contact } from "@/components/site/ui/Contact";
import { Faq } from "@/components/site/ui/Faq";
import { Arrow } from "@/components/site/ui/icons";
import { PageHero } from "@/components/site/ui/PageHero";
import { PartnerMarks } from "@/components/site/ui/PartnerMarks";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Mikro Jump ve Mikro Fly · Ürünler",
  description: "Mikro Jump Basic, Mikro Jump, Mikro Jump Bulut ve Mikro Fly: kimin için, hangisinde ne var, ne yok. İzmir'de kurulum, eğitim ve destek GoTech'ten.",
};

/** Ürünler: iki ürün ailesi (Jump, Fly), dört ürünün karşılaştırması, artılar/sınırlar, SSS ve iletişim. */
export default async function UrunlerPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/urunler", label: "Ürünler" }]}
        title={PRODUCTS_HERO.title}
        lede={PRODUCTS_HERO.lede}
        actions={
          <>
            <a className="btn" href="#iletisim" data-konu="demo">Demo isteyin <Arrow /></a>
            <a className="btn btn-line" href="#karsilastirma">Karşılaştırma tablosu</a>
          </>
        }
        aside={<PartnerMarks />}
      />
      <ProductLines />
      <CompareSection />
      <ProsCons />
      <Faq items={productsFaq()} title="Ürünler hakkında sorulanlar" />
      <Contact settings={settings} content={content} />
    </main>
  );
}
