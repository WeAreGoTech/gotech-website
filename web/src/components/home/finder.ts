// Ana sayfadaki ürün bulucu: "Biz [5–50 kişilik bir işletmeyiz], [üretim yapmıyoruz] ve [tek şirketiz]."
// Öneri üreticinin karşılaştırma tablosuna dayanıyor (urunler-data.ts COMPARISON):
// üretim Run'da yok, çoklu şirket yalnız Fly'da.

import { COMPARISON, PRODUCTS } from "@/components/kurumsal/urunler-data";

export type ShelfKey = "run" | "jump" | "fly" | "musavir";
export type CompanySize = "1-5" | "5-50" | "50+" | "musavir";
export type FinderAnswers = { size: CompanySize; production: boolean; multiCompany: boolean };
export type Recommendation = { key: ShelfKey; why: string[] };
export type Feature = { label: string; included: boolean };

export const SIZE_OPTIONS: { value: CompanySize; label: string }[] = [
  { value: "1-5", label: "1–5 kişilik bir işletmeyiz" },
  { value: "5-50", label: "5–50 kişilik bir işletmeyiz" },
  { value: "50+", label: "50'den fazla kişilik bir işletmeyiz" },
  { value: "musavir", label: "mali müşavirlik bürosuyuz" },
];
export const PRODUCTION_OPTIONS = [
  { value: "0", label: "üretim yapmıyoruz" },
  { value: "1", label: "üretim de yapıyoruz" },
];
export const COMPANY_OPTIONS = [
  { value: "1", label: "tek şirketiz" },
  { value: "n", label: "birden fazla şirketimiz var" },
];
export const DEFAULT_ANSWERS: FinderAnswers = { size: "5-50", production: false, multiCompany: false };

export type ShelfItem = {
  key: ShelfKey;
  productId: string;
  // Mikro'nun resmi logoları (uploads.mikro.com.tr), 254px genişlikte şeffaf PNG.
  logo: { src: string; height: number; wordmarkRatio: number };
  forWho: string;
};

// wordmarkRatio = 254 / PNG içindeki "mikro" kelimesinin genişliği. Logolar bu oranla ölçeklenince
// dört kartta "mikro" kelimesi aynı boyda görünüyor (ürün adı uzadıkça PNG'de küçülüyordu).
export const SHELF: ShelfItem[] = [
  { key: "run", productId: "mikro-run", logo: { src: "/images/mikro/run.png", height: 44, wordmarkRatio: 1.693 }, forWho: "Esnaf ve küçük işletmeler" },
  { key: "jump", productId: "mikro-jump", logo: { src: "/images/mikro/jump.png", height: 40, wordmarkRatio: 1.752 }, forWho: "Büyüyen KOBİ'ler" },
  { key: "fly", productId: "mikro-fly", logo: { src: "/images/mikro/fly.png", height: 56, wordmarkRatio: 1.539 }, forWho: "Grup şirketleri ve holdingler" },
  { key: "musavir", productId: "mikro-musavir", logo: { src: "/images/mikro/musavir.png", height: 36, wordmarkRatio: 2.134 }, forWho: "Defter beyan ve mükellef yönetimi" },
];

const COMPARED: ShelfKey[] = ["run", "jump", "fly"];
const MUSAVIR_FEATURE_COUNT = 3;

export const productOf = (item: ShelfItem) => {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) throw new Error(`Ürün bulunamadı: ${item.productId}`);
  return product;
};

/** Kartın alt listesi: Run/Jump/Fly karşılaştırma tablosundan, Müşavir kendi modüllerinden. */
export function featuresOf(item: ShelfItem): Feature[] {
  const column = COMPARED.indexOf(item.key);
  if (column === -1) {
    return productOf(item).modules.slice(0, MUSAVIR_FEATURE_COUNT).map((label) => ({ label, included: true }));
  }
  // ilk satır "Çalışan sayısı": kartın üstünde zaten yazıyor
  return COMPARISON.rows.slice(1).map(({ label, values }) => {
    const value = values[column];
    if (typeof value === "boolean") return { label, included: value };
    return { label: `${label} (${value.toLocaleLowerCase("tr")})`, included: true };
  });
}

type ErpKey = Exclude<ShelfKey, "musavir">;

const NAME: Record<ShelfKey, string> = { run: "Mikro Run", jump: "Mikro Jump", fly: "Mikro Fly", musavir: "Mikro Müşavir" };
const BY_SIZE: Record<Exclude<CompanySize, "musavir">, ErpKey> = { "1-5": "run", "5-50": "jump", "50+": "fly" };
const BASE: Record<ErpKey, string> = {
  run: "1–5 çalışanlı işletmeler için tasarlandı",
  jump: "5–50 çalışanlı işletmeler için tasarlandı",
  fly: "50'den fazla çalışanı olan, grup yapısındaki işletmeler için",
};
const EXTRA: Record<ErpKey, string> = {
  run: "e-Dönüşüm paketi ürünün içinde geliyor",
  jump: "Basic ve bulut sürümleri de var",
  fly: "tam entegre kurumsal ERP platformu",
};

export const shelfName = (key: ShelfKey) => NAME[key];

export function recommend({ size, production, multiCompany }: FinderAnswers): Recommendation {
  if (size === "musavir") {
    return { key: "musavir", why: ["Mali müşavirlere özel ürün", "defter beyan, mükellef yönetimi ve e-SMM bir arada"] };
  }
  const bySize = BY_SIZE[size];
  let key: ErpKey = bySize;
  const why: string[] = [];
  if (multiCompany && key !== "fly") {
    key = "fly";
    why.push("birden fazla şirketi tek yerden yönetmek yalnız Fly'da var");
  }
  if (production && key === "run") {
    key = "jump";
    why.push("üretim modülü Run'da yok, Jump'ta var");
  }
  why.unshift(key === bySize ? BASE[key] : `çalışan sayınıza göre ${NAME[bySize]} yeterdi`);
  if (production && !why.some((w) => w.startsWith("üretim"))) why.push("üretim modülü dahil");
  if (why.length < 2) why.push(EXTRA[key]);
  why[0] = why[0].charAt(0).toLocaleUpperCase("tr") + why[0].slice(1);
  return { key, why };
}
