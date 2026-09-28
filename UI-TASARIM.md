# GoTech Web — Arayüz Belgesi ve Tasarım Sistemi

Bu belge iki iş yapıyor:

1. **Anlatıyor.** Bugün depoda ne var: hangi sayfa neyi gösteriyor, hangi bileşen nereden çiziliyor, renkler ve ölçüler hangi dosyada tanımlı, hareket ve erişilebilirlik nasıl kurulmuş.
2. **İlerletiyor.** Bugünkü üç ayrı görsel dilin tek bir tasarım sistemine nasıl toplanacağını, bileşenlerin durum durum spesifikasyonunu ve eksik arayüz parçalarını (yükleniyor, hata, bildirim, geri al) somut dosya yollarıyla tanımlıyor. **Tema tek**: beyaz zemin, koyu mürekkep, kırmızı vurgu; koyu tema üretilmiyor (§6.4).

Ölçüler ve renkler koddan birebir alındı; kaynak dosya ve satır her bölümde yazıyor. Tasarım önerileri "İleri tasarım" başlığı altında ayrı duruyor, mevcut durumla karışmıyor.

Kod tabanı: Next.js 16.3.5 + React 19.2.8, CSS framework yok, el yazımı CSS (global dosyalar + CSS modülleri), Drizzle ORM + Postgres/PGlite, GSAP ve Lenis yalnızca yumuşak kaydırma ve hareket için (`web/package.json`).

---

## 1. Ürünün üç katmanı

Tek Next.js uygulaması üç farklı yüzü barındırıyor. Her birinin kendi görsel dili, kendi kabuk bileşeni ve kendi CSS'i var.

| Katman | Rota grubu | Kim görür | Kabuk | Yazı tipi | Ana renk |
| --- | --- | --- | --- | --- | --- |
| Ana sayfa | `src/app/(site)` | Ziyaretçi | `HomeNav` + `HomeFooter` | Figtree | Kırmızı `#E53935` |
| Kurumsal iç sayfalar | `src/app/(kurumsal)` | Ziyaretçi | Aynı kabuk, `kurumsal.css` eklenir | Figtree | Kırmızı `#E53935` |
| Panel (müşteri + ekip) | `src/app/(app)` | Giriş yapan | `AppShell` (`.shell.wise`) | Geologica | Kırmızı `#E53935` + koyu kahve `#2A1614` |

Yazı tipleri kökte tanımlanıyor: `Geologica → --font-geologica` (panel), `Figtree → --font-figtree` (kamuya açık site), ikisi de `display:"swap"` (`src/app/layout.tsx:6-7`). `<html lang="tr">` (`:19`).

### 1.1 Rota haritası

**Kamuya açık**

| Rota | Dosya | Ne var |
| --- | --- | --- |
| `/` | `app/(site)/page.tsx:49` | Slider, iş ortaklığı bandı, referans şeridi, ürün bulucu, hizmetler, yazılım, hakkımızda, SSS, iletişim |
| `/urunler` | `app/(kurumsal)/urunler/page.tsx:16` | Karşılaştırma tablosu + ürün satırları |
| `/urunler/[slug]` | `.../urunler/[slug]/page.tsx:14` | Ürün detayı (yalnız `mikro-jump`, `mikro-fly`) |
| `/hizmetlerimiz` | `.../hizmetlerimiz/page.tsx:14` | Beş soru, her soru bir bölüm |
| `/yazilim-cozumleri` | `.../yazilim-cozumleri/page.tsx:12` | Yazılım işleri dizini + referans |
| `/hakkimizda` | `.../hakkimizda/page.tsx:39` | Hikâye + çalışma biçimi |
| `/iletisim` | `.../iletisim/page.tsx:11` | Yalnız iletişim kartı |
| `/referanslar` | `.../referanslar/page.tsx:16` | **Kapalı**: `const HIDDEN = true` → `notFound()`; sitemap ve menüde de yok |

`(site)` ve `(kurumsal)` ikisi de `export const dynamic = "force-dynamic"` — telefon, adres, hero metni ve rakamlar panelden okunduğu için sayfa build anında dondurulmuyor (`(site)/page.tsx:17`).

**Panel — müşteri** (`app/(app)/panel/layout.tsx:6`, `requireCustomer()`)

`/panel` genel bakış · `/panel/talep` liste · `/panel/talep/yeni` · `/panel/talep/[number]` yazışma · `/panel/projeler` + `/[id]` · `/panel/dokumanlar` · `/panel/uzak-destek` · `/panel/ekip` · `/panel/hesap`

**Panel — ekip** (`app/(app)/yonetim/layout.tsx:7`, `requireStaff()`)

`/yonetim` · `/yonetim/talep` (+`[number]`) · `/yonetim/basvurular` · `/yonetim/musteriler` (+`[id]`, 5 sekme) · `/yonetim/cihazlar` (+`[id]`) · `/yonetim/projeler` (+`[id]`) · `/yonetim/ekip` · `/yonetim/mailler` · `/yonetim/site` · `/yonetim/hesap`

**Kimlik ve dosya uçları**: `/giris`, `/sifremi-unuttum`, `/sifre-belirle?token=`, `/kur/[token]` (GoTech Desk tek seferlik kurulum sayfası), `/dokuman/[id]`, `/dosya/[id]`, `/indir/[platform]`, `/api/*` (Desk uygulamasının HTTP yüzeyi).

### 1.2 İçerik nereden geliyor

Üç katmanlı içerik modeli var; tasarım yaparken hangi metnin düzenlenebilir olduğunu bilmek gerekiyor.

1. **Kod varsayılanları** — `src/components/kurumsal/content.ts`. `SiteSettings`: `slogan, salesPhone, supportPhone, workingHours, email, address, facebook, instagram, linkedin, twitter, youtube`. `SiteContent`: `heroTitle, heroLead, stat1..4Value/Label, ctaTitle, ctaLead, ctaButtonText, ctaButtonLink, footerAbout, footerCopyright`. Telefonlar bilerek boş: boşsa o satır arayüzden tamamen kalkıyor (`content.ts:40`). Rakamlardan yalnız `stat1` dolu ("2017").
2. **Veritabanı üstyazımı** — `site_texts` tablosu (`db/schema.ts:337`), `key`/`value`/`updated_at`. İstek başına bir kez `getSiteConfig` ile okunup varsayılanların üstüne bindiriliyor (`features/site-content/queries.ts:152`); bilinmeyen anahtarlar yok sayılıyor. Yazma yalnız ekip hesabıyla, anahtar başına 2000 karakter sınırı (`features/site-content/actions.ts`). Düzenleme ekranının bölümleri `features/site-content/labels.ts:51-127`: `iletisim`, `sosyal`, `giris`, `rakamlar` (`layout:"pairs"`), `kapanis`, `alt-bilgi`.
3. **Sabit içerik modülleri** — panelden düzenlenemez: `urunler-data.ts` (`PRODUCTS`, `EDONUSUM_DOCS` 8 belge, `PROCESS_STEPS` 6 adım), `karsilastirma.ts` (5 grup karşılaştırma matrisi), `urun-detay.ts` (Jump ve Fly detay sayfası içerikleri), `kurulum.ts`, `referanslar.ts` (tek referans: ASELSAN), `home/home-content.ts`, `home/finder.ts`, `hizmetler/content.ts`, `yazilim/content.ts`.

İletişim formundaki konu değerleri `features/leads/labels.ts:3-11`'de: `bilgi, demo, gecis, teklif, destek, ortaklik, diger`. Sayfa içindeki "demo isteyin" düğmeleri bu değerleri `data-konu` özniteliğiyle taşıyor.

---

## 2. Ana sayfa anatomisi

Tasarım kaynağı `mockups/pro/anasayfa.html` ("Rehber" yönü, 23.09.2026'da seçildi). CSS modülleri bu yönü koda çeviriyor. Dosya başlarındaki yorumlar tasarım kararlarını ve yasakları da yazıyor: uydurma Mikro ekranı yok, uydurma referans yok, gradient yok, geniş bulanık gölge yok, noktalı hap etiket yok, el çizimi vurgu yok — "AI işi" görünmemesi için (`home.module.css:1-6`). Gri zeminler 25.09.2026'da kaldırıldı; bölümler artık beyaz, aralarını ince çizgi ayırıyor (`home.module.css:47-48`).

Bölüm sırası (`app/(site)/page.tsx:52-83`):

| # | Bölüm | Bileşen | CSS | Kalıp |
| --- | --- | --- | --- | --- |
| 0 | Üst duyuru bandı | `Notice.tsx:29` | `home.module.css:75-82` | Koyu zemin, V16 desteğinin bitişine kalan gün, kapatılabilir |
| 1 | Üst menü | `HomeNav.tsx:18` | `home.module.css:85-100` | Yapışkan, 40px kaydırınca `.stuck` ince çizgi; 1100px altı hamburger |
| 2 | Hero slider | `HeroSlider.tsx:40` | `slider.module.css` | Solda başlık/metin/butonlar, sağda 4:3 görsel; altta slayt adlarıyla sekme çubuğu, etkin sekmenin çizgisi 7 sn'de dolar |
| 3 | İş ortaklığı + rakamlar | `Hero.tsx:39` | `home.module.css:104-112` | Mikro logosu 156px + iki Silver rozet + panelden gelen rakamlar; zemin **tam beyaz** (logo kuralı) |
| 4 | Referans şeridi | `Hero.tsx:23` | `home.module.css:115-119` | Sabit logo satırı, kaymıyor |
| 5 | Ürün bulucu | `ProductFinder.tsx:58` | `finder.module.css` | Cümle içi seçimler + dört ürünlük yatay raf |
| 6 | Hizmetler | `ServiceExplorer.tsx:20` | `services.module.css` | Solda liste, sağda seçilen hizmetin fotoğrafı (SAP/Siemens kalıbı) |
| 7 | Yazılım | `CompanySections.tsx:16` | `sections.module.css:49-53` + `software.module.css` | Başlık + referans logosu, altta iki iş türü kartı |
| 8 | Hakkımızda | `CompanySections.tsx:41` | `sections.module.css:57-67` | Solda 4:5 şehir fotoğrafı, sağda hikâye + üç bilgi + adres |
| 9 | SSS | `CompanySections.tsx:77` | `sections.module.css:70-85` | Yerel `<details>`, JS gerekmez |
| 10 | İletişim | `ContactSection.tsx:27` | `contact.module.css:5-41` | Kırmızı kart: solda bilgiler, sağda beyaz form kutusu |
| 11 | Alt bilgi | `ContactSection.tsx:60` | `contact.module.css:44-55` | Marka + Sayfalar + Ürünler + "Bu sayfada" + İletişim |

### 2.1 Öne çıkan üç etkileşim

**Hero slider** (`HeroSlider.tsx`). Tam tablist/tabpanel kalıbı: `aria-roledescription="carousel"`, her panel `role="tabpanel"` ve kapalıyken `inert`, gezinen `tabIndex`, Ok/Home/End tuşları, 40px eşikle kaydırma (swipe). Otomatik geçiş CSS animasyonunun bitişiyle tetikleniyor (`--dur` = 7000ms); fareyle üstüne gelince, odak girince, bölüm ekrandan çıkınca ve sekme arka plana düşünce duruyor. `prefers-reduced-motion` açıkken otomatik geçiş kapalı başlıyor ve kullanıcı isterse düğmeyle açıyor.

**Ürün bulucu** (`ProductFinder.tsx` + `finder.ts`). "Biz [5–50 kişilik bir işletmeyiz], [üretim yapmıyoruz], [tek şirketiz] ve [programı ofiste kullanacağız]." cümlesindeki dört seçim, `recommend()` kural motorunu besliyor; uygun ürün raftaki kartını `flex-grow:2.6` ile açıyor. Açılan kartın içeriği sabit genişlikte hesaplanıyor (`width:calc((100cqw - 36px) * 2.6 / 5.6)`) — açılırken metin yeniden akmıyor (`finder.module.css:62`). Kart özellikleri karşılaştırma matrisinden türetiliyor (`finder.ts:64`), elle yazılmıyor. Gerekçe `aria-live="polite"` ile duyuruluyor. 900px altında raf dikey akordeona dönüyor ve önerilen kart 350 ms sonra görünüre kaydırılıyor.

**Hizmet gezgini** (`ServiceExplorer.tsx`). Solda beş hizmet; seçilen maddenin sol rayı kırmızıya dönüyor, gövdesi `grid-template-rows:0fr → 1fr` ile açılıyor, sağdaki 4:3 fotoğraf çapraz geçişle değişiyor. Fotoğraf kolonu `aria-hidden`; dar ekranda fotoğraf maddenin içine iniyor. Adres çubuğundaki `#edonusum` / `#destek` ilgili sekmeyi açıyor, `hashchange` dinleniyor.

### 2.2 İç sayfaların kendi kalıpları

- `/hizmetlerimiz` — sayfa müşterinin beş sorusuyla kurulu. Girişte soru dizini (`.qlist`, üzerine gelince sola 16px kayıyor, ok 90° dönüyor), sonra her soru bir bölüm. Kurulum bölümü yatay açılan paneller (`StepPanels.tsx`, `flex-grow:4.2`), e-Dönüşüm bölümü büyük puntolu belge dizini (`.docs b` 1.7→3rem), eğitim bölümü fotoğraf + iki satır, destek bölümü üç kanal kartı (`hizmetler.module.css`).
- `/yazilim-cozumleri` — yapışkan sol başlık + iki gruplu numaralı iş listesi, altta referans satırı (`yazilim.module.css`).
- `/urunler` — karşılaştırma tablosu (`CompareTable`): `.cmp-pick` segment kontrolü `aria-pressed` ile, tablo sarmalayıcı `role="region" tabIndex={0}` (klavyeyle yatay kaydırma), var/yok hücreleri `role="img" aria-label="Var"/"Yok"`. 760px altında sütunlar `display:none` ile gizleniyor.
- `/urunler/[slug]` — `ProductDetailView` sırası: hero → genel bakış → kime uygun → paket listesi → kurulum → sürümler → fark → bir bakışta → ek çözümler → SSS.
- `/hakkimizda` — hikâye + `WAYS` dizisinden üç çalışma ilkesi kartı.

---

## 3. Panel anatomisi

Panelin görsel dili Wise'dan alınmış (dosya başlığı bunu yazıyor): hap butonlar, ağır başlıklar, yumuşak yüzeyler, yuvarlak ikon kutuları. Marka rengi Wise yeşilinden GoTech kırmızısına çevrilmiş (`phase-04` commit'i). Bu yüzden değişkenler `--w-*` önekli.

### 3.1 Kabuk

`AppShell` (`components/app/AppShell.tsx:11`) → `div.shell.wise` içinde `272px | 1fr` ızgara. Sol kolon beyaz, yapışkan, tam yükseklik `aside.sidebar`: marka bloğu (logo + alan adı), opsiyonel hap CTA, `SideNavLinks`, en altta `.side-user` (avatar + ad + çıkış düğmesi). Sağ kolon `main.main`, `max-width:1240px`, `padding:36px clamp(16px,4vw,56px) 80px`.

Etkin bağlantı **en uzun eşleşen ön ek** ile seçiliyor, böylece `/panel/talep/yeni` `/panel`'i yenmiyor (`SideNavLinks.tsx:9,14`) ve `aria-current="page"` yazılıyor.

Menü öğeleri:

- Müşteri: Genel bakış, Destek talepleri, Projeler, Dokümanlar, Uzak Destek, Ekibim, Hesabım. CTA: "Yeni talep".
- Ekip: Genel bakış, Destek talepleri (açık talep sayacı), Başvurular (yeni başvuru sayacı), Müşteriler, Cihazlar, Projeler, Ekip, Giden mailler, Site içeriği, Hesabım. CTA yok.

Duyarlılık (`app.css:169-207`): 1180–901px arası kenar çubuğu 232px'e iniyor. 900px altında tek kolona düşüyor; üstte yapışkan, bulanık `.mobile-bar` (`backdrop-filter:saturate(1.4) blur(10px)`), kenar çubuğu `position:fixed`, `width:min(320px,86vw)`, `height:100dvh`, `translateX(-105%)` ile gizli; açılınca `html.is-drawer-open{overflow:hidden}`. Çekmece Escape ile kapanıyor, `aria-controls`/`aria-expanded` bağlı, örtü tıklanınca kapanıyor (`ShellFrame.tsx`).

### 3.2 Panelin bileşen envanteri

Panelde **hiç `<table>` yok**; her şey liste satırı (`.w-list > .w-row`). Bu, mobilde tablo kırılmasını baştan çözüyor.

| Grup | Bileşenler |
| --- | --- |
| Listeler | `TicketList`, `ActivityFeed`, `DocumentList`, `DeviceList`, `ConnectionList`, `SessionList`, `TeamDeviceList`, `StaffDeviceList`, `PeopleList`, `RemovedPeopleList`, `CompanyList` (istemci tarafı arama), `Conversation`, `ProjectUpdates`, `MilestoneTimeline`, `MessageAttachments` |
| Kartlar | `.card` (24px yarıçap, beyaz), `.stat` / `.stat.is-hero` (koyu kahve zemin), `.project-card`, `.desk-code` (koyu kahve, büyük müşteri numarası) |
| Durum | `StatusPill` (`.status.is-open|is-in_progress|is-waiting_customer|is-closed`, nokta rengi `--dot` değişkeninden), `PriorityText`, `StagePill`, `.badge` varyantları (`is-mock`, `is-failed`, `is-smtp`, `is-active`, `is-admin`, `is-note`, `is-alert`), `.desk-dot` (çevrimiçi/çevrimdışı/bilinmiyor) |
| Adım göstergeleri | `.hstepper` (talep durumu, yatay), `.tracker` (dikey zaman çizelgesi), `.stagebar` (proje aşaması, tıklanabilir) |
| Formlar | `FieldShell`, `TextField`, `TextAreaField`, `SelectField`, `DateField`, `FormMessage`; `Select` (tam combobox: yazarak arama, yukarı/sola açılma, gizli input), `DatePicker` (pazartesi başlangıçlı 42 hücre) |
| Katmanlar | `Modal` (yerel `<dialog>`, çocuklar yalnız açıkken mount ediliyor), `ModalButton` (`button` / `small` / `action` görünümleri + `accent`, `danger`) |
| Boş durumlar | `EmptyState` (kart), `li.empty-row` (satır içi) |
| Yazışma | `.bubble-row` / `.is-mine` (baloncuk), `.inote` (ekip içi not, sarı), `.composer` (not modunda arka plan sarıya dönüyor: `.composer:has(input[value="note"]:checked)`) |

Bekleme durumu her gönderimde var: `disabled={pending}` + etiket değişimi ("Kaydediliyor…", "Gönderiliyor…"), `.btn:disabled{opacity:.6;cursor:progress}`.

---

## 4. Mevcut tasarım sistemi (koddan birebir)

Bugün **üç ayrı token seti** var ve bunlar birbirinin yerine geçmiyor; yalnızca `components/forms/select.css` ikisini `var(--w-x, var(--x))` geri düşüşleriyle köprülüyor.

### 4.1 Katman A — `globals.css :root` (eski iniş sayfasından kalan)

```css
--ground:#E4E8EE;   --paper:#FFFFFF;
--ink:#131A33;      --ink-soft:rgba(19,26,51,.62);
--line:rgba(19,26,51,.12);
--cobalt:#2F45FF;   --cobalt-deep:#1A2690;   --signal:#FFCF3D;
--ok-bg:#E6F6EC;    --ok-ink:#16703C;
--warn-bg:#FFF3D6;  --warn-ink:#8A5A00;
--error:#B42A18;    --error-bg:#FFF6F4;
--field-bg:#F3F5F8;
--font:var(--font-geologica), system-ui, sans-serif;
--gutter:clamp(16px, 5vw, 80px);
--radius:20px;      --radius-lg:28px;
--ease-out:cubic-bezier(.16,.84,.24,1);
```

Gövde: `background:var(--ground); font-weight:350; font-size:17px; line-height:1.55` (`globals.css:27`). Kobalt mavi ve `--signal` sarı **hiçbir yerde markaya ait değil** — fazla 04'te panel kırmızıya çevrildi, ama bu katman temizlenmedi. Panelin odak halkası `--cobalt`, `.wise` içinde koyu kahveyle eziliyor (`app.css:26`).

### 4.2 Katman B — `.home` (kamuya açık sitenin gerçek seti)

```css
--paper:#fff;
--ground:#F4F5F7;   --ground-2:#E6E8EC;
--ink:#16181D;
--ink-2:rgba(22,24,29,.68);   /* gövde grisi */
--ink-3:rgba(22,24,29,.6);    /* .6: beyaz üstünde AA ~4.6:1 */
--line:rgba(22,24,29,.12);
--brand:#E53935;
--brand-deep:#C0261F;   /* beyaz yazı bunun üstünde ~5.9:1 */
--brand-press:#A51F19;
--brand-soft:rgba(229,57,53,.08);
--gx:clamp(20px,5vw,72px);    /* yan boşluk */
--maxw:1240px;
--sec:clamp(80px,11vh,136px); /* bölüm ritmi */
--r:10px;   --r-lg:14px;
--ease:cubic-bezier(.22,.61,.36,1);
--soft:cubic-bezier(.22,1,.36,1);
--shadow:0 1px 2px rgba(22,24,29,.06);
```

`font-weight:400; font-size:1.04rem; line-height:1.6; interpolate-size:allow-keywords` (`home.module.css:32-37`). `.site` (iç sayfalar) bu setin üstüne tek token ekliyor: `--line-2:rgba(22,24,29,.06)` (`kurumsal.css:11`).

Tipografi ölçeği:

| Öğe | Değer | Kaynak |
| --- | --- | --- |
| h1 | `700`, `clamp(2.4rem,4.2vw,3.7rem)`, `1.1`, `-.02em`, `text-wrap:balance` | `home.module.css:52` |
| h2 | `700`, `clamp(1.85rem,3vw,2.6rem)`, `1.15`, `-.015em` | `:53` |
| h3 | `600`, `1.14rem`, `1.3` | `:54` |
| `.lede` | `clamp(1.05rem,1.2vw,1.16rem)`, `1.6`, `--ink-2`, `max-width:48ch` | `:55` |
| `.eyebrow` | `.9rem`, `600`, `--brand-deep` | `:56` |
| Slider başlığı | `clamp(2.05rem,3.3vw,3rem)`, `max-width:17ch` | `slider.module.css:17` |
| Bulucu cümlesi | `clamp(1.4rem,2.4vw,2.15rem)`, `500`, `line-height:1.8` | `finder.module.css:4` |
| Belge dizini | `700`, `clamp(1.7rem,3.6vw,3rem)`, `-.03em` | `hizmetler.module.css:66` |

Satır uzunluğu sınırları elle ve tutarlı: `48ch` (lede), `44ch` (hero lede), `66ch` (SSS gövdesi), `62ch`, `50ch`, `46ch`, `42ch`, `40ch`, `34ch` (alt bilgi), `32ch` (rakam etiketi), başlıklarda `14ch`–`20ch`.

Yüzey dili: **beyaz + 1px iç gölge çizgi**, bulanık gölge yok. `box-shadow:inset 0 0 0 1px var(--line)` deseni her kartta tekrar ediyor. Tüm sitede tek damla gölge `.pd-badge` (`0 1px 2px rgba(22,24,29,.12)`), iki bulanık gölge de yalnız açılır listelerde.

### 4.3 Katman C — `.wise` (panel)

```css
--w-accent:#E53935;        --w-accent-hover:#CC3A30;
--w-on-accent:#FFFFFF;     --w-accent-soft:#FF9D94;
--w-forest:#2A1614;        /* koyu marka yüzeyi */
--w-ink:#0E0F0C;   --w-ink-2:#454745;   --w-ink-3:#6A6C6A;
--w-line:rgba(14,15,12,.1);   --w-border:#C9CBC6;
--w-page:#F6F2F1;
--w-neutral:rgba(226,70,59,.09);   --w-neutral-hover:rgba(226,70,59,.16);
--w-positive-bg:#E2F6D5;   --w-positive:#2F5711;
--w-warning-bg:#FFF1C2;    --w-warning:#5C4A00;
--w-negative-bg:#FDE6E2;   --w-negative:#A8200D;
```

Panelin yüzey dili siteden farklı: **kenarlık yok, büyük yarıçap var** — `.card{border-radius:24px}`, `.w-list{border-radius:24px}`, `.stat{border-radius:24px}`, `.stagebar{20px}`, `.bubble{22px 22px 22px 6px}`. Başlıklar daha ağır ve daha sıkı: `.page-head h1{font-weight:800; clamp(2rem,3.4vw,3rem); letter-spacing:-.05em}`.

### 4.4 Buton: dört ayrı tanım

Aynı `.btn` adı dört yerde yeniden tanımlanıyor:

| Yer | Yarıçap | Zemin | Ağırlık |
| --- | --- | --- | --- |
| `globals.css:38` | `999px` | `--cobalt` | 500 |
| `home.module.css:61` | `8px` | `--brand-deep` | 600 |
| `kurumsal.css:31-40` | `8px` | `--brand-deep` | 600 (+ panel davranışını iptal eden `letter-spacing:0` ve `:active{transform:none}`) |
| `contact.module.css:32` | `8px` | `--brand-deep` | 600 (kırmızı kartın içindeki kopya) |
| `app.css:30` | `999px` (globalden) | `--w-accent` | 600, `min-height:48px` |

### 4.5 Kırılma noktaları

Paylaşılan değişken yok, hepsi düz sayı: `1180`, `1101` (min-width), `1100`, `1000`, `900`, `860`, `820`, `800`, `760`, `700`, `600`, `560`, `420`, `400`. Aynı işi yapan eşikler farklı dosyalarda farklı: nav 1100'de, panel çekmecesi 900'de, karşılaştırma tablosu 760'ta, form ızgarası 600'de.

### 4.6 İkonografi

- Site: satır içi `data:` URI SVG onay işareti altı dosyada tekrar ediyor (`stroke='%23C0261F'`; bulucuda `%23E53935` varyantı). Yok işaretleri: artı, tire, soluk tire.
- Panel: `Icon.tsx` tek bir ikon kümesi, hepsi `aria-hidden="true"`, `w-icon` yuvarlak kutu içinde.
- Marka: `Logo.tsx` içinde satır içi React SVG (`GoTechLogo`, `GoTechLogoHeader`, `GoTechLogoWhite`, `MikroLogo`), renkler dosyada sabit: `RED="#E53935"`, `GREY="#5C5C5C"`, `LIGHT_GREY="#9E9E9E"`, `SUBTLE_GREY="#B0B0B0"`, sözcük markası fontu `'Segoe UI'` ailesi.
- Mikro logosu kuralı: yalnız **tam beyaz** zeminde ve **156px** genişlikte (PNG tuvali 268×170, mürekkep 211×111; kılavuzun 120px alt sınırı 152px'te tutuyor). Kural üç dosyada yorumla korunuyor.
- Partner rozetleri: `jumper-silver.png`, `flyer-silver.png`, `height:62px` (400px altında 52px).

### 4.7 Hareket

- **Göründüğünde gel**: `[data-in]` öğeleri `opacity:0; translateY(18px)` başlıyor; `HomeEffects` IntersectionObserver ile `data-in="on"` yazıyor, 70 ms kademeli. JS gelmezse 2.6 saniyede kendiliğinden görünen bir emniyet animasyonu var (`home.module.css:122-128`) — bu ayrıntı önemli: hareket kapalıysa ya da JS düşerse içerik kaybolmuyor.
- **Kaydırmaya bağlı**: hizmet yol haritasının dikey rayı `animation-timeline:view()` ile doluyor, `@supports` ve `no-preference` içinde (`sections.module.css:11-16`).
- **Yerel `<details>` yüksekliği**: `::details-content{block-size:0 → auto}` + `interpolate-size:allow-keywords`.
- **Yumuşak kaydırma**: Lenis `lerp:0.085`; `prefers-reduced-motion` açıkken hiç kurulmuyor. `#` bağlantıları nav yüksekliği + 24px payla hizalanıyor ve hedefe odak taşınıyor (`SmoothScroll.tsx`).
- **Küresel kapatma**: `prefers-reduced-motion:reduce` altında `transition-duration:.01ms; animation:none` (`globals.css:73-75`). JS tarafı da uyuyor: slider otomatik geçişi kapalı başlıyor, bulucu `behavior:"auto"` kullanıyor.

### 4.8 Erişilebilirlik — bugün ne var

Bu kod tabanı erişilebilirlik konusunda beklenenin üstünde. Var olanlar:

- İki kabukta da atlama bağlantısı; `aria-current="page"` menüde, sekmelerde, firma sekmelerinde; `aria-current="step"` iki adım göstergesinde.
- Kapalı panellerde `inert` (slider, hizmet gezgini, raf kartı).
- Slider tam sekme kalıbı + duraklatma düğmesi + odak/hover/ekran dışı/sekme gizli durumlarında durma (WAI'nin `auto-rotation-controls` kuralı karşılanıyor).
- `Select` gerçek combobox: `role="combobox"`, `aria-activedescendant`, Ok/Home/End/Enter/Space/Escape/Tab + yazarak arama. `DatePicker` `role="dialog"` + `role="grid"`, gün başına `aria-label`.
- `FieldShell` `htmlFor`/`id`, `aria-invalid`, `aria-describedby` zincirini kuruyor; `FormMessage` hata için `role="alert"`, başarı için `role="status"`.
- İletişim formu: `noValidate`, hata her alanın etiketinin içinde, ilk hataya odak taşıma, gönderimde `aria-disabled` (odağı kaybetmemek için `disabled` değil), başarı ekranı `role="status"`, bal küpü alanı `website`.
- Kontrast bilerek hesaplanmış ve yoruma yazılmış: `--ink-3` `.6` opaklıkta AA ~4.6:1; beyaz yazı `--brand-deep` üstünde ~5.9:1, `--brand` üstünde 4.2:1 (bu yüzden dolgulu butonlar `--brand-deep` kullanıyor).
- Tablo yerine liste satırı tercihi; var/yok hücrelerinde `role="img" aria-label`.

---

## 5. Teşhis: bugünün açıkları

Sıra, düzeltmenin değer/maliyet oranına göre.

**T1 — Üç token seti, tek marka.** `globals.css` kobalt mavi ve Geologica'yı taşıyor, `.home` kırmızı ve Figtree'yi, `.wise` kırmızı + koyu kahveyi. Kobalt seti rastgele değil: `globals.css:1-22`, `mockups/landing/css/base.css:1-22`'nin birebir kopyası — yani seçilmeyen bir iniş sayfası tasarımının token seti, panelin taban katmanı olarak kalmış (ayrıntı: Ek B). Aynı `.btn`, `.input`, `.field`, `.notice`, `.badge` adları farklı dosyalarda farklı anlamlara geliyor; `kurumsal.css` panelden sızan davranışı elle iptal etmek zorunda kalıyor (`:35-36`). Yeni bir bileşen yazan kişi hangi katmanda olduğunu bilmeden doğru sonucu alamıyor.

**T2 — `color-scheme` bildirimi yok.** Ürün kararı **tek tema**: site ve panel tek renk tabanında (beyaz zemin, koyu mürekkep) kalır, koyu tema üretilmez, siyah zeminli bölüm yapılmaz. Eksik olan şey koyu tema değil, bu kararın tarayıcıya bildirilmemesi: hiçbir dosyada `color-scheme` yok, bu yüzden işletim sistemi koyu temadayken yerel form denetimleri, tarih seçici ve kaydırma çubukları koyu geliyor, sayfa açık kalıyor — ikisi yan yana yanlış görünüyor. Çözüm tek satır: `color-scheme: light`. `public/brand/gotech-logo-dark.svg` bu kararla birlikte gereksiz (T6'daki silme listesine girer).

**T3 — `loading.tsx` / `error.tsx` yok.** `app/` ağacında tek sınır dosyası `not-found.tsx`. Panelin her sayfası 1–7 arası `await` sorgusu yapan sunucu bileşeni (`yonetim/musteriler/[id]` 7 sorgu); Suspense sınırı, iskelet ekran ve rota düzeyinde hata kurtarma yok. `requireCustomer()` içindeki `throw new Error("Customer … has no company")` biçimlenmiş bir yere düşmüyor.

**T4 — 404 sayfası panel dilinde.** `not-found.tsx` `div.auth.wise` kullanıyor; siteden 404'e düşen ziyaretçi bir anda başka bir üründe gibi görünüyor.

**T5 — Bildirim (toast) ve geri al yok.** Auto-submit eden `LeadStatusForm` kaydettiğini hiçbir şekilde söylemiyor; ekran okuyucuya hiç duyuru gitmiyor. Silme işlemlerinde geri al yok (geri alma yalnız kişi çıkarma akışında, ayrı form olarak var).

**T6 — Ölü kod ve kullanılmayan varlıklar.** İçe alınmayan bileşenler: `kurumsal/Hero.tsx`, `kurumsal/SiteHeader.tsx`, `kurumsal/Footer.tsx`, `kurumsal/Sections.tsx`; kullanılmayan dışa aktarımlar: `home/ServiceSections.tsx`'teki `ServiceJourney` + `EDonusum`, `home/SupportSections.tsx`'teki `Support`, `urunler-data.ts`'teki `SERVICES`/`EXTRA_SOLUTIONS`/`FAQ`/`CATEGORIES`. Tanımsız sınıflar kullanılıyor: `PageHeader` `className="d2"` yazıyor, `d2` hiçbir stil dosyasında yok (`d1` de yok, yalnız `d3` var). Kullanılmayan görseller: `images/mikro/musavir.png`, `run.png`, `stok/kod-inceleme.webp`, `kod-laptop.webp`, beş eski JPG (`analiz.jpg`, `depo.jpg`, `egitim.jpg`, `ofis.jpg`, `rapor.jpg`), `brand/*.svg`. Ayrıca `features/customers/actions.ts.bak` depoda duruyor.

**T7 — Şemada olup arayüzü olmayan alan.** `invoices` ve `invoice_lines` tabloları tanımlı ama hiçbir sorgu, rota veya menü öğesi okumuyor (fatura ekranları fazla 03'te kaldırılmıştı). Karar gerek: ya şemadan düşür ya arayüzünü geri getir.

**T8 — Küçük etkileşim boşlukları.** `StepPanels` yalnız `onMouseEnter`/`focus`/`click` ile açılıyor ve kapalı panel `inert` değil, `visibility:hidden`. `RatingForm` `role="radiogroup"` ama ok tuşlarıyla gezilemiyor. `StageBar` projeyi geriye almayı onaysız yapıyor. `PriorityText` "normal" için `null` döndürdüğü için normal önceliği hiçbir yerde yazılı olarak görmüyorsunuz. `desk-dot` çevrimiçi/çevrimdışı ayrımını yalnız renkle veriyor (bilinmiyor durumunda `?` var). KVKK onay kutusu hiçbir belgeye bağlanmıyor (`ContactForm.tsx:90` `TODO(GoTech)`).

**T9 — Panelde atlama bağlantısı yok.** `.skip` sınıfı `globals.css`'te var ama `(app)` kullanmıyor; `main` öğesinin `id`'si de yok.

**T10 — Kırılma noktaları dağınık.** On dört farklı eşik; aynı amaç için farklı sayılar. Tek bir ölçek yok.

---

## 6. İleri tasarım — token mimarisi

Hedef: tek kaynak, üç katman (ilkel → anlamsal → bileşen), iki tema (açık/koyu), sıfır görsel regresyon. Markanın bugünkü karakteri (beyaz zemin, ince çizgi, kırmızı vurgu, gölgesizlik) korunuyor; yalnızca isimlendirme ve kapsam düzeliyor.

### 6.1 Yerleşim

Yeni dosya: `web/src/app/tokens.css`, `globals.css`'ten **önce** içe alınıyor (`app/layout.tsx`). İçinde yalnız değişken tanımı var, hiç kural yok.

```
tokens.css      ilkel + anlamsal + ölçek (tek tema)
globals.css     yeniden kurulum (reset), taban öğe stilleri, yardımcı sınıflar — renk sabiti yok
site.css        kamuya açık sitenin bileşen katmanı (.home ve .site birleşir)
app.css         panelin bileşen katmanı (.wise adı gt-app'e döner)
```

### 6.2 İlkel katman (ham değerler, bileşende doğrudan kullanılmaz)

```css
:root{
  /* marka rampası — #E53935 çekirdeğinden türetildi */
  --red-50:#FFF1F0;  --red-100:#FFE0DE;  --red-200:#FFC2BE;
  --red-300:#FF9D94;  --red-400:#FF6B62;  --red-500:#E53935;
  --red-600:#C0261F;  --red-700:#A51F19;  --red-800:#7A1712;  --red-900:#3D0C09;
  /* nötr rampa — sitenin #16181D mürekkebinden türetildi */
  --gray-0:#FFFFFF;  --gray-25:#FAFAFB;  --gray-50:#F4F5F7;  --gray-100:#E6E8EC;
  --gray-200:#D2D5DA;  --gray-300:#B4B8BF;  --gray-400:#8A8F98;
  --gray-500:#6A6F78;  --gray-600:#4A4E56;  --gray-700:#31353B;
  --gray-800:#1F2227;  --gray-900:#16181D;
  /* koyu vurgu yüzeyi (panelden gelen kahve) — yalnız küçük bloklarda, tam bölüm zemini olarak değil */
  --clay-800:#2A1614;
  /* durum renkleri */
  --green-100:#E2F6D5; --green-700:#2F5711;
  --amber-100:#FFF1C2; --amber-700:#5C4A00;
  --blue-100:#E3ECFF;  --blue-700:#1B4699;
}
```

Not: `--red-500` üstünde beyaz yazı 4.2:1'de kalıyor; bu yüzden **dolgulu butonların ve kırmızı zeminlerin varsayılanı `--red-600`**. Bu kural bugünkü kodda da geçerli, artık tokende yazılı.

### 6.3 Anlamsal katman (bileşenlerin kullandığı tek isim kümesi)

```css
:root{
  color-scheme: light;   /* tek tema: OS koyu temada da açık kal (T2) */

  /* yüzeyler */
  --gt-bg:var(--gray-0);              /* sayfa */
  --gt-surface:var(--gray-0);         /* kart */
  --gt-surface-2:var(--gray-50);      /* ikincil yüzey, alan zemini */
  --gt-surface-inverse:var(--clay-800);
  --gt-scrim:rgba(22,24,29,.42);      /* modal örtüsü */

  /* mürekkep */
  --gt-ink:var(--gray-900);
  --gt-ink-2:rgba(22,24,29,.68);
  --gt-ink-3:rgba(22,24,29,.60);
  --gt-ink-inverse:var(--gray-0);
  --gt-ink-on-brand:var(--gray-0);

  /* çizgi */
  --gt-line:rgba(22,24,29,.12);
  --gt-line-2:rgba(22,24,29,.06);
  --gt-line-strong:rgba(22,24,29,.28);

  /* marka */
  --gt-brand:var(--red-500);          /* vurgu, ray, odak */
  --gt-brand-fill:var(--red-600);     /* dolgulu yüzey (AA) */
  --gt-brand-press:var(--red-700);
  --gt-brand-ink:var(--red-600);      /* beyaz üstünde kırmızı yazı */
  --gt-brand-wash:rgba(229,57,53,.08);

  /* durum */
  --gt-ok-bg:var(--green-100);   --gt-ok-ink:var(--green-700);
  --gt-warn-bg:var(--amber-100); --gt-warn-ink:var(--amber-700);
  --gt-danger-bg:#FDE6E2;        --gt-danger-ink:#A8200D;
  --gt-info-bg:var(--blue-100);  --gt-info-ink:var(--blue-700);

  /* form */
  --gt-field-bg:var(--gray-0);
  --gt-field-line:var(--gray-200);
  --gt-field-line-hover:var(--gray-400);
  --gt-field-line-focus:var(--gt-brand);
}
```

### 6.4 Tek tema kararı

**Koyu tema yapılmıyor.** Ürün tek renk tabanında kalıyor: beyaz zemin, koyu mürekkep, kırmızı vurgu. Siyah zeminli bölüm, koyu hero, tam ekran koyu sahne üretilmiyor — bu karar mockup aşamasında da verilmişti (`rehber.css:5-6` "tam ekran koyu sahne yok") ve ürünün bugünkü karakteri buna dayanıyor.

Kararın üç sonucu:

1. **`color-scheme: light` bildirimi zorunlu.** Bildirim olmadan işletim sistemi koyu temadayken yerel form denetimleri, tarih seçici ve kaydırma çubukları koyu geliyor, sayfanın kendisi açık kalıyor. Tek satır bunu kapatıyor (T2).
2. **`prefers-color-scheme` bloğu hiç yazılmıyor.** Token dosyasında ikinci bir palet yok; bir bileşen "koyuda ne olacak" sorusunu sormuyor. Bakım maliyeti sıfır, kontrast denetimi tek palet üzerinde yapılıyor.
3. **Koyu yüzey bir vurgu aracı, tema değil.** `--gt-surface-inverse` (`#2A1614`) yalnız küçük bloklarda kullanılıyor: panelin öne çıkan istatistik kutusu, müşteri numarası kartı, etkin sekme hapı, duyuru bandı. Tam sayfa ya da tam bölüm zemini olmuyor. Bu kullanım bugün de böyle; token adı kuralı sabitliyor.

Mikro logosu kuralı bu kararla birlikte kendiliğinden korunuyor (zemin her yerde beyaz); `.gt-brandsafe` sınıfı yine de duruyor, çünkü logoyu yanlışlıkla koyu bir vurgu bloğunun içine koymayı engelliyor. `public/brand/gotech-logo-dark.svg` artık gereksiz — silme listesinde (T6).

### 6.5 Ölçek tokenleri

```css
:root{
  /* boşluk — 4px tabanlı */
  --sp-1:4px;  --sp-2:8px;   --sp-3:12px;  --sp-4:16px;  --sp-5:20px;
  --sp-6:24px; --sp-8:32px;  --sp-10:40px; --sp-12:48px; --sp-16:64px; --sp-20:80px;

  /* bölüm ritmi ve kapsayıcı */
  --gt-gutter:clamp(20px,5vw,72px);
  --gt-maxw:1240px;        --gt-maxw-narrow:820px;
  --gt-section:clamp(80px,11vh,136px);

  /* yarıçap */
  --r-xs:6px;  --r-sm:8px;  --r-md:10px;  --r-lg:14px;  --r-xl:20px;  --r-2xl:24px;  --r-pill:999px;

  /* yükseklik (elevation) — üç kademe, fazlası yok */
  --el-0:none;
  --el-1:inset 0 0 0 1px var(--gt-line);                       /* kart: çizgi */
  --el-2:0 1px 2px rgba(22,24,29,.06);                         /* hafif kalkma */
  --el-3:0 12px 32px -14px rgba(22,24,29,.30);                 /* açılır katman */

  /* hareket */
  --ease-out:cubic-bezier(.22,.61,.36,1);
  --ease-soft:cubic-bezier(.22,1,.36,1);
  --dur-1:120ms;   /* durum değişimi: hover, basma */
  --dur-2:250ms;   /* küçük yer değişimi */
  --dur-3:450ms;   /* açılma/kapanma */
  --dur-4:800ms;   /* göründüğünde gelme */

  /* katman sırası */
  --z-sticky:50; --z-drawer:60; --z-overlay:70; --z-dialog:80; --z-toast:90; --z-skip:100;
}
```

Kırılma noktaları tek ölçeğe iniyor (T10). Yeni ölçek, bugünkü davranışı bozmadan en yakın eşiklere oturuyor:

| Ad | Değer | Bugünkü karşılıkları |
| --- | --- | --- |
| `sm` | 560px | 560 |
| `md` | 768px | 700, 760, 820 |
| `lg` | 1024px | 1000 |
| `xl` | 1280px | 1100, 1101, 1180 |

CSS'te değişken medya sorgusu olmadığı için bu ölçek yorumla ve tek bir `@custom-media` benzeri kural listesiyle değil, **dosya başındaki sabit tabloyla** korunur; her yeni sorgu bu dört sayıdan birini kullanır. `420` ve `400` gibi ek eşikler yalnız "logo/rozet sığmıyor" gibi fiziksel zorunluluklarda kalır ve yorumunda gerekçesi yazılır.

### 6.6 Tipografi ölçeği

Bugünkü `clamp()` değerleri korunuyor, isim kazanıyor:

```css
:root{
  --fs-display:clamp(2.4rem,4.2vw,3.7rem);  /* h1, ana sayfa */
  --fs-h1:clamp(2rem,3.2vw,2.8rem);         /* iç sayfa h1 */
  --fs-h2:clamp(1.85rem,3vw,2.6rem);
  --fs-h3:1.14rem;
  --fs-lede:clamp(1.05rem,1.2vw,1.16rem);
  --fs-body:1.04rem;
  --fs-sm:.93rem;
  --fs-xs:.86rem;
  --lh-tight:1.1;  --lh-heading:1.2;  --lh-body:1.6;
  --tracking-display:-.02em;  --tracking-h2:-.015em;  --tracking-body:0;
}
```

Panelin ağır başlık dili (`font-weight:800`, `letter-spacing:-.05em`) kendi bileşen katmanında kalıyor; anlamsal ölçeği kirletmiyor. Gövde yazı boyutu her iki katmanda en az 16px eşdeğeri (`1.04rem` ≈ 16.6px, panel `17px`) — mobil otomatik yakınlaştırma sorunu yok.

---

## 7. İleri tasarım — bileşen spesifikasyonları

Her bileşen için: anatomi, durumlar, ölçüler, erişilebilirlik sözleşmesi. Tek ad alanı: site `gt-` öneki, panel `gt-app` kapsamı. Amaç, `.btn`'in dört tanımını **bir** tanıma indirmek (T1).

### 7.1 Buton

| Varyant | Zemin | Yazı | Çerçeve | Kullanım |
| --- | --- | --- | --- | --- |
| `primary` | `--gt-brand-fill` | `--gt-ink-on-brand` | yok | Ekranın tek ana eylemi |
| `secondary` | `--gt-surface` | `--gt-ink` | `inset 0 0 0 1px var(--gt-line-strong)` | Yan eylem |
| `quiet` | saydam | `--gt-ink` | yok | Üçüncül, satır içi |
| `danger` | `--gt-danger-bg` | `--gt-danger-ink` | yok | Yıkıcı; ana eylemden görsel ve mekânsal olarak ayrı |
| `link` | — | `--gt-ink` → hover `--gt-brand-ink` | — | Metin içi, oklu |

Ölçüler: `sm` yükseklik 36px / dolgu `.62rem 1.05rem` / `--fs-sm`; `md` 44px / `.9rem 1.4rem` / `.96rem`; `lg` 48px (panelin bugünkü `min-height:48px`). Yarıçap: site `--r-sm` (8px), panel `--r-pill`. **Bu iki yarıçapın ikisi de doğru** — biri kurumsal ciddiyet, biri panel yumuşaklığı; ayrım bilinçli, token adıyla sabitlenir (`--gt-btn-radius`, katman başına farklı).

Durumlar: `hover` zemin bir kademe koyu (`--dur-1`), `active` panelde `scale(.97)` / sitede yok (mevcut karar korunuyor), `disabled` `opacity:.6` + `cursor:progress` + `aria-disabled` (odak kaybolmasın diye `disabled` yerine), `pending` etiket değişimi + iğne. Ok taşıyan butonda ok `translateX(3px)` (`--dur-2`, `--ease-soft`).

Erişilebilirlik: yalnız ikon taşıyan her buton `aria-label` + `title`; dokunma hedefi en az 44×44 (panelin `icon-btn` 40px → **44px'e çıkarılmalı**, bugünkü değer `app.css:35`).

### 7.2 Alan (input, textarea, select, tarih)

Anatomi: görünür etiket (asla yalnız placeholder) → alan → kalıcı yardım metni → hata. Hata alanın **altında** ve `aria-describedby` ile bağlı.

```
etiket        --fs-sm / 600 / --gt-ink
alan          min-height 44px, yarıçap --r-md, zemin --gt-field-bg,
              çerçeve 1px --gt-field-line
hover         çerçeve --gt-field-line-hover
focus         çerçeve --gt-field-line-focus + box-shadow 0 0 0 3px --gt-brand-wash
invalid       çerçeve --gt-danger-ink + arka plan değişmez
disabled      opacity .6, imleç not-allowed
readonly      zemin --gt-surface-2, çerçeve --gt-line (disabled'dan ayrı görünür)
```

Doğrulama `blur`'da, tuş başına değil. Çok hatalı gönderimde formun başına odaklanabilir bir **hata özeti** gelir, her madde ilgili alana bağlanır; alan içi hatalar yine kalır (bugün özet yok, yalnız ilk alana odak var — `ContactForm.tsx:23-28`).

### 7.3 Etiket, durum hapı, çip

Üçü ayrı bileşen; bugünkü `.badge`/`.status`/`.chips` karmaşası buna bölünür.

- **Durum hapı** (`gt-status`): nokta + metin. Renk tek bilgi taşıyıcısı olamaz → nokta biçimi de değişir (dolu / halka / kesikli). `open`, `in_progress`, `waiting_customer`, `closed`, `stage`, `live` için eşleme tablosu tek dosyada.
- **Etiket** (`gt-tag`): yalnız okunur nitelik (yetkili, ekip notu, test maili). Yükseklik 22px, `--fs-xs`, `--r-xs`.
- **Çip** (`gt-chip`): tıklanabilir filtre. 32px yükseklik, `--r-pill`, `aria-pressed`. Koleksiyon **önce sarar**, sonra `+n` özetine iner ve bu özet açılabilir bir denetim olur (gizli değer bırakmaz).

Taşma kuralı: temel etiketler kesilmez; kesilmek zorunda kalırsa tam metin hem imleçle hem klavyeyle erişilebilir olur.

### 7.4 Kart ve liste satırı

| Tür | Yüzey | Yarıçap | Kenar |
| --- | --- | --- | --- |
| Site kartı | `--gt-surface` | `--r-lg` | `--el-1` (çizgi) |
| Panel kartı | `--gt-surface` | `--r-2xl` | kenarsız, `--gt-surface-2` sayfa zemininden ayrışır |
| Liste satırı | saydam → hover `--gt-surface-2` | `--r-lg` | yok |
| Vurgulu kart | `--gt-surface-inverse` | `--r-2xl` | yok, yazı `--gt-ink-inverse` |

Bağlantı olan kart odakta `outline:2px solid var(--gt-brand); outline-offset:2px` alır; bugünkü `box-shadow:0 0 0 2px var(--w-accent)` hover efekti korunur ama odak için ayrı bir halka kullanılır (hover ve odak aynı görünmesin).

### 7.5 Modal, sayfa çekmecesi, alt levha

Yerel `<dialog>` kalıyor — tarayıcının odak tuzağı, Escape ve örtüsü bedava geliyor. Eklenecekler:

- Açılış hareketi tetikleyiciden doğar: `scale(.96) → 1` + `opacity`, `--dur-3`, `--ease-soft`; kapanış `--dur-2` (çıkış girişin ~%60'ı).
- Kaydedilmemiş değişiklikle kapatma onayı (`sheet-dismiss-confirm`). Bugün `Modal` çocukları kapanınca sıfırlıyor ama uyarı vermiyor.
- 600px altında modal alt levhaya döner: tam genişlik, üst yarıçap `--r-2xl`, alttan kayar; `env(safe-area-inset-bottom)` payı.

### 7.6 Bildirim (yeni) — T5

Panelde `gt-toast` bölgesi: sağ altta, `--z-toast`, `aria-live="polite"` + `role="status"`, **odağı çalmaz**, 4 saniyede kendiliğinden kapanır, yıkıcı işlemlerde "Geri al" düğmesi taşır ve o zaman kapanma süresi 8 saniyeye çıkar.

Uygulama yolu, mevcut mimariye uygun biçimde: sunucu eylemi `ActionState` içine `toast:{kind,message,undoToken?}` alanı koyar; `AppShell` içinde tek bir istemci bileşeni (`ToastRegion.tsx`) bu alanı dinler. `features/team/membership.ts`'teki `?uyari=` sorgu parametresi kalıbı bu bölgeye bağlanır, böylece URL'de uyarı taşıma alışkanlığı da tek bir görsel dile kavuşur.

İlk üç kullanıcı: `LeadStatusForm` kaydetti bilgisi, kişi çıkarma/geri alma, doküman ekleme.

### 7.7 Yükleniyor ve hata durumları (yeni) — T3

```
app/(app)/panel/loading.tsx        iskelet: başlık + 3 stat kutusu + liste
app/(app)/panel/talep/loading.tsx  iskelet liste satırları
app/(app)/yonetim/loading.tsx      iskelet: başlık + 4 stat + iki kolon
app/(app)/error.tsx                "Bir şey ters gitti" + Yeniden dene + panele dön
app/(kurumsal)/error.tsx           site dilinde hata sayfası
app/global-error.tsx               son çare, minimum stil
```

İskelet bileşeni: `gt-skeleton`, `--gt-surface-2` zemin, `prefers-reduced-motion` açıkken parıltı animasyonu yok (sabit blok). 1 saniyeden kısa beklemede iskelet gösterilmez — yanıp söndürmek daha kötü.

Ağır sayfalar Suspense ile parçalanır: `yonetim/musteriler/[id]` yedi sorgunun tamamını beklemek yerine sekme içeriğini `<Suspense>` içine alır.

### 7.8 404 ve boş durumlar — T4

`app/not-found.tsx` panel dilinden çıkar; `(site)` kabuğunu (`HomeNav` + `HomeFooter`) kullanır, içerikte üç yol sunar: ana sayfa, ürünler, destek portalı. Panel içi 404 ayrı kalır (`app/(app)/not-found.tsx`) ve panel dilini korur.

Boş durum sözleşmesi: başlık (ne yok), bir cümle (neden ve ne olacak), bir eylem (birincil). Bugün üç ayrı kalıp var (`EmptyState` kartı, `li.empty-row`, `p.muted`); üçü de kalır ama seçim kuralı yazılır — sayfanın tamamı boşsa kart, liste boşsa satır, ikincil blokta ise `muted` paragraf.

---

## 8. İleri tasarım — sayfa bazlı ilerletmeler

Aşağıdaki maddeler görsel dili değiştirmiyor; bugünkü kalıbı bir adım öteye taşıyor.

### 8.1 Ana sayfa

1. **Hero'da LCP'yi sabitle.** İlk slaytın görseli `fetchPriority="high"` alıyor; ek olarak `HERO_IMAGE` ölçüleriyle `aspect-ratio` kutusu zaten var. Eklenecek: ilk slayt görseli için `<link rel="preload">` (yalnız ilk slayt), diğer slaytların `loading="lazy"` kalması.
2. **Ürün bulucuda "neden" bloğunu kalıcı kıl.** Bugün `aria-live` ile duyuruluyor ama görsel olarak küçük; öneri kartın içinde ikinci bir satır olarak da görünsün (kart açıkken `--gt-brand-wash` zeminli tek satır).
3. **Rakam bandına boş durum kuralı.** `stat2..4` boş olduğunda bant tek rakamla dengesiz kalıyor; `--n` hesabı var ama görsel denge için 1 rakam varsa bant "Mikro logosu + rakam + kısa cümle" düzenine geçsin.
4. **Referans şeridi tek logoyla ikna edici değil.** ASELSAN tek başına dururken şeridin başlığı ("Özel yazılım geliştirdiğimiz kurumlar") çoğul vaat ediyor. İki seçenek: ya şeridi "Referans: ASELSAN — [iş tanımı]" biçiminde tek satır bir ifadeye dönüştür, ya yeni referans eklenene kadar şeridi `/yazilim-cozumleri`'ne taşı.
5. **SSS'yi üç sorudan altıya çıkar** ve `FAQPage` JSON-LD ekle (bugün yalnız `ProfessionalService` var).

### 8.2 Ürünler ve karşılaştırma

1. **760px altında sütun gizleme yerine kart görünümü.** Bugün `display:none` sütunu erişilebilirlik ağacından da siliyor. Öneri: dar ekranda tablo, satır başına bir kart listesine dönüşür (özellik adı + seçili ürünün değeri), `.cmp-pick` segment kontrolü ürün seçicisi olarak kalır. Böylece hiçbir veri kaybolmaz.
2. **Ürün detay sayfası olmayan iki ürün.** `PRODUCTS` dörtken `urun-detay.ts` yalnız Jump ve Fly'ı tanıyor; Basic ve Bulut `/urunler/mikro-jump#basic` çapasına gidiyor. Bu bilinçliyse `/urunler` sayfasındaki kartlarda hedefin çapa olduğu görünür olsun (ok yerine "Jump sayfasındaki Basic bölümü" etiketi).
3. **`aria-sort`** karşılaştırma tablosunda sıralama yok; eklenmesi gerekmiyor, ancak `role="region"` sarmalayıcıya `aria-label="Ürün karşılaştırma tablosu, yatay kaydırılabilir"` eklenmeli.

### 8.3 İletişim ve dönüşüm

1. **KVKK bağlantısı** (T8): `/kvkk` sayfası + onay kutusunda bağlantı. Bu bir hukuk gereği, tasarım borcu değil.
2. **Hata özeti** (7.2) iletişim formuna uygulanır.
3. **Gönderim sonrası ne olacak** bilgisi bugün form altında tek satır; başarı ekranında da tekrar edilsin ("2 iş günü içinde dönüyoruz" + telefon).
4. **`data-konu` haritası tek yerde.** Bugün `data-konu` değerleri elle yazılıyor ve `features/leads/labels.ts` ile eşleşmek zorunda. `TOPIC_LABELS` anahtarlarından türeyen bir `KONU` sabiti bu bağı derleme zamanında kurar.

### 8.4 Panel — genel bakış

1. **Stat kutuları tıklanabilir olduğunu göstermiyor.** `a.stat:hover` halka veriyor ama dinlenme durumunda ipucu yok; sağ üste küçük bir ok ikonu eklenir.
2. **Boş panel ilk gün deneyimi.** Yeni firma girdiğinde üç kutu da "0" gösteriyor. Öneri: ilk 7 gün için "Başlarken" kartı — talep açma, GoTech Desk kurma, ekip arkadaşı davet etme; tamamlananlar işaretlenir.
3. **Gecikmiş teslim vurgusu satır içi stille yapılıyor** (`yonetim/page.tsx:49`); `.is-late` sınıfına taşınır.

### 8.5 Panel — talep detayı

1. **Yazışma uzun olduğunda** `role="log"` bölgesi her mesajı duyuruyor; sayfa açılışında geçmişin duyurulmaması için ilk yüklemede `aria-live` kapalı başlayıp yalnız yeni mesajda açılmalı.
2. **Ek yükleme ilerlemesi** `<progress>` ile var; iptal düğmesi yok. Eklenir.
3. **"Sorunum çözüldü, kapat"** yıkıcı sayılmaz ama geri dönüşsüz; onay adımı yerine kapatıldıktan sonra 10 saniyelik "Geri al" bildirimi (7.6) daha az sürtünme yaratır.
4. **Değerlendirme yıldızları** ok tuşlarıyla gezilebilir olmalı (T8).

### 8.6 Panel — cihazlar ve uzak destek

1. **Çevrimiçi/çevrimdışı yalnız renkle** anlatılıyor (T8): noktaya biçim farkı (dolu / halka) ve satırda görünür metin eklenir.
2. **Müşteri numarası kartı** (`.desk-code`) telefonda 4rem punto ile taşabiliyor; `clamp` alt sınırı 2.2rem'e indirilir ve `overflow-wrap:anywhere` eklenir.
3. **Bağlan akışı** `gotechdesk://` şemasına gidiyor; uygulama kurulu değilse hiçbir şey olmuyor. Öneri: yönlendirmeden 1,5 saniye sonra görünen "Bir şey açılmadıysa GoTech Desk'i kurun" satırı.

### 8.7 Panel — site içeriği editörü

1. **Önizleme yok.** Metni kaydeden kişi sonucu görmek için siteye gidiyor. Öneri: bölüm başına "Nerede görünüyor?" satırı (ana sayfa girişi → hero başlığı) ve `?onizleme=1` ile taslak değerleri gösteren bir site açılışı.
2. **2000 karakter sınırı** arayüzde yazılı değil; alanın altına kalan karakter göstergesi eklenir.
3. **Boş bırakılınca ne olur** bilgisi kritik: telefon boş bırakılırsa satır siteden tamamen kalkıyor. Her alanın yardım metninde bu davranış yazılır.

### 8.8 Giriş ve kimlik ekranları

1. **Şifre görünürlük düğmesi** yok (`password-toggle`); eklenir.
2. **`autocomplete`** öznitelikleri (`username`, `current-password`, `new-password`) kontrol edilip tamamlanır — şifre yöneticileri çalışsın (`accessible-authentication`).
3. **Geliştirme ortamındaki demo kutusu** üretimde görünmüyor; bu doğru. Ek olarak kutu `<details>` içine alınır, ekranın ilk izlenimini kaplamasın.

---

## 8.9 Uygulanan cila (27.09.2026)

Aşağıdakiler koda geçti. Hiçbiri sayfanın yapısını, metnini, yerleşimini ya da bileşen ağacını değiştirmiyor; yalnız kenar, durum, odak ve mikro geçiş. Kapsam **kamuya açık site**; panel dosyalarına dokunulmadı.

| Ne | Nerede |
| --- | --- |
| Bölüm etiketinin (`eyebrow` / `.tag`) önünde 18×2px marka çizgisi | `home.module.css`, `slider.module.css`, `kurumsal.css` |
| Tek tip odak halkası: 2px marka kırmızısı, 4px boşluk, yuvarlatılmış | `home.module.css` |
| Sayfa içi bağlantılar yapışkan menünün altında kalmıyor (`scroll-margin-top:96px`) | `home.module.css` |
| Butonlarda basınca 1px oturma; çerçeveli buton hover'da belirginleşiyor | `home.module.css`, `kurumsal.css`, `contact.module.css` |
| Metin bağlantılarında alt çizgi yavaşça beliriyor (menü, alt bilgi, kırmızı kart, breadcrumb) | `home.module.css`, `contact.module.css`, `kurumsal.css` |
| Menüde hover'da soldan açılan alt çizgi; etkin sayfada çift çizgi çıkmıyor | `home.module.css` |
| Yapışkan menü kayınca çizgiye çok hafif bir derinlik ekliyor | `home.module.css` |
| Fotoğrafların beyaz zeminde kenarı belirsiz kalmıyor (1px dış hat) | `slider.module.css`, `services.module.css`, `sections.module.css`, `kurumsal.css` |
| Rakam bandında rakamlar arası ince ayraç (≥901px), tabular rakamlar | `home.module.css` |
| Referans logoları dinlenirken .78 opaklık, hover'da tam güç (Mikro logosu hariç) | `home.module.css` |
| Hizmet listesinde seçili olmayan maddenin rayı hover'da soluk iz bırakıyor | `services.module.css` |
| SSS: hover ve açık durumda kenar belirginleşiyor, açık başlık markaya dönüyor | `sections.module.css` |
| e-Dönüşüm belge satırı hover'da başlığı markaya çeviriyor | `sections.module.css` |
| Yazılım kartları: ince kenar + fotoğrafın çok yavaş yaklaşması | `software.module.css` |
| Ürün bulucu: önerilen kartın üst kenarında marka çizgisi, artı düğmesi hover'da marka zeminine dönüyor | `finder.module.css` |
| Form alanları odakta marka halkası, hover'da belirgin çerçeve | `contact.module.css` |
| İç sayfa kartları (adım, referans, ek çözüm, hakkımızda) hover'da kenarı koyulaşıyor | `kurumsal.css` |
| Karşılaştırma tablosunda okunan satır hover'da belli oluyor | `kurumsal.css` |
| Numaralar ve sayısal alanlar `tabular-nums` | `home.module.css`, `sections.module.css`, `kurumsal.css` |
| Seçim (`::selection`) rengi markanın soluk tonu | `home.module.css` |

Hepsi `prefers-reduced-motion: reduce` altında geçişsiz çalışıyor. Ayrıca `color-scheme: light` bildirimi eklendi (T2), site 404'ü sitenin diline taşındı (T4), site ve iç sayfalar için hata sınırı ile son çare `global-error` eklendi (T3'ün site tarafı), ölü bileşenler ve tanımsız `d2` sınıfı temizlendi (T6).

**Panel (T3'ün panel tarafı, T5, T9) bilinçli olarak yapılmadı** — panele dokunulmaması istendi. O maddeler §9'daki fazlarda bekliyor.

### 8.10 Yazılım sayfası yeniden kuruldu (`/yazilim-cozumleri`)

Sayfa iki bölümden (giriş + referans) sekize çıktı ve girişi tam ekran fotoğrafla açılıyor. Sıra:

1. **Kapak** (yeni) — tam ekran (`100svh`) fotoğraf, üstünde başlık, açıklama ve iki buton; altta "Aşağı kaydırın" ipucu. Fotoğraf CC0 (`stok/kod-inceleme.webp`), `fetchPriority="high"` ile LCP olarak yükleniyor. Okunabilirlik fotoğrafın üstündeki perdeyle sağlanıyor: soldan sağa açılan koyu katman beyaz yazıyı AA'nın üstünde tutuyor, altta beyaza eriyen ikinci katman sonraki bölümün fotoğrafa yapışmasını engelliyor. **Menü bu sayfada saydam**: `HomeNav` `OVER_HERO` listesindeki rotalarda sabitleniyor (`position:fixed`), zemini kaldırıyor, bağlantıları beyaza çeviriyor ve beyaz logoyu (`GoTechLogoWhite`) kullanıyor; 40px kaydırınca ya da mobil menü açılınca normal beyaz menüye dönüyor. Tam ekran fotoğraf yalnız bu sayfada; sitenin geri kalanı beyaz zemin düzeninde kalıyor.
2. **Ne geliştiriyoruz** (yeni, `#ne-yapiyoruz`) — iş türlerinin numaralı dizini (`WorkIndex`), iki grup alt alta, her grubun maddeleri iki sütun (2 ve 4 madde dengeli dursun diye). Satır üstüne gelince sola 10px açılıyor, başlık ve numara markaya dönüyor.
3. **İki tür iş** (yeni, `#isler`) — Mikro'ya bağlı ve Mikro'dan bağımsız işleri ayıran iki fotoğraflı blok. **Liste tekrar edilmiyor**: işlerin kendisi bir üstteki dizinde sayılı, burada yalnız ikisi arasındaki fark anlatılıyor. Kart üstüne gelince kenarı koyulaşıyor, fotoğraf 1.02 ölçekle çok yavaş yaklaşıyor.
4. **Çalışma biçimi** (yeni, `#nasil-calisiyoruz`) — ilk görüşmeden yayın sonrasına altı adım. Ana sayfadaki dikey raydan **bilerek farklı** bir düzen: her adım tam genişlik bir satır; solda büyük numara, ortada ne yaptığımız, sağda o adımın kapsamı onay işaretli liste olarak. Satır ayraçları ince çizgi, kutu yok. Tek kaydırma hareketi numaranın yanması: satır ekranın ortasına geldiğinde numara soluk griden marka kırmızısına dönüyor (`animation-timeline: view()`), destekleyen tarayıcıda ve yalnız hareket isteyenlerde; desteklemeyende hover aynı işi yapıyor. Sıra bilgisi `<ol>`'den geldiği için numara `aria-hidden`, ayrıca "Adım N" yazısı yok — ekran okuyucuda tekrar olurdu. 1000px altında kapsam listesi metnin altına iniyor ve yatay akıyor.
5. **Nasıl geliştiriyoruz** (yeni, `#yaklasim`) — her işte değişmeyen dört ilke; kart değil, hakkımızdaki `.aboutFacts` gibi ince ayraçlı dört sütun. Üstüne gelince başlık markaya dönüyor. 1000px'te iki sütun, 560px'te alt alta ve ayraç soldan üste geçiyor.
6. **Referanslar** (değişmedi, logo hover'da tam güce çıkıyor).
7. **SSS** (yeni, `#sss`) — dört soru, ana sayfanın `Faq` bileşeni `split` düzeninde: solda yapışkan başlık, sağda sorular.
8. **Kapanış** (yeni, `#iletisim`) — "Projenizi anlatın": tam ekran (`100svh`), tam genişlik kırmızı bölüm. Solda başlık, açıklama ve iletişim bilgileri; sağda beyaz kutuda başvuru formu (`ContactForm`, ortak sunucu eylemi). Kaydırma hareketi: kırmızı zemin bölüm ekrana girerken kenarlardan içeride ve yuvarlak köşeli duruyor, kaydırdıkça tam ekrana açılıyor (`clip-path` + `animation-timeline: view()`, `cover 0% → 35%`).

**Bu bölümde öğrenilen üç teknik kural** (yeni kaydırmaya bağlı bölüm yazan herkes için):

- Zemin katmanı **mutlak konumlu olamaz**: `position:absolute` öğede `view()` zaman çizelgesi etkin olmuyor (`getComputedTiming().progress` `null` dönüyor). Katman ızgara hücresinde (`grid-area`) akışta duruyor, içerik aynı hücreye biniyor.
- Animasyon **kutunun kendi ölçüsünü değiştiremez**: `inset` animasyonu kaydırma ilerlemesini geri beslediği için anında tamamlanıyordu. Ölçü sabit, açılma `clip-path` ile yapılıyor.
- Bölümde `overflow:hidden` **kullanılmıyor**: kendi kaydırma bağlamını kurup zaman çizelgesini sayfadan koparıyor. Yerine `overflow:clip`.
- İçeriğin görünürlüğü bu animasyona bağlanmadı; içerik sitenin `[data-in]` mekanizmasıyla geliyor (2.6 sn emniyet animasyonu var). Kaydırmaya bağlı bir animasyon `opacity:0`'dan başlatılırsa, zaman çizelgesi bir sebeple etkin olmadığında içerik kalıcı olarak görünmez kalır.

Telefonda kapak: fotoğrafın odak noktası boş tarafa kayıyor (`object-position:72%`), perde bir tık koyulaşıyor, kaydırma ipucu gizleniyor.

İçerik `components/yazilim/content.ts` içinde: `SOFTWARE_STEPS`, `APPROACH`, `YAZILIM_FAQ`. Üçünün başında `TODO(GoTech)` var — müşteri, süre ya da fiyat iddiası yok, yalnız çalışma biçimi anlatılıyor; ekibin onayından geçmesi gerekiyor. Yeni bileşen dosyası açılmadı; hepsi `components/yazilim/Sections.tsx` içinde ve var olan bileşenleri (`SectionHead`, `Faq`, `.journeyList`) yeniden kullanıyor.

### 8.11 Mikro iş ortaklarının kalıbına geçiş (28.09.2026)

İstek: sitenin tasarımı Mikro'nun diğer iş ortaklarının siteleri gibi olsun. İncelenen siteler: Robox (İzmir), Bayındır, ACR Bilgi, Nokbil, Tempo Bilişim, Tekprosis, Mikrobayi/Aksiyon, Valorem, Metropol, Mikro İstanbul ve mikro.com.tr. Hepsinde tekrar eden kalıp siteye taşındı; §8.10'daki kapak ve kapanış kararlarının bir kısmı bununla geri alındı.

- **Üst bilgi şeridi** (`TopBar.tsx`, yeni): menünün üstünde lacivert (`--navy`) şerit; telefon (panelde girildiyse), e-posta, çalışma saatleri, sağda "Mikro Yazılım Yetkili İş Ortağı" ve LinkedIn. Tüm site sayfalarında.
- **Menü**: beyaz ve yapışkan; sağda "Destek portalı" (çerçeveli) ve "Ücretsiz demo" (kırmızı) butonları. Saydam menü (`OVER_HERO`, `.navOver/.navFixed`) kaldırıldı: hakkımızda ve yazılım kapakları artık menünün altından başlıyor ve tam ekran değil (`clamp(440px,62vh,620px)`); "Aşağı kaydırın" ipucu kalktı.
- **Duyuru bandı** (V16): mikro.com.tr'deki gibi kırmızı zeminde, beyaz hap buton.
- **Ana sayfa girişi**: kayar slayt (`HeroSlider`) kaldırıldı; yerine sabit giriş — rozet, başlık, açıklama, iki buton, dört güven maddesi, sağda fotoğraf ve üstünde Mikro logosu + iki Silver rozeti **beyaz kartta**. Altında bilgi şeridi: panelden girilen rakamlar, boş kalanların yerine doğrulanmış sabit bilgiler (`HERO_FACTS`: 2017, Silver Partner, Alsancak, GoTech Desk).
- **Bölümler kartlı**: ürünler (Mikro logolu dört kart + üstte "hangisi size uygun?" cümlesi; öneri kartı kırmızı çerçeve ve "Size önerimiz" etiketiyle işaretlenir), ikonlu altı hizmet kartı (`ServiceExplorer` kaldırıldı), sekiz e-belge kartı, destek kanalı kartları, "Neden GoTech" dört kartı, SSS kartları. Kart kalıbı `home.module.css` `.card` + `.iconBox`.
- **Zeminler**: bölümler beyaz ve açık gri (`--ground:#F4F6FA`) dönüşümlü; iç sayfalarda `.pd-ground` ve sayfa başlığı (`.phead`) gri bant. Gölge yumuşak ve kısa (`--card-shadow`).
- **İletişim bölümü ve alt bilgi lacivert**: form beyaz kartta. Alt bilgide Mikro logosu ve rozetler beyaz kartta (logo kuralı). Yazılım sayfasının kapanışı da aynı lacivert; kaydırmayla açılan kırmızı zemin animasyonu kaldırıldı.
- **Renk**: yazı rengi lacivert-siyah (`--ink:#101B2D`), marka kırmızısı buton ve vurguda aynı. §6.4'teki "siyah zeminli bölüm yapılmaz" kararı bu istekle değişti: lacivert yalnız üst şerit, iletişim bölümü ve alt bilgide.

Değişmeyenler: Mikro logosu ve rozetleri yalnız düz beyaz zeminde (koyu zeminde beyaz kartın içinde), 156px; uydurma rakam, müşteri sayısı, "7/24" gibi doğrulanmamış iddia yok; Figtree; `[data-in]` belirme hareketi ve hareket tercihi.

---

## 9. Uygulama yol haritası

Her faz tek başına gönderilebilir ve tek başına geri alınabilir. Faz 1 ve 2 görsel çıktıyı **değiştirmemeli**; değişirse regresyondur.

**Faz 1 — Token temeli (görsel değişim yok)**
- `web/src/app/tokens.css` **yazıldı** — ilkel + anlamsal + ölçek katmanları ve `color-scheme: light` hazır (§6.2–6.6), tek tema.
- `app/layout.tsx` içinde `tokens.css`'i `globals.css`'ten önce içe al.
- `globals.css`'teki renk sabitlerini anlamsal tokenlere bağla; `--cobalt`, `--signal` kullanımlarını `--gt-brand` / kaldır.
- `.wise` → `.gt-app` yeniden adlandırması **yapılmaz** (tek commit'te 20+ dosya dokunur); `--w-*` değişkenleri `var(--gt-*)` değerlerine bağlanarak köprülenir. Ad değişimi Faz 5'e bırakılır.
- Çıktı kontrolü: `pnpm build` + her rotanın ekran görüntüsü karşılaştırması.

**Faz 2 — Temizlik**
- T6'daki ölü bileşenleri, `.bak` dosyasını, kullanılmayan görselleri sil; `d2` sınıfını `PageHeader`'dan kaldır.
- Kırılma noktalarını dört değere indir (§6.5 tablosu); her dosyanın başına eşik tablosunu yorum olarak yaz.
- `invoices` kararını ver (T7) ve gerekçesini `db/schema.ts` yorumuna yaz.

**Faz 3 — Eksik durumlar**
- `loading.tsx` / `error.tsx` / `global-error.tsx` dosyaları (§7.7) + `gt-skeleton`.
- `not-found.tsx` site kabuğuna taşınır, panel için ayrı 404 (§7.8).
- `ToastRegion.tsx` + `ActionState.toast` alanı (§7.6); ilk üç kullanıcıya bağla.
- Panele atlama bağlantısı ve `main id="icerik"` (T9).

**Faz 4 — Tek tema sağlamlaştırma**
- `color-scheme: light` bildirimi (`tokens.css` içinde hazır) — OS koyu temasında yerel denetimlerin koyu gelmesi biter.
- Sabit `#fff` kullanımlarını (yaklaşık 20 yer) `--gt-surface`'a çevir; değer değişmiyor, isim kazanıyor.
- Koyu vurgu bloklarının envanterini çıkar (`stat.is-hero`, `.desk-code`, `.tabs a[aria-current]`, `.notice`, `.badge.is-note`) ve hepsini `--gt-surface-inverse` + `--gt-ink-inverse` üstünden çalıştır; yeni koyu blok eklenmesin.
- Kontrast denetimi: tek palet üzerinde her çift için 4.5:1 (metin) / 3:1 (arayüz öğesi).

**Faz 5 — Bileşen birleştirmesi**
- `.btn` dört tanımını tek bileşen katmanına indir (§7.1); `site.css` ve `app.css` yalnız yarıçap/yükseklik tokenini değiştirir.
- `gt-status` / `gt-tag` / `gt-chip` ayrımı (§7.3) ve durum eşleme tablosunun tek dosyaya taşınması.
- `.wise` → `.gt-app` yeniden adlandırması.

**Faz 6 — Sayfa ilerletmeleri**
- §8'deki maddeler; her biri ayrı commit. Sıra: KVKK ve hata özeti (yasal/ölçülebilir) → karşılaştırma tablosunun dar ekran kartı → panel "Başlarken" kartı → önizleme.

---

## 10. Doğrulama

Tasarım işi "bitti" demeden önce çalıştırılacaklar:

```bash
cd web
pnpm install
pnpm dev            # DATABASE_URL yoksa gömülü PGlite + demo veri
pnpm typecheck
pnpm lint
pnpm build
```

Demo girişleri `/giris` sayfasında geliştirme ortamında yazılı. Sıfırdan başlamak için `pnpm dev`'i durdurup `.data/` klasörünü silmek yeterli. Mockup'ları yan yana açmak için `python3 -m http.server 4173 --directory mockups` (`.claude/launch.json` bunu hazır tanımlıyor).

Gözle geçilecek rota listesi (her tema ve iki genişlikte — 390px ve 1440px):

`/` · `/urunler` · `/urunler/mikro-jump` · `/urunler/mikro-fly` · `/hizmetlerimiz` · `/yazilim-cozumleri` · `/hakkimizda` · `/iletisim` · `/giris` · `/panel` · `/panel/talep/[number]` · `/panel/uzak-destek` · `/yonetim` · `/yonetim/talep` · `/yonetim/musteriler/[id]` · `/yonetim/site` · bilinmeyen bir adres (404)

Her rotada kontrol:

- [ ] Klavyeyle baştan sona gezilebiliyor; odak halkası her adımda görünür ve yapışkan başlık altında kalmıyor.
- [ ] `prefers-reduced-motion: reduce` açıkken hiçbir içerik gizli kalmıyor (emniyet animasyonu çalışıyor).
- [ ] İşletim sistemi koyu temasında sayfa ve yerel denetimler (tarih seçici, kaydırma çubuğu, `select`) açık kalıyor; hiçbir yerde siyah zemin belirmiyor.
- [ ] Metin/zemin çiftleri 4.5:1, arayüz öğeleri 3:1 üstünde; Mikro logosu beyaz zeminde.
- [ ] 390px'te yatay kaydırma yok; dokunma hedefleri ≥44px ve aralarında ≥8px var.
- [ ] Yavaş ağda (DevTools "Slow 4G") iskelet görünüyor, sayfa zıplamıyor (CLS < 0.1).
- [ ] Form hatasında özet odaklanıyor, alan hatası yerinde duruyor, ekran okuyucu duyuruyor.
- [ ] Yıkıcı her eylemin ya onayı ya geri alması var.

---

## 11. Ek A — dosya haritası

```
web/src/app/
  layout.tsx            fontlar, metadata, (yeni) tokens.css
  globals.css           reset + taban + yardımcılar
  tokens.css            (yeni) tasarım tokenleri
  (site)/page.tsx       ana sayfa
  (kurumsal)/           iç sayfalar, kendi stil dosyasını yükler
  (app)/                giriş, /panel, /yonetim
web/src/components/
  home/                 ana sayfa bölümleri + CSS modülleri
  kurumsal/             iç sayfa bölümleri, kurumsal.css, logolar, ikonlar, içerik verisi
  hizmetler/, yazilim/  iki iç sayfanın kendi bölümleri
  app/                  panel kabuğu, listeler, formlar, modal, 5 CSS dosyası
  forms/                Select, DatePicker, alan ilkelleri, select.css
  site/                 SmoothScroll, motion yardımcıları
web/src/features/*      alan başına sunucu eylemleri, sorgular, etiketler
web/src/lib/            oturum, mail, biçimlendirme, hız sınırı
web/public/             brand/, images/{mikro, mikro-gorsel, referans, stok}
mockups/                pro/ (v1-kurumsal, v2-urun, v3-koyu, anasayfa), landing/, hero varyantları
```

Görsel kaynakları ve lisansları `public/images/mikro-gorsel/KAYNAK.md` ve `public/images/stok/KAYNAK.md` dosyalarında; yeni görsel eklerken bu dosyalara satır eklenir.

---

## 12. Ek B — tasarım kökeni ve mockup arşivi

`mockups/` klasörü bugünkü arayüzün nasıl seçildiğini gösteriyor. Bu bölüm neden hangi kararın verildiğini kayda geçiriyor; yeni bir tasarım önerisi gelince "bu daha önce denenmiş miydi" sorusunun cevabı burada.

### 12.1 Denenen yönler

| Dosya | Yön | Karakter |
| --- | --- | --- |
| `pro/v1-kurumsal.html` | Açık, ızgaralı, bilgi yoğun kurumsal | En beyaz ve en tablolu; hero'da sahte ERP paneli, 6 kolonlu ince ızgara, fiyat kartları + karşılaştırma tablosu, koyu 6 adımlı süreç şeridi |
| `pro/v2-urun.html` | Ortalı hero, geniş ürün görseli | SaaS pazarlama hissi; radyal kırmızı parlama, dönüşümlü (`flip`) özellik blokları, ölçüm çubukları |
| `pro/v3-koyu.html` | Koyu taban, editoryal ızgara | `--char:#15161A` zemin, numaralı editoryal satırlar, araya iki "açık nefes" bölümü |
| `pro/anasayfa.html` + `rehber.css` | **Rehber — seçilen** | Beyaz, gölgesiz, fotoğrafı gerçek; ürün bulucu ve yol haritası merkezde |
| `hero-kirmizi.html` | Hero laboratuvarı D/E/F | Kırmızı blok / beyaz kurumsal / bölünmüş |
| `hero-kurumsal.html` | Hero laboratuvarı G/H/I | Klasik kurumsal / ürün seçici / koyu kurumsal |
| `hero-alternatifleri.html`, `landing/` | **Kobalt dil** | `--cobalt:#2F45FF`, `--signal:#FFCF3D`, hap butonlar, kaydırmaya bağlı yatay ray ve "dalış" sahneleri |
| `site-modern.html` | Mevcut yapı, modern kurgu | 6 sn'de dönen üç slaytlı koyu hero |

**Seçim:** "Rehber" yönü 23.09.2026'da seçildi, diğer dört varyant silindi (`mockups/pro/rehber.css:1-9`). Aynı yorum yasakları da yazıyor: sahte Mikro ekranı yok, sahte referans yok, tam ekran koyu sahne yok, gradient/blob/glass/snap yok. Bu yasaklar bugün `home.module.css:1-6`'da tekrar ediliyor — yani ürün kararı koda yorum olarak gömülü.

**Kobalt dil ölmedi, yer değiştirdi.** `globals.css:1-22` = `mockups/landing/css/base.css:1-22` (artı `--warn-bg`, `--warn-ink`, `--error-bg`, `--field-bg`). Seçilmeyen iniş sayfası dili, panelin taban katmanı olarak kaldı; `.wise` onun üstüne kırmızıyı yazdı, `kurumsal.css:31-39` ise sitede kobalt hap butonun davranışını elle iptal etmek zorunda kaldı. T1'in kökeni bu.

### 12.2 Mockup → kod arasında bilinçli değişenler

`rehber.css:11-31` → `home.module.css:8-38` geçişi neredeyse birebir; üç fark kasıtlı:

1. `--ink-3` `rgba(22,24,29,.48)`'den `rgba(22,24,29,.6)`'ya çıkarıldı — AA kontrastı (~4.6:1) için.
2. Dolgulu butonun varsayılanı `--brand`'den `--brand-deep`'e geçti (beyaz yazı 4.2:1 → ~5.9:1); `--brand-press:#A51F19` eklendi. Mockup'ın `--brand-deep` değeri `#A81B17`'ydi, kodda `#C0261F` oldu.
3. Gri bölüm zeminleri kaldırıldı: `--ground` hâlâ tanımlı ama `.ground` yalnızca `border-top` veriyor. Mockup'ın beyaz/gri değişen ritmi yerine ince çizgi ritmi geldi.

### 12.3 Mockup'tan sapan yapısal kararlar

- **Hero.** Mockup'ta tek statik başlık + tek fotoğraf vardı. Kodda üç slaytlı otomatik dönen `HeroSlider` var — bu kalıp `site-modern.html`'den geldi, seçilen mockup'tan değil. `slider.module.css:5` daha sonraki bir müşteri notunu kaydediyor: "arkadaki gri şeyi sevmiyorum" → gri hero paneli kalktı.
- **Eklendi:** referans logo şeridi (mockup'ta yok).
- **Ana sayfadan çıkarıldı:** e-Dönüşüm bölümü, 6 adımlı yol haritası, "Mevcut Mikro kullanıcıları / V16 geçişi" üçlüsü, 4 kartlık destek ızgarası. Bileşenleri hâlâ duruyor (`ServiceSections.tsx`'teki `EDonusum` ve `ServiceJourney`, `SupportSections.tsx`'teki `Support`) ama iç sayfalara taşındı — T6'daki "kullanılmayan dışa aktarım" listesi buradan geliyor; silinmeden önce iç sayfalarda kullanılıp kullanılmadıkları kontrol edilmeli.
- **Ürün kataloğu değişti.** Mockup rafı Run / Jump / Fly / Müşavir'di; kod rafı Jump Basic / Jump / Jump Bulut / Fly. Karar ağacına "bulut" ekseni eklendi (`finder.ts:103-113`). Rafın mekaniği (container query, `flex-grow:2.6`, sabit iç genişlik) birebir taşındı.
- **Bulucu hapları.** Mockup yerel `<select>` kullanıp genişliği JS'le ölçüyordu; kod panelin kendi `Select` bileşenini hap görünümünde kullanıyor, ölçme hilesi gerekmedi.
- **Menü.** Mockup 1000px altında bağlantıları yerine bir şey koymadan gizliyordu; kod 1100px altında gerçek bir açılır menü ve `aria-current` altı çizgileri ekledi.
- **Hareket.** Mockup GSAP + ScrollTrigger CDN yığınıyla çalışıyordu; kod `HomeEffects` + CSS ile 2.6 saniyelik emniyet animasyonuna indirdi. Kaydırmaya bağlı yol haritası çizgisinin ana sayfada karşılığı yok (yalnız `/hizmetlerimiz`'de `animation-timeline:view()` ile var).
- **İç sayfaların mockup'ı hiç yok.** `(kurumsal)` sayfaları mockup'ın tokenlerini miras alıyor, sonra `kurumsal.css` mockup'ta bulunmayan makineyi ekliyor: `.phead`, `.pd-hero`, `.pd-specs`, `.pd-feats`, `.setup`, `.pd-steps`, `.diff`, `.pd-addons`, `.pc`/`.cmp`, `.ref-list`, `.ab-*`. Yani iç sayfaların görsel dili doğrudan kodda doğdu — §7'deki bileşen spesifikasyonunun en çok işe yarayacağı yer burası.

### 12.4 Mikro marka kuralları (değişmez)

- Mikro logosu **yalnız tam beyaz zeminde**, **156px** genişlikte. Kılavuzun alt sınırı 120px; PNG'nin boşluğu yüzünden 156px CSS genişliği mürekkebi ~152px'te tutuyor. Kural üç dosyada yorumla korunuyor (`home.module.css:106`, `kurumsal.css:227`, `:244`) ve koyu temada da esnetilmiyor (§6.4).
- Koyu bir mockup'ta logo beyaz bir çip içine alınmıştı (`v3-koyu.html:26`). Tek tema kararıyla bu duruma düşmüyoruz; yine de koyu bir vurgu bloğunun yanına logo koymak gerekirse izlenecek yol bu — logoyu koyuya oturtmak değil, beyaz çipe almak.
- Ürün logoları normalize ediliyor: `--k = 254 / PNG içindeki "mikro" kelimesinin genişliği`, genişlik `calc(var(--m) * var(--k))`, `--m` kapalı kartta 74px, açıkta 104px. Oranlar: run `1.693`, jump `1.752`, fly `1.539`, müşavir `2.134`. Kodda `finder.ts:46-51` bu oranları taşıyor. Yeni ürün logosu eklenirken oran ölçülüp yazılmalı, yoksa "mikro" kelimesi kartlar arasında farklı boyda görünür.
- Silver Partner rozetleri `height:62px` (400px altında 52px).
- GoTech logosu: italik 600 "go" `#E53935`, `#B0B0B0` ayraç çubuğu, light-300 "tech" `#5C5C5C`, sağda kırmızı artı; yazı `'Segoe UI'` ailesi. Beyaz varyantta ayraç `rgba(255,255,255,.45)`. Bileşen içinde satır içi SVG olarak duruyor (`Logo.tsx`); `public/brand/*.svg` aynı çizimin dosya hâli ama kullanılmıyor (T6).

### 12.5 Mockup'lardan alınmamış ama alınabilir üç fikir

1. **`v1-kurumsal.html`'in telefon bandı** (`.bar`): hero'nun hemen altında tek satır telefon + çalışma saati. Bugün telefon yalnız alt bilgide ve iletişim kartında; satış telefonu panelden boş gelebildiği için bant koşullu olur.
2. **`v2-urun.html`'in dönüşümlü özellik blokları**: `/urunler/[slug]` sayfasının uzun listelerini kırmak için uygun; tek kural, gradient ve parlama getirmemesi.
3. **`v3-koyu.html`'in numaralı editoryal satırları**: `/yazilim-cozumleri` bugün tam bunu yapıyor — yani koyu varyantın en iyi parçası zaten açık temada kullanılmış durumda. Koyu varyantın geri kalanına ihtiyaç yok; arşivde kalması yeterli.

Mockup'ları çalıştırmak için: `python3 -m http.server 4173 --directory mockups` (`.claude/launch.json` içinde tanımlı). Arşiv silinmemeli — koddaki yorumlar bu dosyalara isimle atıf yapıyor.
