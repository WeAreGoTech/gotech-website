// Sitenin küçük ortak parçaları: bölüm etiketi, başlık grubu, akıllı bağlantı.

import Link from "next/link";
import type { ReactNode } from "react";
import type { PageLinkData } from "@/components/home/parts";
import { Arrow } from "./icons";

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");
export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

/** Büyük puntolu yazıda düz kesme işareti (') yerine tipografik olanı (’): "Fly’ı", "Mikro’nun". */
export const typo = (text: string) => text.replace(/'/g, "\u2019");

/** Bölüm etiketi: logodaki + imi ve kısa ad. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("label", className)} data-reveal="">
      <span className="plus" aria-hidden="true" />
      {children}
    </p>
  );
}

type HeadProps = {
  label?: string;
  title: ReactNode;
  // başlığın gri ikinci cümlesi
  soft?: string;
  lede?: ReactNode;
  as?: "h1" | "h2";
  size?: "display" | "h1" | "h2";
  className?: string;
  children?: ReactNode;
};

/** Başlık grubu: etiket, satır satır yükselen başlık (data-split), açıklama. */
export function Head({ label, title, soft, lede, as: Tag = "h2", size = "h2", className, children }: HeadProps) {
  return (
    <div className={cx("head", className)}>
      {label && <Label>{label}</Label>}
      <Tag className={size} data-split="">
        {typeof title === "string" ? typo(title) : title}
        {soft && <> <span className="soft">{typo(soft)}</span></>}
      </Tag>
      {lede && <p className="lede" data-reveal="">{lede}</p>}
      {children}
    </div>
  );
}

type GoProps = { link: PageLinkData; className?: string; arrow?: boolean; children?: ReactNode; reveal?: boolean };

/**
 * Bağlantı: sayfa içi (#) olanlar düz <a> (Motion kaydırır); konu varsa iletişim formunun konusunu seçer (Prefill).
 * Varsayılan görünüm düz yazı bağlantısı (tlink); className ile buton olur.
 */
export function Go({ link, className = "tlink", arrow = true, children, reveal = false }: GoProps) {
  const body = <>{children ?? link.label}{arrow && <Arrow />}</>;
  const extra = reveal ? { "data-reveal": "" } : {};
  if (link.href.startsWith("#")) {
    return <a className={className} href={link.href} data-konu={link.konu} {...extra}>{body}</a>;
  }
  return <Link className={className} href={link.href} {...extra}>{body}</Link>;
}
