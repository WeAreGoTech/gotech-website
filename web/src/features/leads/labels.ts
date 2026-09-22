import type { LeadStatus, LeadTopic } from "@/db/schema";

export const TOPIC_LABELS: Record<LeadTopic, string> = {
  bilgi: "Genel bilgi",
  demo: "Demo talebi",
  teklif: "Fiyat teklifi",
  destek: "Teknik destek",
  ortaklik: "İş ortaklığı",
  diger: "Diğer",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  quoted: "Teklif verildi",
  won: "Anlaşıldı",
  lost: "Olmadı",
};
