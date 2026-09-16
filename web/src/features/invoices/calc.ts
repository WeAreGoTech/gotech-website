import type { InvoiceStatus } from "@/db/schema";
import { daysUntil } from "@/lib/dates";

export const VAT_RATE = 0.2;
export const INVOICE_PAYMENT_DAYS = 30;

export type InvoiceState = InvoiceStatus | "overdue";

export const INVOICE_STATE_LABELS: Record<InvoiceState, string> = {
  pending: "Ödeme bekleniyor",
  overdue: "Vadesi geçti",
  paid: "Ödendi",
  cancelled: "İptal edildi",
};

/** Overdue is derived: a pending invoice whose due date has passed. */
export function invoiceState(status: InvoiceStatus, dueOn: Date, now = new Date()): InvoiceState {
  return status === "pending" && daysUntil(dueOn, now) < 0 ? "overdue" : status;
}

/** Subtotal is before VAT; all values in kuruş. */
export function withVat(subtotal: number) {
  const vat = Math.round(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}

export const lineTotal = (line: { quantity: number; unitPrice: number }) => line.quantity * line.unitPrice;

/** Parses "18.000,50" or "18000.50" into kuruş; null when it is not a positive amount. */
export function parseMoney(input: string): number | null {
  const normalized = input.trim().replace(/\s|₺/g, "");
  const decimal = normalized.includes(",") ? normalized.replace(/\./g, "").replace(",", ".") : normalized;
  const value = Number(decimal);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : null;
}
