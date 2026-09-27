import type { Metadata } from "next";
import { Contact } from "@/components/home/ContactSection";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { AboutStory, SupportFacts } from "@/components/hakkimizda/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "GoTech, 2017'den beri İzmir'de Mikro Yazılım yetkili iş ortağı: Mikro kurulumu, eğitimi ve desteği; Mikro'nun yetmediği yerde kendi yazılım ekibi.",
};

export default async function HakkimizdaPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Mikro Yazılım'ı üreticinin içinde öğrendik."
        lead="2017'de GoTech olarak kendi yolumuza çıktık. Bugün İzmir'den Mikro'nun kurulumunu, eğitimini ve desteğini veriyor, Mikro'nun yetmediği yerde kendi yazılımımızı yazıyoruz."
      />
      <AboutStory />
      <SupportFacts />
      <Contact settings={settings} content={content} />
    </main>
  );
}
