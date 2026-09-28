/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { REFERENCES } from "@/components/kurumsal/referanslar";
import { HOME_FAQ, WHY_GOTECH } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx, PageLink, REVEAL, SectionHead } from "./parts";
import s from "./sections.module.css";
import { SoftwareTracks } from "./SoftwareTracks";

/**
 * Yazılım: üstte başlık ve özel yazılım geliştirdiğimiz kurumların logosu, altta iki iş türü (SoftwareTracks, yalnız iş adları).
 * Ayrıntısı /yazilim-cozumleri sayfasında.
 */
export function Beyond() {
  return (
    <section className={cx(h.sec, h.ground)} id="yazilim">
      <div className={h.wrap}>
        <div className={s.beyondTop}>
          <SectionHead
            eyebrow="Yazılım"
            title="İşletmenize özel yazılım geliştiriyoruz"
            lede="Mikro'ya bağlı ek ekran ve raporların yanında kurumsal web sitesi, portal ve e-ticaret projelerini de kendi ekibimizle geliştiriyoruz."
          />
          <div className={s.beyondSide} {...REVEAL}>
            <div className={s.refRow}>
              <span>Özel yazılım geliştirdiğimiz kurumlar</span>
              {REFERENCES.map((ref) => <img key={ref.name} src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" />)}
            </div>
            <Link className={cx(h.btn, h.ghost)} href="/yazilim-cozumleri">Yazılım çözümlerimiz <ArrowIcon /></Link>
          </div>
        </div>
        <SoftwareTracks compact />
      </div>
    </section>
  );
}

/**
 * Neden GoTech: solda hikâye, şehir fotoğrafı (ofis değil, altında yeri yazar) ve adres; sağda dört gerekçe ikonlu kartlarda.
 */
export function About({ settings }: { settings: SiteSettings }) {
  return (
    <section className={h.sec} id="hakkimizda">
      <div className={cx(h.wrap, s.about)}>
        <div className={s.aboutCopy}>
          <SectionHead
            eyebrow="Neden GoTech"
            title="Mikro Yazılım'da başladık, 2017'den beri Mikro iş ortağıyız."
            lede="KOBİ'lere ve kurumlara Mikro ürünlerinde iş analizi, kurulum, eğitim ve destek veriyor; Mikro'yla entegre çalışan yazılımları kurup bağlıyoruz."
          />
          {/* şehir fotoğrafı: ofisimiz değil, altındaki yazı da öyle söylüyor */}
          <figure className={s.aboutPhoto} {...REVEAL}>
            <img src="/images/stok/izmir-kordon.webp" alt="İzmir Kordon'da deniz kenarındaki tarihî sarı bina ve yürüyen insanlar" width={1024} height={768} loading="lazy" />
            <figcaption>Kordon, İzmir</figcaption>
          </figure>
          <p className={s.aboutAddress} {...REVEAL}>
            <Icon name="mapPin" size={18} />
            <span>{settings.address.replace(/\n/g, ", ")}<br />{settings.workingHours}</span>
          </p>
          <Link className={h.link} href="/hakkimizda" {...REVEAL}>GoTech&apos;i tanıyın <ArrowIcon /></Link>
        </div>
        <ul className={s.ways}>
          {WHY_GOTECH.map((w) => (
            <li key={w.title} className={cx(h.card, s.way)} {...REVEAL}>
              <span className={h.iconBox}><Icon name={w.icon} size={24} /></span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              {w.link && <PageLink className={h.link} link={w.link} arrow />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type FaqItem = { q: string; a: string };
// split: başlık solda (yapışkan), sorular sağda; /yazilim-cozumleri'de
// side: split düzeninde başlığın altındaki ek içerik (ör. "projenizi anlatın" bağlantısı)
type FaqProps = { items?: FaqItem[]; eyebrow?: string; title?: string; id?: string; split?: boolean; side?: ReactNode };

/** SSS: yerel <details>, JS gerekmez; yükseklik geçişi sections.module.css'te. Ana sayfa, yazılım ve ürün sayfalarında aynı. */
export function Faq({ items = HOME_FAQ, eyebrow = "SSS", title = "Sık sorulan sorular", id = "sss", split = false, side }: FaqProps) {
  return (
    <section className={cx(h.sec, h.ground)} id={id}>
      <div className={cx(h.wrap, split && s.faqSplit)}>
        <div>
          <SectionHead center={!split} eyebrow={eyebrow} title={title} lede={split ? "Burada olmayan bir sorunuz varsa formdan yazın, çalışma saatlerinde dönüyoruz." : undefined} />
          {side}
        </div>
        <div className={s.faq}>
          {items.map((item) => (
            <details key={item.q} {...REVEAL}>
              <summary>{item.q}<i aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
