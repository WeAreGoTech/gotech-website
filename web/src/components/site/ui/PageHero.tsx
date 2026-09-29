/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import type { ReactNode } from "react";
import { cx, typo } from "./parts";
import p from "./page.module.css";

export type Crumb = { href: string; label: string };
export type HeroMedia = { src: string; alt: string; width: number; height: number; caption?: string };

type Props = {
  // konum: ana sayfadan sonraki adımlar; sonuncusu bulunulan sayfa (bağlantısız)
  crumbs: Crumb[];
  title: string;
  soft?: string;
  lede?: ReactNode;
  actions?: ReactNode;
  // başlığın sağında/altında: iş ortaklığı işaretleri, rozet vb.
  aside?: ReactNode;
  // başlığın üstünde: ürün logosu
  logo?: ReactNode;
  media?: HeroMedia;
};

/** İç sayfaların girişi: konum, başlık (satır satır), açıklama ve bağlantılar; altta açılan geniş fotoğraf. */
export function PageHero({ crumbs, title, soft, lede, actions, aside, logo, media }: Props) {
  const current = crumbs[crumbs.length - 1];
  return (
    <section className={p.hero}>
      <div className="wrap">
        <nav className={p.crumb} aria-label="Konum" data-reveal="">
          <Link href="/">Ana sayfa</Link>
          {crumbs.slice(0, -1).map((c) => (
            <span key={c.href}>
              <i aria-hidden="true">/</i>
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
          <span>
            <i aria-hidden="true">/</i>
            <span aria-current="page">{current.label}</span>
          </span>
        </nav>
        {logo && <div className={p.heroLogo} data-reveal="">{logo}</div>}
        <h1 className={cx("h1", p.heroTitle)} data-split="">
          {typo(title)}
          {soft && <> <span className="soft">{typo(soft)}</span></>}
        </h1>
        {(lede || actions || aside) && (
          <div className={p.heroRow}>
            <div className={p.heroCopy}>
              {lede && <p className="lede" data-reveal="" data-delay=".1">{lede}</p>}
              {actions && <div className="actions" data-reveal="" data-delay=".2">{actions}</div>}
            </div>
            {aside && <div className={p.heroAside} data-reveal="" data-delay=".3">{aside}</div>}
          </div>
        )}
        {media && (
          <figure className={cx("media", p.heroPhoto)} data-media="" data-delay=".15" data-parallax="">
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} fetchPriority="high" />
            {media.caption && <figcaption>{media.caption}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}
