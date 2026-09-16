import type { ProjectStage, ServiceKind } from "@/db/schema";

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  erp: "Mikro ERP",
  web: "Web sitesi",
  panel: "Yönetim paneli",
};

export const STAGE_LABELS: Record<ProjectStage, string> = {
  discovery: "Keşif",
  design: "Tasarım",
  development: "Geliştirme",
  testing: "Test",
  live: "Canlıda",
};

// Milestones a new project starts with; the team can mark them done as the work moves on.
export const DEFAULT_MILESTONES: Record<ServiceKind, string[]> = {
  erp: ["Keşif ve kapsam", "Ekran tasarımları", "Modüllerin geliştirilmesi", "Veri aktarımı", "Eğitim ve canlıya alma"],
  web: ["Keşif toplantısı", "Tasarım onayı", "Sayfaların geliştirilmesi", "İçerik girişi", "Test ve yayına alma"],
  panel: ["Keşif ve kapsam", "Ekran tasarımları", "Panelin geliştirilmesi", "Test", "Eğitim ve canlıya alma"],
};
