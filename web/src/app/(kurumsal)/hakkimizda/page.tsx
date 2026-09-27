import type { Metadata } from "next";
import { Contact } from "@/components/home/ContactSection";
import { AboutCover, AboutStory, SupportFacts } from "@/components/hakkimizda/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "GoTech, 2017'den beri İzmir'de Mikro Yazılım yetkili iş ortağı: Mikro kurulumu, eğitimi ve desteği; Mikro'nun yetmediği yerde kendi yazılım ekibi.",
};

export default async function HakkimizdaPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <AboutCover />
      <AboutStory />
      <SupportFacts />
      <Contact settings={settings} content={content} />
    </main>
  );
}
