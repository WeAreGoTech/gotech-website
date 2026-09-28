// Ana sayfa bölümlerinin ortak parçaları: bölüm başlığı ve küçük yardımcılar.

import Link from "next/link";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import h from "./home.module.css";

// data-in: HomeEffects görününce "on" yazar, CSS yumuşakça getirir
export const REVEAL = { "data-in": "" };

// accent: başlığın sonunda marka renginde yazılan kısım ("İşletmenize uygun" + "Mikro çözümü"); dark: lacivert zeminli bölümde
type SectionHeadProps = { eyebrow: string; title: string; accent?: string; lede?: string; center?: boolean; dark?: boolean };

export function SectionHead({ eyebrow, title, accent, lede, center = false, dark = false }: SectionHeadProps) {
  return (
    <div className={cx(h.head, center && h.center, dark && h.onDark)}>
      <span className={h.eyebrow} {...REVEAL}>{eyebrow}</span>
      <h2 {...REVEAL}>{title}{accent && <> <em>{accent}</em></>}</h2>
      {lede && <p className={h.lede} {...REVEAL}>{lede}</p>}
    </div>
  );
}

export const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export type PageLinkData = { label: string; href: string; konu?: string };

/** Bağlantı: sayfa içi (#) olanlar düz <a> (SmoothScroll kaydırır); konu varsa iletişim formunun konusunu seçer (HomeEffects). */
export function PageLink({ link, className, arrow }: { link: PageLinkData; className: string; arrow?: boolean }) {
  const body = <>{link.label}{arrow && <ArrowIcon />}</>;
  if (link.href.startsWith("#")) return <a className={className} href={link.href} data-konu={link.konu}>{body}</a>;
  return <Link className={className} href={link.href}>{body}</Link>;
}
