"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import { PRODUCT_LINES } from "@/components/site/content";
import { Arrow } from "@/components/site/ui/icons";
import { cx } from "@/components/site/ui/parts";
import s from "./products.module.css";

/**
 * Jump mı, Fly mı: iki sekmeli seçici (resmi logolar beyaz zeminde, altında kayan kırmızı çizgi). Seçilen ürünün fotoğrafı
 * yumuşakça geçer, yanında sürümleri ya da öne çıkanları. Ok tuşlarıyla sekmeler arasında gezilir.
 */
export function ProductSwitch() {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const line = PRODUCT_LINES[index];

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + PRODUCT_LINES.length) % PRODUCT_LINES.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={s.switch}>
      <div className={s.tabs} role="tablist" aria-label="Mikro ürünleri" onKeyDown={onKey} style={{ "--i": index } as CSSProperties}>
        {PRODUCT_LINES.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { tabs.current[i] = el; }}
            className={s.tab}
            type="button"
            role="tab"
            id={`urun-${p.id}`}
            aria-selected={i === index}
            aria-controls="urun-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
          >
            <ProductLogo id={p.id} name={p.name} />
            <span className={s.for}>{p.audience}</span>
          </button>
        ))}
        <span className={s.bar} aria-hidden="true" />
      </div>

      <div className={s.panel} id="urun-panel" role="tabpanel" aria-labelledby={`urun-${line.id}`}>
        <div className={s.photo}>
          {PRODUCT_LINES.map((p, i) => (
            <img key={p.id} className={cx(i === index && s.shown)} src={p.image.src} alt={i === index ? p.image.alt : ""} loading="lazy" />
          ))}
        </div>
        <div className={s.detail} key={line.id}>
          {line.versions && (
            <ul className={s.versions}>
              {line.versions.map((v) => (
                <li key={v.href}><Link href={v.href}><b>{v.name}</b><span>{v.note}</span><Arrow /></Link></li>
              ))}
            </ul>
          )}
          {line.points && <ul className={cx("ticks", s.points)}>{line.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
          <div className="actions">
            <Link className="btn btn-line btn-sm" href={line.page}>{line.name} sayfası <Arrow /></Link>
            <a className="tlink" href="#iletisim" data-konu="demo" data-mesaj={`${line.name} için demo istiyoruz.`}>Demo isteyin</a>
          </div>
        </div>
      </div>
    </div>
  );
}
