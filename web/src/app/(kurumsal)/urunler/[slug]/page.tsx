import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductDetail } from "@/components/kurumsal/urun-detay";
import { PRODUCT_CONTACT_LEAD, PRODUCT_INTROS } from "@/components/site/content";
import {
  Addons,
  AtAGlance,
  DiffFrom,
  Features,
  ForWhom,
  HeroLogo,
  Overview,
  Package,
  Versions,
} from "@/components/site/pages/ProductDetail";
import { Contact } from "@/components/site/ui/Contact";
import { Faq } from "@/components/site/ui/Faq";
import { Arrow } from "@/components/site/ui/icons";
import { PageHero } from "@/components/site/ui/PageHero";
import { PartnerMarks } from "@/components/site/ui/PartnerMarks";
import { getSiteConfig } from "@/features/site-content/queries";

export async function generateMetadata({ params }: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const product = findProductDetail((await params).slug);
  return product ? { title: `${product.name} kurulum ve destek · İzmir`, description: product.metaDescription } : {};
}

/** Satılan ürünlerin sayfaları: Mikro Jump (Basic ve Bulut sürümleriyle) ve Mikro Fly (kurumsal/urun-detay.ts). */
export default async function ProductPage({ params }: PageProps<"/urunler/[slug]">) {
  const product = findProductDetail((await params).slug);
  if (!product) notFound();
  const { settings, content } = await getSiteConfig();
  const intro = PRODUCT_INTROS[product.slug];
  const isJump = product.slug === "mikro-jump";

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/urunler", label: "Ürünler" }, { href: `/urunler/${product.slug}`, label: product.name }]}
        logo={<HeroLogo product={product} />}
        title={intro?.title ?? product.headline}
        lede={intro?.lede ?? product.lead}
        actions={
          <>
            <a className="btn" href="#iletisim" data-konu="demo" data-mesaj={`${product.name} için demo istiyoruz.`}>Demo isteyin <Arrow /></a>
            <a className="btn btn-line" href={isJump ? "#surumler" : "#fark"}>{isJump ? "Sürümler" : "Jump ile farkı"}</a>
          </>
        }
        aside={<PartnerMarks only={isJump ? "jump" : "fly"} />}
        media={{ src: product.photo.src, alt: product.photo.alt, width: 1080, height: 607 }}
      />
      <Overview product={product} />
      <Features product={product} />
      <Versions product={product} />
      <DiffFrom product={product} />
      <Package product={product} />
      <ForWhom product={product} />
      <AtAGlance product={product} />
      <Addons product={product} />
      <Faq items={product.faq} title={`${product.name} hakkında sorulanlar`} />
      <Contact settings={settings} content={content} title={intro?.contactTitle} lead={PRODUCT_CONTACT_LEAD} />
    </main>
  );
}
