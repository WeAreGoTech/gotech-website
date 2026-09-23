/* eslint-disable @next/next/no-img-element -- Mikro'nun resmi logoları public/images/mikro'dan olduğu gibi */
"use client";

import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { featuresOf, productOf, type ShelfItem } from "./finder";
import f from "./finder.module.css";
import h from "./home.module.css";
import { cx } from "./parts";

type Props = { item: ShelfItem; open: boolean; recommended: boolean; onOpen: () => void };

/** Raftaki bir ürün: kapalıyken logo + ölçek + kime uygun; açıkken açıklama, kapsam ve demo butonu. */
export function ShelfCard({ item, open, recommended, onOpen }: Props) {
  const product = productOf(item);
  const bodyId = `urun-${item.key}`;
  const logoStyle = { "--k": item.logo.wordmarkRatio } as CSSProperties;

  return (
    <article className={cx(f.prod, open && f.open, recommended && f.isRec)}>
      <button className={f.head} type="button" aria-expanded={open} aria-controls={bodyId} onClick={onOpen}>
        <span className={f.rec}>Size önerimiz</span>
        <img className={f.logo} src={item.logo.src} alt={product.name} width={254} height={item.logo.height} style={logoStyle} />
        <span className={f.scale}>{product.scale.replace("-", "–")}</span>
        <span className={f.forWho}>{item.forWho}</span>
        <span className={f.plus} aria-hidden="true" />
      </button>
      {/* kapalı kartın gövdesi görünmez: inert ile odak ve ekran okuyucu dışında kalır */}
      <div className={f.body} id={bodyId} role="region" aria-label={product.name} inert={!open}>
        <div className={f.inner}>
          {product.popular && <span className={f.flag}>En çok tercih edilen</span>}
          <p className={f.blurb}>{product.blurb}</p>
          <ul className={f.features}>
            {featuresOf(item).map((x) => <li key={x.label} className={x.included ? f.yes : f.no}>{x.label}</li>)}
          </ul>
          <a className={cx(h.btn, f.demo)} href="#iletisim" data-konu="demo">{product.name} için demo isteyin <ArrowIcon /></a>
        </div>
      </div>
    </article>
  );
}
