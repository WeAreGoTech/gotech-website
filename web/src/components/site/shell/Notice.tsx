"use client";

import { useState, useSyncExternalStore } from "react";
import { V16_END } from "../content";
import { Arrow, Close } from "../ui/icons";
import s from "./shell.module.css";

const DAY_MS = 86_400_000;

// takvim günü farkı (saat farkı yuvarlamayı kaydırmasın)
function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY_MS);
}

function message(days: number | null) {
  const more = " Geçişinizi yoğun döneme kalmadan planlayalım.";
  if (days === null || days > 1) {
    const left = days === null ? "" : `: ${days} gün kaldı`;
    return { main: `Mikro V16'nın desteği ${V16_END.label}'da bitiyor${left}.`, more };
  }
  if (days >= 0) return { main: days ? "Mikro V16'nın desteği yarın bitiyor." : "Mikro V16'nın desteği bugün bitiyor.", more };
  return { main: `Mikro V16'nın desteği ${V16_END.label}'da sona erdi.`, more: " V17'ye geçişi hâlâ planlayabiliriz." };
}

const noSubscribe = () => () => {};

/** Üst bant: V16 takvimi. Kalan gün tarayıcıda hesaplanır (sunucuyla gün sınırı farkı hidrasyonu bozmasın). */
export function Notice() {
  const days = useSyncExternalStore(noSubscribe, () => daysUntil(V16_END.iso), () => null);
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  const text = message(days);

  return (
    <div className={s.notice} role="region" aria-label="Duyuru">
      <div className={`wrap ${s.noticeIn}`}>
        <span><b>{text.main}</b><span className={s.noticeMore}>{text.more}</span></span>
        <a href="#iletisim" data-konu="gecis" data-mesaj="V16'dan V17'ye geçiş için plan istiyoruz.">
          Geçiş planı isteyin <Arrow size={13} />
        </a>
        <button className={s.noticeX} type="button" aria-label="Duyuruyu kapat" onClick={() => setClosed(true)}>
          <Close />
        </button>
      </div>
    </div>
  );
}
