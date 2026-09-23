import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";

export type SiteField<K> = { key: K; label: string; kind?: "textarea"; hint?: string };

export const SITE_SETTINGS_FIELDS: SiteField<keyof SiteSettings>[] = [
  { key: "salesPhone", label: "Satış telefonu", hint: "Üst şeritte, ana sayfada ve alt bilgide görünür." },
  { key: "supportPhone", label: "Destek telefonu" },
  { key: "workingHours", label: "Çalışma saatleri", hint: '"Satış ve destek hattımız …" cümlesinin devamı olarak yazılır.' },
  { key: "email", label: "E-posta" },
  { key: "address", label: "Adres", kind: "textarea", hint: "Her satır alt bilgide ayrı satır olur." },
  { key: "slogan", label: "Slogan" },
  { key: "linkedin", label: "LinkedIn adresi", hint: "Boş bırakılırsa bağlantı hiç görünmez." },
  { key: "facebook", label: "Facebook adresi", hint: "Boş bırakılırsa bağlantı hiç görünmez." },
  { key: "instagram", label: "Instagram adresi", hint: "Boş bırakılırsa bağlantı hiç görünmez." },
  { key: "twitter", label: "X (Twitter) adresi", hint: "Boş bırakılırsa bağlantı hiç görünmez." },
  { key: "youtube", label: "YouTube adresi", hint: "Boş bırakılırsa bağlantı hiç görünmez." },
];

export const SITE_CONTENT_GROUPS: { title: string; description: string; fields: SiteField<keyof SiteContent>[] }[] = [
  {
    title: "Ana sayfa girişi",
    description: "Ana sayfanın en üstündeki bölüm: solda başlık ve tanıtım cümlesi, sağda fotoğraf.",
    fields: [
      { key: "heroTitle", label: "Başlık", hint: "Sayfanın en büyük cümlesi." },
      { key: "heroLead", label: "Tanıtım cümlesi", kind: "textarea" },
    ],
  },
  {
    title: "Rakamlar",
    description: "İlk üçü ana sayfada Mikro logosunun yanında; dördü de iç sayfaların kapanış bölümünde görünür.",
    fields: [
      { key: "stat1Value", label: "1. rakam" },
      { key: "stat1Label", label: "1. rakamın açıklaması" },
      { key: "stat2Value", label: "2. rakam" },
      { key: "stat2Label", label: "2. rakamın açıklaması" },
      { key: "stat3Value", label: "3. rakam" },
      { key: "stat3Label", label: "3. rakamın açıklaması" },
      { key: "stat4Value", label: "4. rakam" },
      { key: "stat4Label", label: "4. rakamın açıklaması" },
    ],
  },
  {
    title: "Kapanış bölümü",
    description: "İç sayfaların en altındaki kırmızı alan. Buton yazısı ana sayfanın girişindeki demo butonunda da kullanılır.",
    fields: [
      { key: "ctaTitle", label: "Başlık" },
      { key: "ctaLead", label: "Alt başlık", kind: "textarea" },
      { key: "ctaButtonText", label: "Buton yazısı" },
      { key: "ctaButtonLink", label: "Buton adresi", hint: "Site içi bir adres, örneğin /iletisim" },
    ],
  },
  {
    title: "Alt bilgi",
    description: "Bütün sayfaların altındaki koyu alan.",
    fields: [
      { key: "footerAbout", label: "Tanıtım yazısı", kind: "textarea" },
      { key: "footerCopyright", label: "Telif satırı" },
    ],
  },
];
