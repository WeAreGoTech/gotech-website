// Akış bölümündeki temsili Mikro Jump ekranı. Dört modül, akıştaki dört durağa karşılık geliyor:
// sipariş girilir → stok düşer → fatura GİB'e gider → rapora işler.

export type PanelModule = {
  name: string;
  kpis: { label: string; value: string }[];
  columns: [string, string, string];
  rows: { a: string; b: string; tag: string; hot?: boolean }[];
};

export const PANEL_MODULES: PanelModule[] = [
  {
    name: "Satış",
    kpis: [
      { label: "Bugünkü sipariş", value: "37" },
      { label: "Bekleyen teklif", value: "9" },
      { label: "Günlük ciro", value: "₺12.940" },
    ],
    columns: ["Sipariş", "Cari", "Durum"],
    rows: [
      { a: "SP-4471", b: "Kavurma Atölyesi", tag: "Yeni", hot: true },
      { a: "SP-4470", b: "Nova Diş Kliniği", tag: "Sevk edildi" },
      { a: "SP-4469", b: "Er Kozmetik", tag: "Sevk edildi" },
      { a: "SP-4468", b: "Öz Yedek Parça", tag: "Faturalandı" },
    ],
  },
  {
    name: "Stok",
    kpis: [
      { label: "Kritik stok", value: "4" },
      { label: "Depo", value: "3" },
      { label: "Bekleyen sayım", value: "1" },
    ],
    columns: ["Ürün", "Depo", "Adet"],
    rows: [
      { a: "Filtre kağıdı 250g", b: "Merkez", tag: "12 → 9", hot: true },
      { a: "Vakum poşeti 20×30", b: "Merkez", tag: "8" },
      { a: "Etiket rulosu", b: "Şube 2", tag: "3" },
      { a: "Karton koli No.4", b: "Depo A", tag: "41" },
    ],
  },
  {
    name: "e-Fatura",
    kpis: [
      { label: "Gönderilen", value: "218" },
      { label: "Bekleyen", value: "2" },
      { label: "Reddedilen", value: "0" },
    ],
    columns: ["Fatura", "Cari", "Durum"],
    rows: [
      { a: "GIB2026-0912", b: "Kavurma Atölyesi", tag: "Onaylandı", hot: true },
      { a: "GIB2026-0911", b: "Ateş Mobilya", tag: "Onaylandı" },
      { a: "GIB2026-0910", b: "Nova Diş Kliniği", tag: "GİB'de" },
      { a: "GIB2026-0909", b: "Ayşe Kaya", tag: "Onaylandı" },
    ],
  },
  {
    name: "Raporlar",
    kpis: [
      { label: "Günlük satış", value: "₺48.320" },
      { label: "Brüt kâr", value: "%31" },
      { label: "Tahsilat", value: "₺7.150" },
    ],
    columns: ["Rapor", "Dönem", "Değer"],
    rows: [
      { a: "Günlük satış özeti", b: "21 Eylül", tag: "₺48.320", hot: true },
      { a: "Stok devir hızı", b: "Eylül", tag: "4,2" },
      { a: "Cari yaşlandırma", b: "Eylül", tag: "₺23.400" },
      { a: "Kârlılık", b: "3. çeyrek", tag: "%31" },
    ],
  },
];

export const PANEL_IDLE_MODULES = ["Genel bakış", "Cari", "Muhasebe"];
