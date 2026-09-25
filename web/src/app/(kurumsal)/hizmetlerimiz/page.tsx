import type { Metadata } from "next";
import { Faq } from "@/components/home/CompanySections";
import { Contact } from "@/components/home/ContactSection";
import { EDonusum, ServiceJourney } from "@/components/home/ServiceSections";
import { Support } from "@/components/home/SupportSections";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { FAQ } from "@/components/kurumsal/urunler-data";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Mikro kurulum, eğitim, destek ve e-Dönüşüm · Hizmetler",
  description: "İş analizi, Mikro kurulumu, eğitim, teknik destek ve e-Dönüşüm danışmanlığı. İzmir'de Mikro Yazılım yetkili iş ortağı GoTech.",
};

/** Hizmetler: ana sayfanın hizmet süreci, e-Dönüşüm ve destek bölümleri (aynı bileşenler) ve SSS. */
export default async function HizmetlerimizPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Hizmetler"
        title="Yazılımı satmakla bitmiyor."
        lead="İş analizinden eğitime, kurulumdan günlük desteğe: Mikro'nun bütün süreci tek ekipten."
      />
      <ServiceJourney head={false} />
      <EDonusum />
      <Support settings={settings} />
      <Faq items={FAQ} />
      <Contact settings={settings} content={content} />
    </main>
  );
}
