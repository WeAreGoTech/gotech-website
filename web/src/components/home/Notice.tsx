"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { V16_END } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";

const DAY_MS = 86_400_000;

// Takvim günü farkı (saat farkı yuvarlamayı kaydırmasın)
function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY_MS);
}

function message(days: number | null) {
  const base = `V16 desteği ${V16_END.label}'da bitiyor.`;
  if (days === null) return { main: base, more: " Geçişi yoğun döneme bırakmayın." };
  if (days > 1) return { main: `V16 desteği ${V16_END.label}'da bitiyor: ${days} gün kaldı.`, more: " Geçişi yoğun döneme bırakmayın." };
  if (days >= 0) return { main: days ? "V16 desteği yarın bitiyor." : "V16 desteği bugün bitiyor.", more: " Geçişi yoğun döneme bırakmayın." };
  return { main: `V16 desteği ${V16_END.label}'da sona erdi.`, more: " Geçişi hâlâ planlayabiliriz." };
}

const noSubscribe = () => () => {};

/** Üst bant: V16 takvimi. Kalan gün tarayıcıda hesaplanır (sunucu ile gün sınırı farkı hidrasyonu bozmasın). */
export function Notice() {
  const days = useSyncExternalStore(noSubscribe, () => daysUntil(V16_END.iso), () => null);
  const [closed, setClosed] = useState(false);

  if (closed) return null;
  const text = message(days);

  return (
    <div className={h.notice} role="region" aria-label="Duyuru">
      <div className={h.wrap}>
        <span><b>{text.main}</b><span className={h.noticeMore}>{text.more}</span></span>
        <a href="#iletisim" data-konu="gecis" data-mesaj="V16'dan geçiş planı istiyoruz.">Geçiş planı isteyin <ArrowIcon size={14} /></a>
        <button className={h.noticeX} type="button" aria-label="Duyuruyu kapat" onClick={() => setClosed(true)}>
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
