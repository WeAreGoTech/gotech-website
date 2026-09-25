// /yazilim-cozumleri: girişte ne tür yazılımlar geliştirdiğimiz (süzülebilir liste), sonra referans ve iletişim.
// İş listeleri referanslar.ts'ten (MIKRO_WORK, INDEPENDENT_WORK); yalnız GoTech'in gerçekten yaptığı işler.
import { INDEPENDENT_WORK, MIKRO_WORK } from "@/components/kurumsal/referanslar";

export type WorkKind = "mikro" | "bagimsiz";
export type Work = { title: string; body: string; kind: WorkKind };

export const KIND_LABEL: Record<WorkKind, string> = { mikro: "Mikro'ya bağlı", bagimsiz: "Mikro'dan bağımsız" };

// hazır çözümleri kurup bağlamak yazılım geliştirme değil: bu sayfada yalnız yazdığımız işler
const NOT_DEVELOPMENT = "Kurup bağladığımız ek çözümler";

export const WORKS: Work[] = [
  ...MIKRO_WORK.filter((w) => w.title !== NOT_DEVELOPMENT).map((w) => ({ ...w, kind: "mikro" as const })),
  ...INDEPENDENT_WORK.map((w) => ({ ...w, kind: "bagimsiz" as const })),
];
