import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/ContactSection";
import { ProductDetailView } from "@/components/kurumsal/ProductDetailView";
import { findProductDetail } from "@/components/kurumsal/urun-detay";
import { getSiteConfig } from "@/features/site-content/queries";

export async function generateMetadata({ params }: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const product = findProductDetail((await params).slug);
  return product ? { title: `${product.name} kurulum ve destek · İzmir`, description: product.metaDescription } : {};
}

/** Satılan ürünlerin kendi sayfaları: Mikro Jump (Basic ve Bulut sürümleriyle) ve Mikro Fly (urun-detay.ts). */
export default async function ProductPage({ params }: PageProps<"/urunler/[slug]">) {
  const product = findProductDetail((await params).slug);
  if (!product) notFound();
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <ProductDetailView product={product} workingHours={settings.workingHours} hasPhone={Boolean(settings.supportPhone || settings.salesPhone)} />
      <Contact
        settings={settings}
        content={content}
        title={`${product.name} için ücretsiz keşif görüşmesi`}
        lead="Kaç kişinin çalışacağını ve süreçlerinizi dinleyip hangi sürüm ve modüllerin gerektiğini birlikte belirleyelim. Görüşme ve demo ücretsiz."
      />
    </main>
  );
}
