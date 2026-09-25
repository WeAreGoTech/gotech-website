import type { Metadata } from "next";
import { Contact } from "@/components/home/ContactSection";
import {
  AnalysisChapter, EDocChapter, QuestionsHero, SetupChapter, SupportChapter, TrainingChapter,
} from "@/components/hizmetler/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Mikro kurulum, eğitim, destek ve e-Dönüşüm · Hizmetler",
  description: "İş analizi, Mikro kurulumu, eğitim, teknik destek ve e-Dönüşüm danışmanlığı. İzmir'de Mikro Yazılım yetkili iş ortağı GoTech.",
};

/** Hizmetler müşterinin sorularıyla: girişte beş soru, her soru bir bölüm (analiz, kurulum, e-Dönüşüm, eğitim, destek), sonra iletişim. */
export default async function HizmetlerimizPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <QuestionsHero />
      <AnalysisChapter />
      <SetupChapter />
      <EDocChapter />
      <TrainingChapter />
      <SupportChapter settings={settings} />
      <Contact settings={settings} content={content} />
    </main>
  );
}
