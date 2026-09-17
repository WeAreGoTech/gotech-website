import { DAY_MS, dayKey, daysUntil, TIME_ZONE } from "@/lib/dates";

const dateTime = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE });
const shortDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: TIME_ZONE });
const longDay = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", timeZone: TIME_ZONE });
const fullDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE });
const time = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });

export { dayKey };
export const formatDateTime = (date: Date) => dateTime.format(date);
export const formatShortDate = (date: Date) => shortDate.format(date);
export const formatDate = (date: Date) => fullDate.format(date);
export const formatTime = (date: Date) => time.format(date);

export function dayLabel(date: Date, now = new Date()) {
  const key = dayKey(date);
  if (key === dayKey(now)) return "Bugün";
  if (key === dayKey(new Date(now.getTime() - DAY_MS))) return "Dün";
  return longDay.format(date);
}

/** "3 gün kaldı", "Bugün", "5 gün geçti" */
export function relativeDue(date: Date) {
  const days = daysUntil(date);
  if (days === 0) return "Bugün";
  if (days === 1) return "Yarın";
  return days > 0 ? `${days} gün kaldı` : `${-days} gün geçti`;
}

const KB = 1024;
export function formatBytes(bytes: number) {
  if (bytes < KB * KB) return `${Math.max(1, Math.round(bytes / KB))} KB`;
  return `${(bytes / KB / KB).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
}

const hourFormat = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: TIME_ZONE });

/** Time-of-day greeting in Istanbul time. */
export function greeting(now = new Date()) {
  const hour = Number(hourFormat.format(now));
  if (hour >= 5 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 18) return "İyi günler";
  return "İyi akşamlar";
}
