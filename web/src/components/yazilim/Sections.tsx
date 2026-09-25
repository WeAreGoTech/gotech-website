/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import h from "@/components/home/home.module.css";
import { cx, REVEAL } from "@/components/home/parts";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { REFERENCES } from "@/components/kurumsal/referanslar";
import { WorkIndex } from "./WorkIndex";
import s from "./yazilim.module.css";

/** Giriş: solda ne yaptığımız, sağda geliştirdiğimiz yazılım türleri (Mikro'ya bağlı / bağımsız diye süzülebilir). */
export function SoftwareHero() {
  return (
    <section className={s.hero}>
      <div className={cx(h.wrap, s.heroIn)}>
        <div className={s.heroCopy}>
          <nav className={s.crumb} aria-label="Konum"><Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span><span>Yazılım çözümleri</span></nav>
          <h1>İşinize özel yazılım, Mikro&apos;ya bağlı ya da bağımsız</h1>
          <p className={h.lede}>Mikro kullanıyorsanız eksik kalan ekranı, raporu ya da bağlantıyı Mikro&apos;ya bağlı yazıyoruz; verileriniz Mikro&apos;da kalır. Kullanmıyorsanız da web sitenizi, portalınızı ya da iş uygulamanızı aynı ekip geliştirir.</p>
          <a className={h.btn} href="#iletisim" data-konu="bilgi" data-mesaj="Yazılım projemizi konuşmak istiyoruz.">Projenizi anlatın <ArrowIcon /></a>
        </div>
        <WorkIndex />
      </div>
    </section>
  );
}

/** Özel yazılım geliştirdiğimiz kurumlar: logo büyük, yanında sektör ve yapılan iş (referanslar.ts, yalnız onaylı müşteriler). */
export function ReferenceBand() {
  return (
    <section className={h.sec}>
      <div className={h.wrap}>
        <span className={h.eyebrow} {...REVEAL}>Özel yazılım geliştirdiğimiz kurumlar</span>
        <ul className={s.refs}>
          {REFERENCES.map((ref) => (
            <li key={ref.name} {...REVEAL}>
              <img src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" />
              <div>
                <b>{ref.sector}</b>
                <p>{ref.work}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
