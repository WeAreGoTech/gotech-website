import type { Metadata } from "next";
import { ABOUT_HERO } from "@/components/site/content";
import { Story, Ways, WhatWeDo } from "@/components/site/pages/About";
import { Contact } from "@/components/site/ui/Contact";
import { Arrow } from "@/components/site/ui/icons";
import { PageHero } from "@/components/site/ui/PageHero";
import { PartnerMarks } from "@/components/site/ui/PartnerMarks";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "GoTech, 2017'den beri İzmir'de Mikro Yazılım yetkili iş ortağı: Mikro kurulumu, eğitimi, desteği ve işletmelere özel yazılım geliştirme.",
};

/** Hakkımızda: kim olduğumuz (iş ortaklığıyla), hikâye, satış sonrası nasıl çalıştığımız, neler yaptığımız ve iletişim. */
export default async function HakkimizdaPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/hakkimizda", label: "Hakkımızda" }]}
        title={ABOUT_HERO.title}
        lede={ABOUT_HERO.lede}
        actions={
          <>
            <a className="btn" href="#iletisim" data-konu="bilgi">Bize ulaşın <Arrow /></a>
            <a className="btn btn-line" href="#biz">Biz kimiz</a>
          </>
        }
        aside={<PartnerMarks />}
      />
      <Story />
      <Ways />
      <WhatWeDo />
      <Contact settings={settings} content={content} />
    </main>
  );
}
