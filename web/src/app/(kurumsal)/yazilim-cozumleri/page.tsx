import type { Metadata } from "next";
import { Faq } from "@/components/home/CompanySections";
import { Approach, FaqSide, HowWeWork, ProjectCta, ReferenceBand, SoftwareCover, TracksSection, WorksSection } from "@/components/yazilim/Sections";
import { YAZILIM_FAQ } from "@/components/yazilim/content";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Yazılım çözümleri: web, portal, e-ticaret ve Mikro'ya özel geliştirme",
  description: "GoTech'in kendi yazılım ekibiyle kurumlara özel web siteleri, e-ticaret, müşteri ve bayi portalları, saha panelleri ve Mikro'ya özel ekran, rapor ve entegrasyonlar. İzmir.",
};

const SITE = process.env.SITE_URL || "http://localhost:3000";

/** Arama motorları için: konum izi ve sayfadaki SSS (yalnız sayfada gerçekten yazan sorular). */
function pageJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE },
        { "@type": "ListItem", position: 2, name: "Yazılım çözümleri", item: `${SITE}/yazilim-cozumleri` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: YAZILIM_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}

/**
 * Yazılım: tam ekran fotoğrafla açılan giriş (menü bu sayfada saydam), ne geliştirdiğimiz,
 * iki iş türü, çalışma biçimi, dört ilke, referans, SSS ve iletişim.
 */
export default async function YazilimCozumleriPage() {
  // kapanış kartı kendi metnini taşıyor: panelden yalnız iletişim bilgileri (settings) geliyor
  const { settings } = await getSiteConfig();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd()).replace(/</g, "\\u003c") }}
      />
      <SoftwareCover />
      <WorksSection />
      <TracksSection />
      <HowWeWork />
      <Approach />
      <ReferenceBand />
      <Faq items={YAZILIM_FAQ} eyebrow="SSS" title="Sık sorulan sorular" id="sss" split side={<FaqSide />} />
      <ProjectCta settings={settings} />
    </main>
  );
}
