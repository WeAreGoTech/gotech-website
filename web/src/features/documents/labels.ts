import type { DocumentKind } from "@/db/schema";

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  contract: "Sözleşme",
  proposal: "Teklif",
  guide: "Kılavuz",
  report: "Rapor",
};
