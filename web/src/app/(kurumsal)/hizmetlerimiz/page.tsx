import type { Metadata } from "next";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { Closing, FaqBlock, PhotoBand, ServicesBlock } from "@/components/kurumsal/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "İş analizi, kurulum ve entegrasyon, eğitim, teknik destek, güncelleme ve e-Dönüşüm danışmanlığı.",
};

export default async function HizmetlerimizPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Hizmetler"
        title="Yazılımı satmakla"
        accent="bitmiyor"
        titleAfter="."
        lead="İş analizinden eğitime, kurulumdan 7/24 desteğe kadar sürecin tamamında yanınızdayız."
      />
      <ServicesBlock />
      <PhotoBand />
      <FaqBlock />
      <Closing settings={settings} content={content} />
    </main>
  );
}
