import type { IconName } from "@/components/app/Icon";
import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";

export type SiteKey = keyof SiteSettings | keyof SiteContent;
export type SiteField = { key: SiteKey; label: string; kind?: "textarea"; hint?: string };
export type SiteSection = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  fields: SiteField[];
  /** "pairs": value + its caption side by side, e.g. the figures */
  layout?: "pairs";
};

export const SITE_SECTIONS: SiteSection[] = [
  {
    id: "iletisim",
    title: "İletişim bilgileri",
    description: "Üst şeritte, iletişim sayfasında ve alt bilgide görünür.",
    icon: "chat",
    fields: [
      { key: "salesPhone", label: "Satış telefonu", hint: "Üst şeritte, ana sayfada ve alt bilgide görünür." },
      { key: "supportPhone", label: "Destek telefonu" },
      { key: "email", label: "E-posta" },
      { key: "workingHours", label: "Çalışma saatleri", hint: '"Satış ve destek hattımız …" cümlesinin devamı olarak yazılır.' },
      { key: "address", label: "Adres", kind: "textarea", hint: "Her satır alt bilgide ayrı satır olur." },
      { key: "slogan", label: "Slogan" },
    ],
  },
  {
    id: "sosyal",
    title: "Sosyal medya",
    description: "Boş bırakılan hesabın bağlantısı sitede hiç görünmez.",
    icon: "globe",
    fields: [
      { key: "linkedin", label: "LinkedIn" },
      { key: "instagram", label: "Instagram" },
      { key: "facebook", label: "Facebook" },
      { key: "twitter", label: "X (Twitter)" },
      { key: "youtube", label: "YouTube" },
    ],
  },
  {
    id: "giris",
    title: "Ana sayfa girişi",
    description: "Ana sayfanın en üstündeki bölüm: solda başlık ve tanıtım cümlesi, sağda fotoğraf.",
    icon: "home",
    fields: [
      { key: "heroTitle", label: "Başlık", hint: "Sayfanın en büyük cümlesi." },
      { key: "heroLead", label: "Tanıtım cümlesi", kind: "textarea" },
    ],
  },
  {
    id: "rakamlar",
    title: "Rakamlar",
    description: "Ana sayfada Mikro logosunun yanında görünür. Yalnız doğrulanabilir bilgi yazın; boş bırakılan rakam gösterilmez.",
    icon: "star",
    layout: "pairs",
    fields: [
      { key: "stat1Value", label: "1. rakam" },
      { key: "stat1Label", label: "Açıklaması" },
      { key: "stat2Value", label: "2. rakam" },
      { key: "stat2Label", label: "Açıklaması" },
      { key: "stat3Value", label: "3. rakam" },
      { key: "stat3Label", label: "Açıklaması" },
      { key: "stat4Value", label: "4. rakam" },
      { key: "stat4Label", label: "Açıklaması" },
    ],
  },
  {
    id: "kapanis",
    title: "İletişim bölümü",
    description: "Her sayfanın sonundaki kırmızı iletişim kartı (ürün sayfaları kendi başlığını kullanır). Buton yazısı ana sayfanın girişindeki demo butonunda.",
    icon: "layout",
    fields: [
      { key: "ctaTitle", label: "Başlık" },
      { key: "ctaLead", label: "Alt başlık", kind: "textarea" },
      { key: "ctaButtonText", label: "Buton yazısı" },
    ],
  },
  {
    id: "alt-bilgi",
    title: "Alt bilgi",
    description: "Bütün sayfaların en altındaki alan.",
    icon: "building",
    fields: [
      { key: "footerAbout", label: "Tanıtım yazısı", kind: "textarea" },
      { key: "footerCopyright", label: "Telif satırı" },
    ],
  },
];
