"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./select.css";

type DatePickerProps = {
  name: string;
  id?: string;
  /** yyyy-mm-dd, the value the form submits */
  defaultValue?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
const DAYS_IN_WEEK = 7;
const CALENDAR_CELLS = 42;
const MIN_SPACE_BELOW_PX = 360;
const CALENDAR_WIDTH_PX = 300;

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const sameDay = (a: Date, b: Date) => toIso(a) === toIso(b);

function parseIso(value: string | undefined): Date | null {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

const formatLong = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/** Monday-first 6-week grid around the month of `view`. */
function monthGrid(view: Date): Date[] {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
  return Array.from({ length: CALENDAR_CELLS }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i - offset + 1));
}

/** Themed replacement for <input type="date">, whose native control ignores the panel design and overflows narrow columns. */
export function DatePicker({ name, id, defaultValue, placeholder = "Tarih seçin", ...aria }: DatePickerProps) {
  const dialogId = useId();
  const [value, setValue] = useState<Date | null>(parseIso(defaultValue));
  const [open, setOpen] = useState(false);
  const [upwards, setUpwards] = useState(false);
  const [leftwards, setLeftwards] = useState(false);
  const [cursor, setCursor] = useState<Date>(value ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function openCalendar() {
    const rect = buttonRef.current?.getBoundingClientRect();
    setUpwards(rect ? window.innerHeight - rect.bottom < MIN_SPACE_BELOW_PX && rect.top > window.innerHeight - rect.bottom : false);
    // keep the calendar on screen: align it to the button's right edge when it would run past the viewport
    setLeftwards(rect ? rect.left + CALENDAR_WIDTH_PX > window.innerWidth : false);
    setCursor(value ?? new Date());
    setOpen(true);
  }

  function pick(day: Date | null) {
    setValue(day);
    setOpen(false);
    buttonRef.current?.focus();
  }

  const shiftMonth = (by: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + by, 1));
  const shiftDays = (by: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + by));

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCalendar();
      }
      return;
    }
    const keys: Record<string, () => void> = {
      ArrowLeft: () => shiftDays(-1),
      ArrowRight: () => shiftDays(1),
      ArrowUp: () => shiftDays(-DAYS_IN_WEEK),
      ArrowDown: () => shiftDays(DAYS_IN_WEEK),
      PageUp: () => shiftMonth(-1),
      PageDown: () => shiftMonth(1),
      Enter: () => pick(cursor),
      " ": () => pick(cursor),
      Escape: () => setOpen(false),
    };
    const handler = keys[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  const today = new Date();
  return (
    <div ref={rootRef} className={`select datepicker${open ? " is-open" : ""}${upwards ? " opens-up" : ""}${leftwards ? " opens-left" : ""}`}>
      <input type="hidden" name={name} value={value ? toIso(value) : ""} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className="input select-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => (open ? setOpen(false) : openCalendar())}
        onKeyDown={onKeyDown}
        {...aria}
      >
        <span className={`select-value${value ? "" : " is-placeholder"}`}>{value ? formatLong(value) : placeholder}</span>
        <svg className="select-chevron" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="select-list calendar" id={dialogId} role="dialog" aria-label="Tarih seçin" onKeyDown={onKeyDown}>
          <div className="calendar-head">
            <button type="button" className="calendar-nav" onClick={() => shiftMonth(-1)} aria-label="Önceki ay">‹</button>
            <strong>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</strong>
            <button type="button" className="calendar-nav" onClick={() => shiftMonth(1)} aria-label="Sonraki ay">›</button>
          </div>
          <div className="calendar-grid" role="grid">
            {WEEKDAYS.map((d) => <span key={d} className="calendar-weekday">{d}</span>)}
            {monthGrid(cursor).map((day) => (
              <button
                key={toIso(day)}
                type="button"
                className={[
                  "calendar-day",
                  day.getMonth() !== cursor.getMonth() && "is-outside",
                  sameDay(day, today) && "is-today",
                  value && sameDay(day, value) && "is-selected",
                  sameDay(day, cursor) && "is-cursor",
                ].filter(Boolean).join(" ")}
                aria-pressed={value ? sameDay(day, value) : false}
                aria-label={formatLong(day)}
                tabIndex={-1}
                onClick={() => pick(day)}
              >
                {day.getDate()}
              </button>
            ))}
          </div>
          <div className="calendar-foot">
            <button type="button" className="calendar-link" onClick={() => pick(null)}>Temizle</button>
            <button type="button" className="calendar-link" onClick={() => pick(today)}>Bugün</button>
          </div>
        </div>
      )}
    </div>
  );
}
