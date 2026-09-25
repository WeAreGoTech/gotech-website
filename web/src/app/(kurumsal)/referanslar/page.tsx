/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/home/ContactSection";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { REFERENCES } from "@/components/kurumsal/referanslar";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Referanslar ve özel yazılım",
  description: "GoTech'in kendi yazılım ekibiyle kurumlara özel geliştirdiği yazılımlar, entegrasyonlar ve birlikte çalıştığı kurumlar.",
};

export default async function ReferanslarPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Referanslar"
        title="Kurumlara özel"
        accent="yazılım"
        titleAfter="."
        lead="Mikro'nun yetmediği yerde kendi yazılım ekibimizle kurumlara özel ekranlar, raporlar, entegrasyonlar ve uygulamalar geliştiriyoruz."
      />

      <section className="sec">
        <div className="wrap">
          <span className="tag">Birlikte çalıştığımız kurumlar</span>
          <h2 className="pd-h2">Referanslarımız</h2>
          <ul className="ref-list">
            {REFERENCES.map((ref) => (
              <li key={ref.name}>
                <span className="ref-logo">
                  <img src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} />
                </span>
                <div>
                  <span className="tag">{ref.sector}</span>
                  <h3>{ref.name}</h3>
                  <p>{ref.work}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec pd-ground">
        <div className="wrap">
          <span className="tag">Neler geliştiriyoruz</span>
          <h2 className="pd-h2">Web, portal, e-ticaret ve Mikro&apos;ya özel geliştirme</h2>
          <p className="lede pd-intro">Mikro&apos;nun dışındaki işlerimizi ve kendi geliştirdiğimiz yazılımları ayrı bir sayfada anlattık.</p>
          <Link className="btn btn-line pd-more" href="/yazilim-cozumleri">Yazılım çözümleri</Link>
        </div>
      </section>

      <Contact
        settings={settings}
        content={content}
        title="Benzer bir projeniz mi var?"
        lead="Kurumunuza özel ekran, rapor, entegrasyon ya da uygulama ihtiyacınızı anlatın; yazılım ekibimiz değerlendirip size dönsün."
        submitLabel="Projeyi anlatın"
        note="Mesajınız yazılım ekibimize düşer; ihtiyacınızı konuşmak için sizinle iletişime geçiyoruz."
      />
    </main>
  );
}
