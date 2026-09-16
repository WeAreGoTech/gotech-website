export const TIME_ZONE = "Europe/Istanbul";
export const DAY_MS = 86_400_000;

const isoDay = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TIME_ZONE });

/** Calendar day in Istanbul time, e.g. "2026-09-16". */
export const dayKey = (date: Date) => isoDay.format(date);

/** Whole days from today to the given date in Istanbul time; negative when it is in the past. */
export const daysUntil = (date: Date, now = new Date()) => Math.round((Date.parse(dayKey(date)) - Date.parse(dayKey(now))) / DAY_MS);

/** A date-only value (midnight UTC) the given number of days from today. */
export function dayOffset(days: number, now = new Date()): Date {
  return new Date(Date.parse(dayKey(now)) + days * DAY_MS);
}
