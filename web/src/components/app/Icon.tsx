import type { ServiceKind, TicketCategory } from "@/db/schema";

// Stroke icons drawn on a 24px grid.
const PATHS = {
  arrowLeft: "M15 18l-6-6 6-6",
  plus: "M12 5v14M5 12h14",
  send: "M21 3L10.5 13.5M21 3l-6.5 18-4-7.5L3 10.5 21 3z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chat: "M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-5A8.5 8.5 0 1 1 21 11.5z",
  alert: "M12 8.5v4.5M12 16.5v.5M10.3 3.9L2.4 17.6a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6",
  inbox: "M3 13h5l2 3h4l2-3h5M3 13l2.6-7.2A1.2 1.2 0 0 1 6.7 5h10.6a1.2 1.2 0 0 1 1.1.8L21 13v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z",
  form: "M9 3h6v3H9zM7 4.5H5.5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1H17M8 11h8M8 15h5",
  users: "M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1.5a4 4 0 0 0-3-3.9M15.5 3.6a3.5 3.5 0 0 1 0 6.8",
  mail: "M3.5 5.5h17v13h-17zM3.5 6.5l8.5 6 8.5-6",
  lock: "M6 10.5h12v10H6zM8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3",
  logout: "M15 17l5-5-5-5M20 12H9M11 4H5v16h6",
  home: "M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5z",
  folder: "M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4.4l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V7z",
  file: "M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5l-5-5zM13.5 3.5v5h5M9 13h6M9 16.5h4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z",
  download: "M12 4v11M7 10.5l5 5 5-5M5 19.5h14",
  paperclip: "M20.5 11.5l-8.3 8.3a5 5 0 0 1-7.1-7.1l8.3-8.3a3.4 3.4 0 0 1 4.8 4.8l-8.3 8.3a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6",
  calendar: "M4.5 6.5h15v14h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  building: "M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 15 5v15.5M15 9.5h3.5A1.5 1.5 0 0 1 20 11v9.5M3 20.5h18M8.5 7.5h3M8.5 11h3M8.5 14.5h3",
  chevronRight: "M9 6l6 6-6 6",
  close: "M6 6l12 12M18 6L6 18",
  globe: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM3.5 12h17M12 3.5c2.3 2.3 3.5 5.3 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.3-3.5-8.5s1.2-6.2 3.5-8.5z",
  cube: "M12 3.5l8 4.5v8L12 20.5 4 16V8l8-4.5zM4 8l8 4.5L20 8M12 12.5v8",
  layout: "M4 4.5h16v15H4zM4 9h16M9.5 9v10.5",
  monitor: "M3.5 4.5h17v11h-17zM8.5 20h7M12 15.5V20",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const SERVICE_ICONS: Record<ServiceKind, IconName> = { erp: "cube", web: "globe", panel: "layout" };

export const CATEGORY_ICONS: Record<TicketCategory, IconName> = {
  support: "chat",
  bug: "alert",
  request: "sparkle",
  billing: "receipt",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("tr-TR"))
    .join("");

export function Avatar({ name, tone = "team", small = false }: { name: string; tone?: "team" | "customer"; small?: boolean }) {
  return (
    <span className={`avatar is-${tone}${small ? " is-small" : ""}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
