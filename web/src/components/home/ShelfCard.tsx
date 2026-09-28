/* eslint-disable @next/next/no-img-element -- Mikro'nun resmi logoları public/images/mikro'dan olduğu gibi */
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { featuresOf, productOf, type ShelfItem } from "./finder";
import f from "./finder.module.css";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx } from "./parts";

type Props = { item: ShelfItem; recommended: boolean };

/** Ürün kartı: tür etiketi ve GoTech'in iş ortaklığı rozeti, Mikro'nun resmi logosu, ölçek, kısa açıklama, kapsam; altta ürün sayfası ve demo. */
export function ShelfCard({ item, recommended }: Props) {
  const product = productOf(item);
  const logoStyle = { "--k": item.logo.wordmarkRatio } as CSSProperties;

  return (
    <article className={cx(h.card, f.card, recommended && f.isRec)} id={`urun-${item.key}`}>
      {recommended && <span className={f.rec}>Size önerimiz</span>}
      <div className={f.cardTop}>
        <span className={f.kind}>{item.kind}</span>
        <span className={f.chip} title={`GoTech, Mikro ${item.partner} Partner`}><Icon name="award" size={13} stroke={2} />{item.partner}</span>
      </div>
      <h3 className={f.brand}>
        <img className={f.logo} src={item.logo.src} alt={item.edition ? "Mikro Jump" : product.name} width={254} height={item.logo.height} style={logoStyle} />
        {item.edition && <span className={f.edition}>{item.edition}</span>}
      </h3>
      <p className={f.scale}><Icon name="users" size={15} />{product.scale.replace("-", "–")}</p>
      <p className={f.blurb}>{product.blurb}</p>
      <ul className={f.features}>
        {featuresOf(item).map((x) => (
          <li key={x.label} className={x.included ? f.yes : f.no}>
            {x.label}
            {!x.included && <span className={h.sr}> (yok)</span>}
          </li>
        ))}
      </ul>
      <div className={f.cardFoot}>
        <Link className={h.link} href={product.page}>Detayları inceleyin <ArrowIcon /></Link>
        <a className={f.demo} href="#iletisim" data-konu="demo" data-mesaj={`${product.name} için demo istiyorum.`}>Demo isteyin</a>
      </div>
    </article>
  );
}
