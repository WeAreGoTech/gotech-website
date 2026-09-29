// Kurumsal sitenin yönetim panelinden düzenlenen metinleri ve iletişim bilgileri.
// Buradaki değerler varsayılan; panelden kaydedilenler bunların üzerine biniyor (getSiteConfig).
// Ürün, hizmet ve süreç bölümlerinin başlıkları sabit içerik olduğu için kodda duruyor.

export type SiteSettings = {
  slogan: string;
  salesPhone: string;
  supportPhone: string;
  workingHours: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
};

export type SiteContent = {
  heroTitle: string;
  heroLead: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  ctaTitle: string;
  ctaLead: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  footerAbout: string;
  footerCopyright: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  slogan: "Mikro Yazılım İş Ortağı",
  // şirket numarası panelden (Site içeriği > İletişim bilgileri) girilir; boşken telefon satırları hiç görünmez
  salesPhone: "",
  supportPhone: "",
  workingHours: "Hafta içi 09.00–18.00",
  email: "info@gotech.com.tr",
  address: "Şehit Nevres Bulvarı\nDeren Plaza No:10 K:1\nAlsancak — İzmir",
  facebook: "",
  instagram: "",
  linkedin: "https://www.linkedin.com/company/gotech",
  twitter: "",
  youtube: "",
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Mikro Jump ve Mikro Fly'ı işletmenize kuruyoruz.",
  heroLead:
    "Size uygun ürünü birlikte seçiyoruz. Kurulumu, e-Dönüşüm geçişini ve ekibinizin eğitimini yapıyor, program çalışmaya başladıktan sonra desteğini de veriyoruz.",
  // yalnız doğrulanmış bilgi; boş bırakılan rakam sitede hiç görünmez
  stat1Value: "2017",
  stat1Label: "yılından beri Mikro Yazılım yetkili iş ortağı",
  stat2Value: "",
  stat2Label: "",
  stat3Value: "",
  stat3Label: "",
  stat4Value: "",
  stat4Label: "",
  ctaTitle: "Bir görüşme planlayalım",
  ctaLead: "İşinizi dinleyip hangi ürünün size uygun olduğunu söyleyelim. Keşif görüşmesi ve demo için ücret almıyoruz.",
  ctaButtonText: "Ücretsiz demo talep edin",
  ctaButtonLink: "/iletisim",
  footerAbout: "Mikro Jump ve Mikro Fly için kurulum, eğitim ve destek.",
  footerCopyright: "© 2026 GoTech ERP Solutions · Mikro Yazılım İş Ortağı",
};
