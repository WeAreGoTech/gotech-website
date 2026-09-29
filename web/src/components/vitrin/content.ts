// Ana sayfanın (vitrin) hizmet panellerinin verisi. Metinlerin hepsi sitenin kendi içeriğinden (site/content.ts ve veri
// dosyaları); burada yalnız az metinli düzen için seçiliyor. Yeni iddia yok.

import { EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import {
  PROCESS_STEPS,
  SERVICE_ANALYSIS,
  SERVICE_INDEX,
  SERVICE_TRAINING,
  SUPPORT_CHANNELS,
} from "@/components/site/content";

export type Panel = { id: string; title: string; text: string; tags: string[]; image: string; alt: string };

const KURULUM_STEP = PROCESS_STEPS.find((s) => s.title === "Kurulum");
const IMAGES: Record<string, { src: string; alt: string }> = {
  analiz: { src: "/images/stok/analiz-atolye.webp", alt: "Beyaz tahta önünde süreçleri konuşan bir ekip" },
  kurulum: { src: "/images/stok/kurulum-ekip.webp", alt: "Dizüstü bilgisayarlarla birlikte çalışan üç kişi" },
  edonusum: { src: "/images/stok/edonusum-evrak.webp", alt: "Masada dizüstü bilgisayar ve not alınan kâğıtlar" },
  egitim: { src: "/images/stok/egitim-sunum.webp", alt: "Toplantı masasında ekibine anlatım yapan bir eğitmen" },
  destek: { src: "/images/stok/destek-gorusme.webp", alt: "Dizüstü bilgisayarla görüntülü görüşme yapan bir kişi" },
};
const TAGS: Record<string, string[]> = {
  analiz: SERVICE_ANALYSIS.items,
  kurulum: KURULUM_STEP?.scope ?? [],
  edonusum: EDONUSUM_DOCS,
  egitim: SERVICE_TRAINING.items,
  destek: SUPPORT_CHANNELS.map((c) => c.title),
};

/** Hizmet panelleri: hizmetler sayfasındaki beş bölüm, her biri bir cümle, kısa etiketler ve fotoğraf. */
export const PANELS: Panel[] = SERVICE_INDEX.map((s) => ({
  id: s.id,
  title: s.title,
  text: s.text,
  tags: TAGS[s.id] ?? [],
  image: IMAGES[s.id].src,
  alt: IMAGES[s.id].alt,
}));
