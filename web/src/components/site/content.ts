// Landing page copy. Sample projects, contact details and logos are placeholders until real content arrives.

export const NAV_LINKS = [
  { href: "#hizmetler", label: "Çözümler" },
  { href: "#surec", label: "Süreç" },
  { href: "#isler", label: "İşler" },
  { href: "#sss", label: "SSS" },
  { href: "#iletisim", label: "İletişim" },
];

export const SERVICES = [
  {
    id: "hizmet-erp",
    title: "Mikro ERP",
    image: "Görsel alanı: ERP panel ekranı",
    text: "Stok, cari hesap, fatura, sipariş ve personel takibi tek yerde. İhtiyacınız olan modüllerle başlar, işiniz büyüdükçe genişler.",
    includes: ["Stok ve depo", "Cari hesap", "e-Fatura ve e-Arşiv", "Sipariş", "Personel", "Raporlar"],
    audience: "Üretim atölyeleri, toptancılar, çok şubeli mağazalar",
  },
  {
    id: "hizmet-web",
    title: "Web siteleri",
    image: "Görsel alanı: web sitesi örnekleri",
    text: "Kurumsal site, e-ticaret ya da kampanya sayfası. Hızlı açılan, kolay yönetilen ve aramalarda bulunan siteler kuruyoruz. Gelen siparişler doğrudan ERP'nize düşer.",
    includes: ["Kurumsal site", "E-ticaret", "Çok dilli yapı", "Arama motoru uyumu", "İçerik yönetimi"],
    audience: "Yeni kurulan markalar, sitesini yenilemek isteyen firmalar",
  },
  {
    id: "hizmet-panel",
    title: "Yönetim panelleri",
    image: "Görsel alanı: yönetim paneli arayüzü",
    text: "Bayi portalı, randevu sistemi, saha ekibi takibi. Ekibinizin her gün kullandığı iç araçları iş akışınıza göre sıfırdan tasarlıyoruz.",
    includes: ["Rol ve yetki yönetimi", "Bayi ve müşteri portalı", "Mobil uyum", "Bildirimler", "Diğer sistemlerle entegrasyon"],
    audience: "Hazır yazılımın yetmediği, kendine özgü süreci olan ekipler",
  },
];

export const PROCESS_STEPS = [
  { title: "Tanışma", text: "İşinizi, bugün nasıl yürüdüğünü ve nerede zorlandığınızı dinliyoruz.", output: "İhtiyaç notları" },
  { title: "Keşif ve teklif", text: "Hangi modüllerin gerektiğini birlikte netleştiriyor, kapsamı ve takvimi yazılı olarak sunuyoruz.", output: "Kapsam dokümanı ve teklif" },
  { title: "Tasarım", text: "Ekranları gerçek verilerinizle tasarlıyoruz. Siz onaylamadan koda geçmiyoruz.", output: "Tıklanabilir prototip" },
  { title: "Geliştirme", text: "Düzenli aralıklarla çalışan sürümü size gösteriyoruz. Süreci baştan sona görürsünüz.", output: "Test ortamı" },
  { title: "Kurulum ve eğitim", text: "Mevcut verilerinizi aktarıyor, ekibinize kullanımı öğretiyor ve sistemi canlıya alıyoruz.", output: "Canlı sistem ve eğitimli ekip" },
];

export const PROJECTS = [
  { image: "Görsel alanı: proje ekran görüntüleri", sector: "Gıda üretimi", scope: "Mikro ERP ve e-ticaret sitesi", title: "Kahve kavurma atölyesi için sipariş, stok ve fatura sistemi", text: "Web sitesinden gelen siparişler, depo ve muhasebe artık aynı panelde." },
  { image: "Görsel alanı: bayi portalı", sector: "Otomotiv yedek parça", scope: "Yönetim paneli", title: "Toptancı için bayi portalı", text: "Bayiler stok ve fiyatı kendileri görüyor, siparişi panelden veriyor." },
  { image: "Görsel alanı: randevu ekranı", sector: "Sağlık", scope: "Web sitesi ve randevu paneli", title: "Diş kliniği için online randevu sistemi", text: "Siteden alınan randevu doğrudan klinik takvimine düşüyor." },
];

export const COMPARE_ROWS = [
  { topic: "Modüller", packaged: "Herkese aynı menü, kullanmadığınız özelliklerle birlikte gelir.", gotech: "Yalnızca ihtiyacınız olanlar kurulur, gerektikçe eklenir." },
  { topic: "Ekranlar", packaged: "İş akışınızı programa uydurursunuz.", gotech: "Program iş akışınıza göre tasarlanır." },
  { topic: "Web sitesi", packaged: "Ayrı firma, ayrı sistem. Siparişler elle aktarılır.", gotech: "Aynı ekip kurar. Siparişler panele kendiliğinden düşer." },
  { topic: "Verileriniz", packaged: "Başka bir sisteme taşımak zor olabilir.", gotech: "Verileriniz sizindir, istediğiniz zaman dışa aktarılır." },
  { topic: "Destek", packaged: "Genel destek hattı.", gotech: "Sistemi kuran ekiple, müşteri panelinizden destek talebi açarak konuşursunuz." },
];

export const FAQ_ITEMS = [
  { q: "Mikro ERP bizim ölçeğimize uygun mu?", a: "Mikro ERP, büyük kurumsal sistemlerin karmaşıklığı olmadan küçük ve orta ölçekli işletmeler için kurulur. İhtiyacınız olan modülle başlar, büyüdükçe genişletirsiniz." },
  { q: "Excel'deki verilerimizi aktarabilir miyiz?", a: "Evet. Ürün, cari hesap ve stok listelerinizi kurulum sırasında sisteme aktarıyoruz. Kullandığınız eski programdan da veri alabiliyoruz." },
  { q: "e-Fatura ve e-Arşiv ile çalışıyor mu?", a: "Kullandığınız entegratörle bağlantı kuruyoruz. Faturalar sistemin içinden kesilir ve müşterinize gönderilir." },
  { q: "Ne kadar sürer, fiyat nasıl belirlenir?", a: "Süre ve fiyat seçilen modüllere ve entegrasyonlara göre değişir. Keşif görüşmesinden sonra yazılı teklif ve takvim veriyoruz." },
  { q: "Kurulumdan sonra destek veriyor musunuz?", a: "Evet. Müşteri panelinizden destek talebi açarsınız; talebinizi kimin üstlendiğini ve hangi aşamada olduğunu oradan takip edersiniz." },
  { q: "Verilerimiz nerede saklanıyor?", a: "Tercihinize göre bulut sunucuda ya da kendi sunucunuzda. Düzenli yedekleme kurulumun bir parçasıdır." },
];

export const CONTACT_INFO = [
  { label: "E-posta", value: "iletisim@ornek.com", href: "mailto:iletisim@ornek.com" },
  { label: "Telefon", value: "+90 (000) 000 00 00", href: "tel:+900000000000" },
  { label: "Adres", value: "Şehir, ilçe (adres bilgisi)" },
  { label: "Çalışma saatleri", value: "Hafta içi 09.00–18.00" },
];
