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
  salesPhone: "0 532 468 12 47",
  supportPhone: "0 507 679 19 25",
  workingHours: "hafta içi 09.00–18.00 açık",
  email: "info@gotech.com.tr",
  address: "Şehit Nevres Bulvarı\nDeren Plaza No:10 K:1\nAlsancak — İzmir",
  facebook: "",
  instagram: "",
  linkedin: "https://www.linkedin.com/company/gotech",
  twitter: "",
  youtube: "",
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Mikro Yazılım kurulumu, eğitimi ve 7/24 desteği.",
  heroLead:
    "2017'den beri Mikro Yazılım yetkili iş ortağıyız. İzmir ve çevresinde 500'den fazla işletmenin kurulumunu, e-Dönüşümünü ve günlük desteğini biz yürütüyoruz.",
  stat1Value: "15+",
  stat1Label: "Yıl deneyim",
  stat2Value: "500+",
  stat2Label: "Mutlu müşteri",
  stat3Value: "7/24",
  stat3Label: "Teknik destek",
  stat4Value: "%100",
  stat4Label: "Müşteri memnuniyeti",
  ctaTitle: "İşletmenizi büyütmeye hazır mısınız?",
  ctaLead: "Ücretsiz demo ve danışmanlık için hemen iletişime geçin. Size uygun çözümü birlikte belirleyelim.",
  ctaButtonText: "Ücretsiz demo talep edin",
  ctaButtonLink: "/iletisim",
  footerAbout: "Mikro Yazılım İş Ortağı olarak 2017'den beri işletmelere ERP çözümleri sunuyoruz.",
  footerCopyright: "© 2026 GoTech ERP Solutions · Mikro Yazılım İş Ortağı",
};
