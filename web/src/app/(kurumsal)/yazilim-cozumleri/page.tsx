import type { Metadata } from "next";
import { SOFTWARE_CONTACT, SOFTWARE_HERO } from "@/components/site/content";
import { Approach, Reference, Steps, Works } from "@/components/site/pages/Software";
import { Contact } from "@/components/site/ui/Contact";
import { Faq } from "@/components/site/ui/Faq";
import { Arrow } from "@/components/site/ui/icons";
import { PageHero } from "@/components/site/ui/PageHero";
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

/** Yazılım: ne geliştirdiğimiz (süzgeçli), nasıl çalıştığımız, ilkeler, referans, SSS ve iletişim. */
export default async function YazilimCozumleriPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd()).replace(/</g, "\\u003c") }} />
      <PageHero
        crumbs={[{ href: "/yazilim-cozumleri", label: "Yazılım" }]}
        title={SOFTWARE_HERO.title}
        soft={SOFTWARE_HERO.soft}
        lede={SOFTWARE_HERO.lede}
        actions={
          <>
            <a className="btn" href="#iletisim" data-konu="bilgi" data-mesaj="Özel yazılım projemiz hakkında görüşmek istiyoruz.">Projenizi anlatın <Arrow /></a>
            <a className="btn btn-line" href="#isler">Neler geliştiriyoruz?</a>
          </>
        }
        media={SOFTWARE_HERO.image}
      />
      <Works />
      <Steps />
      <Approach />
      <Reference />
      <Faq items={YAZILIM_FAQ} title="Yazılım projeleri hakkında sorulanlar" />
      <Contact settings={settings} content={content} title={SOFTWARE_CONTACT.title} lead={SOFTWARE_CONTACT.lead} submitLabel="Gönderin" />
    </main>
  );
}
