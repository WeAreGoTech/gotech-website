import type { LeadStatus, LeadTopic } from "@/db/schema";

export const TOPIC_LABELS: Record<LeadTopic, string> = {
  erp: "Mikro ERP",
  web: "Web sitesi",
  panel: "Yönetim paneli",
  unsure: "Henüz emin değilim",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  quoted: "Teklif verildi",
  won: "Anlaşıldı",
  lost: "Olmadı",
};
