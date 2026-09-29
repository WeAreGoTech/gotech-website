"use client";

import { useSyncExternalStore } from "react";
import s from "./home.module.css";

// Durum yalnız varsayılan saatlerde hesaplanır; panelden farklı bir saat yazılırsa yalnız metin görünür
const DEFAULT_HOURS = "Hafta içi 09.00–18.00";
const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const MINUTE_MS = 60_000;

// İstanbul saatiyle hafta içi 09.00–18.00 mi (ziyaretçinin saat diliminden bağımsız)
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
  const weekday = parts.find((x) => x.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((x) => x.type === "hour")?.value ?? 0);
  return !["Sat", "Sun"].includes(weekday) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, MINUTE_MS);
  return () => window.clearInterval(id);
};

/** Çalışma saatleri ve şu anki durum (açık/kapalı). Sunucuda durum yazılmaz: saat farkı hidrasyonu bozmasın. reveal: kaydırınca belirsin. */
export function LiveHours({ hours, reveal = true }: { hours: string; reveal?: boolean }) {
  const open = useSyncExternalStore(subscribe, isOpenNow, () => null);
  const live = hours === DEFAULT_HOURS && open !== null;

  return (
    <p className={s.hours} {...(reveal && { "data-reveal": "" })}>
      <span>{hours}</span>
      {live && (
        <span className={open ? s.isOpen : s.isClosed}>
          <i aria-hidden="true" />
          {open ? "Şu an çalışma saatindeyiz" : "Şu an mesai dışındayız; talebinizi portaldan açabilirsiniz"}
        </span>
      )}
    </p>
  );
}
