import Link from "next/link";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { WAYS } from "./content";
import { REVEAL, cx } from "@/components/home/parts";
import h from "@/components/home/home.module.css";
import styles from "./hakkimizda.module.css";

export function AboutCover() {
  return (
    <section className={styles.cover}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.coverPhoto} src="/images/stok/izmir-kordon.webp" alt="" width={960} height={640} fetchPriority="high" />
      <div className={styles.coverScrim} aria-hidden="true" />
      <div className={cx(h.wrap, styles.coverIn)}>
        <nav className={cx(styles.crumb, styles.crumbOver)} aria-label="Konum">
          <Link href="/">Ana sayfa</Link>
          <span aria-hidden="true">/</span>
          <span>Hakkımızda</span>
        </nav>
        <h1 className={styles.coverTitle}>
          Mikro Yazılım&apos;da başladık, 2017&apos;den beri iş ortağıyız.
        </h1>
        <p className={styles.coverLede}>
          Ekibimiz Mikro Yazılım&apos;da çalıştıktan sonra 2017&apos;de GoTech&apos;i kurdu. İzmir&apos;den işletmelere Mikro kurulumu, eğitimi ve desteği veriyor; ihtiyaç duyulan ek yazılımları da kendimiz geliştiriyoruz.
        </p>
      </div>
    </section>
  );
}

export function AboutStory() {
  return (
    <section className="sec">
      <div className={`wrap ${styles.story}`}>
        <div {...REVEAL}>
          <span className="tag">Biz kimiz</span>
          <h2 className="pd-h2">Mikro Yazılım yetkili iş ortağı GoTech</h2>
          <div className={styles.partner}>
            <MikroLogo className={styles.mikro} />
            <span className={styles.badges}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 18 }} {...REVEAL}>
          <p className="lede">
            Uzun yıllar Mikro Yazılım&apos;da çalıştık. Programı ve işletmelerin günlük kullanımda nelere ihtiyaç duyduğunu oradan biliyoruz.
            2017&apos;den beri bu birikimle işletmelerin Mikro&apos;ya geçişini, kurulumunu, eğitimini ve günlük desteğini yürütüyoruz.
          </p>
          <p className="lede">
            KOBİ&apos;lere ve kurumlara iş analizi, kurulum, eğitim ve destek veriyor; Mikro&apos;yla entegre çalışan 3. parti yazılımları kurup bağlıyoruz.
            Mikro&apos;nun Jumper ve Flyer iş ortaklığı programlarında Silver seviyesindeyiz.
          </p>
        </div>
      </div>
    </section>
  );
}

export function SupportFacts() {
  return (
    <section className="sec pd-ground">
      <div className="wrap">
        <span className="tag" {...REVEAL}>Nasıl çalışıyoruz</span>
        <h2 className="pd-h2" {...REVEAL}>Satış sonrası hizmet</h2>
        <ul className={styles.facts}>
          {WAYS.map((w) => (
            <li key={w.title} {...REVEAL}>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              {w.link && (
                w.link.href.startsWith("#") ? (
                  <a href={w.link.href} data-konu={w.link.konu}>{w.link.label} <ArrowIcon /></a>
                ) : (
                  <Link href={w.link.href}>{w.link.label} <ArrowIcon /></Link>
                )
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
