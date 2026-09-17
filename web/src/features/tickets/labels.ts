import type { TicketCategory, TicketPriority, TicketStatus } from "@/db/schema";

// "billing" stays in the database for old tickets, but new tickets can no longer choose it
export const NEW_TICKET_CATEGORIES = ["support", "bug", "request"] as const satisfies readonly TicketCategory[];

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  support: "Destek",
  bug: "Hata bildirimi",
  request: "Yeni istek",
  billing: "Fatura ve ödeme",
};

export const CATEGORY_HINTS: Record<TicketCategory, string> = {
  support: "Nasıl yapılır, soru",
  bug: "Bir şey çalışmıyor",
  request: "Yeni özellik ya da değişiklik",
  billing: "Fatura, ödeme, sözleşme",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  normal: "Normal",
  high: "Yüksek",
  urgent: "Acil",
};

// The same status reads differently for the team and for the customer.
export const STATUS_LABELS: Record<"staff" | "customer", Record<TicketStatus, string>> = {
  staff: { open: "Açık", in_progress: "İşlemde", waiting_customer: "Müşteri yanıtı bekleniyor", closed: "Kapandı" },
  customer: { open: "Açık", in_progress: "İşlemde", waiting_customer: "Yanıtınız bekleniyor", closed: "Kapandı" },
};
