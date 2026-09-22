import type { Metadata } from "next";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { Closing, PhotoBand } from "@/components/kurumsal/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "GoTech ERP Solutions, 2017'den beri Mikro Yazılım iş ortağı olarak işletmelere ERP danışmanlığı, kurulum, eğitim ve destek veriyor.",
};

export default async function HakkimizdaPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Hakkımızda"
        title="2017'den beri"
        accent="kurumsal iş ortağınız"
        titleAfter="."
        lead="Mikro Yazılım'ı üreticinin içinde öğrendik, 2017'de kendi yolumuza çıktık."
      />

      <section className="sec">
        <div className="wrap contact">
          <div>
            <span className="tag">Biz kimiz</span>
            <h2 className="d3" style={{ marginTop: 14 }}>Mikro Çözüm Ortağı GoTech ERP</h2>
            <div className="hero-trust" style={{ marginTop: 28 }}>
              <MikroLogo />
              <p>Yetkili çözüm ortağı · Jumper ve Flyer Silver Partner</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            <p className="lede" style={{ maxWidth: "none" }}>
              Türkiye&apos;nin ilk ve öncü kurumsal-ticari iş yazılımları üreticilerinden biri olan Mikro Yazılım
              bünyesinde geçirdiğimiz uzun yıllar sonucunda edindiğimiz bilgi, birikim ve tecrübeler ile
              kullanıcılarının her türlü soru ve taleplerine uçtan uca çözümler geliştirmeyi amaç edinen Mikro Çözüm
              Ortağı GoTech ERP, hedeflerinize giden yolda kaliteli hizmet anlayışıyla kurumsal iş ortağınız olarak
              yanınızda.
            </p>
            <p className="lede" style={{ maxWidth: "none" }}>
              2017 yılından beri deneyimli ekibimiz, sektörel bilgi birikimimiz ve müşteri odaklı yaklaşımımızla
              işletmenizin ihtiyaçlarına en uygun çözümleri üretiyoruz. KOBİ ve kurumlar için Mikro çözümlerine entegre
              iş analizi, 3. parti yazılımlar, kurulum, eğitim ve destek süreçlerinin tamamında yanınızdayız.
            </p>
          </div>
        </div>
      </section>

      <PhotoBand />
      <Closing settings={settings} content={content} />
    </main>
  );
}
