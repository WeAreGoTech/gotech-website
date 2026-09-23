// Ana sayfa bölümlerinin ortak parçaları: bölüm başlığı ve ikonlu kart.

import type { ReactNode } from "react";
import type { IconCardItem } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import s from "./sections.module.css";

// data-in: HomeEffects görününce "on" yazar, CSS yumuşakça getirir
export const REVEAL = { "data-in": "" };

type SectionHeadProps = { eyebrow: string; title: string; lede?: string; center?: boolean };

export function SectionHead({ eyebrow, title, lede, center = false }: SectionHeadProps) {
  return (
    <div className={center ? `${h.head} ${h.center}` : h.head}>
      <span className={h.eyebrow} {...REVEAL}>{eyebrow}</span>
      <h2 {...REVEAL}>{title}</h2>
      {lede && <p className={h.lede} {...REVEAL}>{lede}</p>}
    </div>
  );
}

export function IconCard({ icon, title, body, action }: IconCardItem & { action?: ReactNode }) {
  return (
    <article className={s.card} {...REVEAL}>
      <span className={s.ico}><Icon name={icon} /></span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </article>
  );
}

export const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
