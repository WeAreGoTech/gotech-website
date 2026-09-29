import type { Metadata } from "next";
import { HOME_FAQ, SERVICES_FAQ_QUESTIONS, SERVICES_HERO } from "@/components/site/content";
import { EDocs } from "@/components/site/home/Sections";
import { Support } from "@/components/site/home/Support";
import { Analysis, ServiceIndex, Setup, Training } from "@/components/site/pages/Services";
import { Contact } from "@/components/site/ui/Contact";
import { Faq } from "@/components/site/ui/Faq";
import { Arrow } from "@/components/site/ui/icons";
import { PageHero } from "@/components/site/ui/PageHero";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hizmetler: analiz, kurulum, e-Dönüşüm, eğitim ve destek",
  description:
    "Mikro Jump ve Mikro Fly için ihtiyaç analizi, kurulum ve entegrasyon, e-Dönüşüm (GİB başvurusu, e-belge ayarları), kullanıcı eğitimi ve kurulum sonrası destek. İzmir, GoTech.",
};

/** Hizmetler: dizin, sonra her hizmetin bölümü (menüdeki #analiz, #kurulum, #edonusum, #egitim, #destek bağlantıları buraya iner). */
export default async function HizmetlerPage() {
  const { settings, content } = await getSiteConfig();
  const faq = SERVICES_FAQ_QUESTIONS.map((q) => HOME_FAQ.find((x) => x.q === q)).filter((x) => x !== undefined);

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/hizmetlerimiz", label: "Hizmetler" }]}
        title={SERVICES_HERO.title}
        lede={SERVICES_HERO.lede}
        actions={<a className="btn" href="#iletisim" data-konu="demo">Keşif görüşmesi isteyin <Arrow /></a>}
        media={SERVICES_HERO.image}
      />
      <ServiceIndex />
      <Analysis />
      <Setup />
      <EDocs />
      <Training />
      <Support hours={settings.workingHours} phone={settings.supportPhone || settings.salesPhone} />
      <Faq items={faq} title="Hizmetler hakkında sorulanlar" />
      <Contact settings={settings} content={content} />
    </main>
  );
}
