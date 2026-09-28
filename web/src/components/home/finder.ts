// Ana sayfadaki ürün bulucu: "Biz [5–50 kişilik bir işletmeyiz], [üretim yapmıyoruz], [tek şirketiz] ve [programı ofiste kullanacağız]."
// Öneri ve kartlardaki özellikler karşılaştırma tablosuna dayanıyor (kurumsal/karsilastirma.ts):
// üretim Jump Basic'te yok, holding yapısı ve konsolidasyon Fly'ın öne çıkan özelliği, internet olan her yerden erişim Jump Bulut'ta.

import { COMPARE_GROUPS, compareColumn, type CompareId } from "@/components/kurumsal/karsilastirma";
import { PRODUCTS } from "@/components/kurumsal/urunler-data";

export type ShelfKey = "basic" | "jump" | "bulut" | "fly";
export type CompanySize = "1-5" | "5-50" | "50+";
export type FinderAnswers = { size: CompanySize; production: boolean; multiCompany: boolean; cloud: boolean };
export type Recommendation = { key: ShelfKey; why: string[] };
export type Feature = { label: string; included: boolean };

export const SIZE_OPTIONS: { value: CompanySize; label: string }[] = [
  { value: "1-5", label: "1–5 kişilik bir işletmeyiz" },
  { value: "5-50", label: "5–50 kişilik bir işletmeyiz" },
  { value: "50+", label: "50'den fazla kişilik bir işletmeyiz" },
];
export const PRODUCTION_OPTIONS = [
  { value: "0", label: "üretim yapmıyoruz" },
  { value: "1", label: "üretim de yapıyoruz" },
];
// Mikro, Jump'ın çoklu şirket desteği hakkında bir şey söylemiyor; Fly'ı ayıran holding yapısı ve konsolidasyon
export const COMPANY_OPTIONS = [
  { value: "1", label: "tek şirketiz" },
  { value: "n", label: "grup şirketleri olarak konsolide raporluyoruz" },
];
export const ACCESS_OPTIONS = [
  { value: "0", label: "programı ofiste kullanacağız" },
  { value: "1", label: "programa her yerden erişmek istiyoruz" },
];
export const DEFAULT_ANSWERS: FinderAnswers = { size: "5-50", production: false, multiCompany: false, cloud: false };

export type ShelfItem = {
  key: ShelfKey;
  productId: CompareId;
  // Mikro'nun resmi logoları (uploads.mikro.com.tr), 254px genişlikte şeffaf PNG.
  logo: { src: string; height: number; wordmarkRatio: number };
  // Basic ve Bulut'un ayrı logosu yok: Jump logosunun yanında sürüm adı yazılır
  edition?: string;
  forWho: string;
};

// wordmarkRatio = 254 / PNG içindeki "mikro" kelimesinin genişliği. Logolar bu oranla ölçeklenince
// kartlarda "mikro" kelimesi aynı boyda görünüyor (ürün adı uzadıkça PNG'de küçülüyordu).
const JUMP_LOGO = { src: "/images/mikro/jump.png", height: 40, wordmarkRatio: 1.752 };
export const SHELF: ShelfItem[] = [
  { key: "basic", productId: "mikro-jump-basic", logo: JUMP_LOGO, edition: "Basic", forWho: "Ön muhasebeden fazlasını isteyenler" },
  { key: "jump", productId: "mikro-jump", logo: JUMP_LOGO, forWho: "Büyüyen KOBİ'ler" },
  { key: "bulut", productId: "mikro-jump-bulut", logo: JUMP_LOGO, edition: "Bulut", forWho: "Her yerden erişmek isteyenler" },
  { key: "fly", productId: "mikro-fly", logo: { src: "/images/mikro/fly.png", height: 56, wordmarkRatio: 1.539 }, forWho: "Grup şirketleri ve holdingler" },
];

export const productOf = (item: ShelfItem) => {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) throw new Error(`Ürün bulunamadı: ${item.productId}`);
  return product;
};

// kartta gösterilen satırlar: karşılaştırma tablosunda kısa adı (card) olanlar
const CARD_ROWS = COMPARE_GROUPS.flatMap((g) => g.rows).filter((row) => row.card);

/** Kartın alt listesi: karşılaştırma tablosunda ürünün sütunu. */
export function featuresOf(item: ShelfItem): Feature[] {
  const column = compareColumn(item.productId);
  return CARD_ROWS.map((row) => {
    const label = row.card ?? row.label;
    const value = row.values[column];
    if (typeof value === "boolean") return { label, included: value };
    return { label: `${label} (${value.toLocaleLowerCase("tr")})`, included: true };
  });
}

const NAME: Record<ShelfKey, string> = { basic: "Mikro Jump Basic", jump: "Mikro Jump", bulut: "Mikro Jump Bulut", fly: "Mikro Fly" };
const BY_SIZE: Record<CompanySize, ShelfKey> = { "1-5": "basic", "5-50": "jump", "50+": "fly" };
const BASE: Record<ShelfKey, string> = {
  basic: "küçük ve büyümeye başlayan işletmeler için tasarlandı",
  jump: "5–50 çalışanlı işletmeler için tasarlandı",
  bulut: "1–20 çalışanlı, mekândan bağımsız çalışan işletmeler için",
  fly: "50'den fazla çalışanı olan, grup yapısındaki işletmeler için",
};
const EXTRA: Record<ShelfKey, string> = {
  basic: "3 kullanıcıya kadar eş zamanlı çalışma, e-Dönüşüm dahil",
  jump: "genel muhasebe, personel ve üretim modül olarak eklenebilir",
  bulut: "sunucu ve kurulum gerekmez, yedekleme otomatik",
  fly: "tam entegre kurumsal ERP platformu",
};

export const shelfName = (key: ShelfKey) => NAME[key];

export function recommend({ size, production, multiCompany, cloud }: FinderAnswers): Recommendation {
  const bySize = BY_SIZE[size];
  let key = bySize;
  const why: string[] = [];
  if (multiCompany && key !== "fly") {
    key = "fly";
    why.push("holding yapısı ve konsolidasyon Fly'ın öne çıkan özelliği");
  }
  if (production && key === "basic") {
    key = "jump";
    why.push("üretim Jump Basic'te yok, Jump'ta modül olarak eklenir");
  }
  if (cloud && key !== "fly") {
    key = "bulut";
    why.push("internet olan her yerden tarayıcıyla erişim Jump Bulut'ta");
    if (size === "5-50") why.push("Mikro, Jump Bulut'u 1–20 çalışanlı ekipler için konumluyor; kalabalık ekipte keşif görüşmesinde netleştiriyoruz");
  }
  // seçilen koşul sessizce düşmesin
  if (cloud && key === "fly") why.push("Fly'da uzaktan erişim seçeneklerini keşif görüşmesinde netleştiriyoruz");
  if (key === bySize) why.unshift(BASE[key]);
  else if (key === "bulut") why.unshift("Mikro Jump'ın bulut sürümü: sunucu ve kurulum gerekmez");
  else why.unshift(`çalışan sayınıza göre ${NAME[bySize]} yeterdi`);
  if (production && !why.some((w) => w.startsWith("üretim"))) why.push(key === "fly" ? "üretim yönetimi ana pakette" : "temel üretim modül olarak eklenir");
  if (why.length < 2) why.push(EXTRA[key]);
  why[0] = why[0].charAt(0).toLocaleUpperCase("tr") + why[0].slice(1);
  return { key, why };
}
