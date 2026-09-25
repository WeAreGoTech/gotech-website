/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/home/ContactSection";
import { PORTAL_HREF } from "@/components/home/home-content";
import { SoftwareTracks } from "@/components/home/SoftwareTracks";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { OWN_SOFTWARE, REFERENCES } from "@/components/kurumsal/referanslar";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "Yazılım çözümleri: web, portal, e-ticaret ve Mikro'ya özel geliştirme",
  description: "GoTech'in kendi yazılım ekibiyle kurumlara özel web siteleri, e-ticaret, müşteri ve bayi portalları, saha panelleri ve Mikro'ya özel ekran, rapor ve entegrasyonlar. İzmir.",
};

// stok fotoğrafların boyutu (public/images/stok)
const IMG = { width: 960, height: 640 };

/** Giriş: solda ne yaptığımız ve özel yazılım geliştirdiğimiz kurumlar, sağda fotoğraf (ürün sayfalarının giriş düzeni). */
function Intro() {
  return (
    <section className="pd-hero">
      <div className="wrap">
        <div className="pd-hero-in">
          <div className="pd-hero-copy">
            <nav className="crumb" aria-label="Konum">
              <Link href="/">Ana sayfa</Link>
              <span aria-hidden="true">/</span>
              <span>Yazılım çözümleri</span>
            </nav>
            <span className="tag">Yazılım çözümleri</span>
            <h1 className="sw-title">Kurumunuza özel yazılımı kendi ekibimiz geliştiriyor.</h1>
            <p className="lede">Web siteleri, portallar ve iş uygulamaları yazıyoruz; gerekiyorsa Mikro&apos;ya bağlıyoruz, gerekmiyorsa bağımsız çalışır.</p>
            <div className="row-cta">
              <a className="btn" href="#iletisim" data-konu="bilgi" data-mesaj="Yazılım projemizi konuşmak istiyoruz.">Projenizi anlatın <ArrowIcon /></a>
              <a className="btn btn-line" href="#ne-gelistiriyoruz">Ne geliştiriyoruz?</a>
            </div>
            <div className="sw-refs">
              <span>Özel yazılım geliştirdiğimiz kurumlar</span>
              {REFERENCES.map((ref) => <img key={ref.name} src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} />)}
              <Link href="/referanslar">Referanslar <ArrowIcon /></Link>
            </div>
          </div>
          <figure className="pd-hero-photo">
            <img src="/images/stok/kod-inceleme.webp" alt="Dizüstü bilgisayardaki koda birlikte bakan iki yazılımcı" width={IMG.width} height={IMG.height} fetchPriority="high" />
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Kendi yazılımlarımız: solda fotoğraf, sağda her gün kullandığımız üç yazılım; müşteri portalı gerçek girişe bağlanır. */
function OwnSoftware() {
  return (
    <section className="sec" id="kendi-yazilimlarimiz">
      <div className="wrap sw-own-in">
        <figure className="sw-own-photo">
          <img src="/images/stok/kod-laptop.webp" alt="" width={IMG.width} height={657} loading="lazy" />
        </figure>
        <div className="sw-own-copy">
          <span className="tag">Kendi yazılımlarımız</span>
          <h2 className="pd-h2">Her gün kendi yazdığımız yazılımla çalışıyoruz</h2>
          <p className="lede">Destek işimizi yürüttüğümüz araçları da kendimiz geliştirdik.</p>
          <ul className="sw-own">
            {OWN_SOFTWARE.map((w) => (
              <li key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                {w.title === "Müşteri portalı" && <Link className="sw-more" href={PORTAL_HREF}>Portala giriş <ArrowIcon /></Link>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Mikro dışındaki işler: giriş, iki iş türü (Mikro'ya bağlı / bağımsız), GoTech'in kendi yazılımları, iletişim. */
export default async function YazilimCozumleriPage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <Intro />

      <section className="sec pd-ground" id="ne-gelistiriyoruz">
        <div className="wrap">
          <span className="tag">Ne geliştiriyoruz</span>
          <h2 className="pd-h2">Mikro&apos;ya bağlı ya da bağımsız</h2>
          <p className="lede pd-intro">Mikro kullanıyorsanız eksik kalanı Mikro&apos;ya bağlı yazıyoruz; kullanmıyorsanız da işinizi aynı ekibe verebilirsiniz.</p>
          <div className="sw-tracks">
            <SoftwareTracks />
          </div>
        </div>
      </section>

      <OwnSoftware />

      <Contact
        settings={settings}
        content={content}
        title="Projenizi anlatın"
        lead="Ne yapmak istediğinizi kısaca yazın; yazılım ekibimiz değerlendirip size dönsün."
        submitLabel="Projeyi anlatın"
        note="Mesajınız yazılım ekibimize düşer; ihtiyacınızı konuşmak için sizinle iletişime geçiyoruz."
      />
    </main>
  );
}
