"use client";

import { scrollToTarget } from "./Motion";

/** Alt bilgideki "Başa dön": sayfanın başına kayar, odak menüdeki logoya geçer (klavyeyle gelen oradan devam etsin). */
export function ToTop({ className }: { className?: string }) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        scrollToTarget(0);
        document.querySelector<HTMLElement>("[data-nav] a")?.focus({ preventScroll: true });
      }}
    >
      Başa dön
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 13V3M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
