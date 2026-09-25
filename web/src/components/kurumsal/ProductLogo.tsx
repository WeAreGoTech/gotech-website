/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { CSSProperties } from "react";
import { SHELF } from "@/components/home/finder";
import s from "./product-logo.module.css";

/**
 * Mikro'nun resmi ürün logosu (ürün bulucudaki SHELF verisi). Basic ve Bulut'un ayrı logosu yok: Jump logosunun yanında sürüm adı.
 * Kılavuz: ekranda 120px'den dar kullanılmaz, yalnız beyaz zeminde. --k logolarda "mikro" kelimesini aynı boya getirir.
 */
/** Basic / Bulut gibi sürüm adı; ayrı logosu olan ürünlerde boş. */
export const editionOf = (id: string) => SHELF.find((x) => x.productId === id)?.edition ?? "";

/** edition={false}: sürüm adını çağıran başka yerde yazar (karşılaştırma tablosunda kullanıcı satırında). */
export function ProductLogo({ id, name, edition = true }: { id: string; name: string; edition?: boolean }) {
  const item = SHELF.find((x) => x.productId === id);
  if (!item) return <>{name}</>;
  return (
    <span className={s.logo} aria-label={name} role="img">
      <img src={item.logo.src} alt="" width={254} height={item.logo.height} style={{ "--k": item.logo.wordmarkRatio } as CSSProperties} />
      {edition && item.edition && <span>{item.edition}</span>}
    </span>
  );
}
