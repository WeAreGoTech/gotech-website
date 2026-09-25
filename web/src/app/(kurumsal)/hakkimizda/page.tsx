/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/home/ContactSection";
import { PORTAL_HREF } from "@/components/home/home-content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "GoTech, 2017'den beri İzmir'de Mikro Yazılım yetkili iş ortağı: Mikro kurulumu, eğitimi ve desteği; Mikro'nun yetmediği yerde kendi yazılım ekibi.",
};

// Yalnız doğrulanmış bilgiler. Ekip, tarihçe ve ofis fotoğrafı GoTech'ten gelince eklenecek.
const WAYS = [
  {
    title: "Kurulumdan sonra destek",
    body: "Kurulumdan sonra da destek bizden. Uzak bağlantıyla, portaldan ya da e-postayla ulaşın.",
  },
  {
    title: "Kendi yazılım ekibimiz var",
    body: "Mikro'nun yetmediği yerde ek ekran, rapor ve entegrasyonları kendimiz geliştiriyoruz; kurumlara Mikro'dan bağımsız yazılım da yapıyoruz.",
    link: { href: "/yazilim-cozumleri", label: "Yazılım çözümleri" },
  },
  {
    title: "Kendi destek araçlarımız",
    body: "Talepleriniz destek portalında kayıt altında, kimin üstlendiğini oradan görürsünüz. Uzak bağlantıyı kendi uygulamamız GoTech Desk ile yapıyoruz.",
    link: { href: PORTAL_HREF, label: "Destek portalı" },
  },
  {
    title: "Mevcut kurulumunuzu devralıyoruz",
    body: "Mikro'yu başka bir iş ortağından aldıysanız desteği bize taşıyabilirsiniz. Lisansınız ve verileriniz sizde kalır, baştan başlamazsınız.",
    link: { href: "#iletisim", label: "Kurulumunuzu inceleyelim", konu: "gecis" },
  },
];

export default async function HakkimizdaPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Mikro Yazılım'ı üreticinin içinde öğrendik."
        lead="2017'de GoTech olarak kendi yolumuza çıktık. Bugün İzmir'den Mikro'nun kurulumunu, eğitimini ve desteğini veriyor, Mikro'nun yetmediği yerde kendi yazılımımızı yazıyoruz."
      />

      <section className="sec">
        <div className="wrap ab-story">
          <div>
            <span className="tag">Biz kimiz</span>
            <h2 className="pd-h2">Mikro Yazılım yetkili iş ortağı GoTech</h2>
            <div className="ab-partner">
              <MikroLogo className="ab-mikro" />
              <span className="ab-badges">
                <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
                <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
              </span>
            </div>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            <p className="lede">
              Uzun yıllar Mikro Yazılım&apos;ın içinde çalıştık. Programı, işletmelerin ondan ne beklediğini ve nerede zorlandığını oradan biliyoruz.
              2017&apos;den beri bu birikimle işletmelerin Mikro&apos;ya geçişini, kurulumunu, eğitimini ve günlük desteğini yürütüyoruz.
            </p>
            <p className="lede">
              KOBİ ve kurumlar için Mikro&apos;ya entegre iş analizi, 3. parti yazılımlar, kurulum, eğitim ve destek süreçlerinin tamamında yanınızdayız.
              Mikro&apos;nun Jumper ve Flyer iş ortaklığı programlarında Silver seviyesindeyiz.
            </p>
          </div>
        </div>
      </section>

      <section className="sec pd-ground">
        <div className="wrap">
          <span className="tag">Nasıl çalışıyoruz</span>
          <h2 className="pd-h2">Satıştan sonra da buradayız</h2>
          <ul className="ab-facts">
            {WAYS.map((w) => (
              <li key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                {w.link && (w.link.href.startsWith("#")
                  ? <a href={w.link.href} data-konu={w.link.konu}>{w.link.label} <ArrowIcon /></a>
                  : <Link href={w.link.href}>{w.link.label} <ArrowIcon /></Link>)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact settings={settings} content={content} />
    </main>
  );
}
