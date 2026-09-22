# Windows Server'da yayına alma

Site ve panel tek bir Next.js uygulaması. Windows'ta Docker yok, o yüzden kurgu şu:

```
İnternet ──443──▶ IIS (SSL + reverse proxy) ──▶ 127.0.0.1:3000 Node.js (Next.js)
                                                        │
                                                        ├── PostgreSQL 127.0.0.1:5432
                                                        └── C:\gotech\data\uploads
```

IIS tek bir iş yapıyor: SSL'i karşılıyor ve bütün istekleri Node'a aktarıyor. Statik dosyaları da
Next.js'in kendisi sunuyor, IIS'te ayrıca klasör ayarlamak gerekmiyor.

Klasör düzeni (istediğiniz yere kurabilirsiniz, yollar buna göre değişir):

```
C:\gotech\web     uygulama (bu depodaki web klasörü)
C:\gotech\iis     IIS sitesinin fiziksel klasörü, içinde sadece web.config
C:\gotech\data    yüklenen dosyalar ve yedekler
C:\gotech\logs    servis günlükleri
```

---

## 1. Node.js

[nodejs.org](https://nodejs.org) adresinden **Node.js 22 LTS** Windows MSI'ını kurun. Sonra
yönetici PowerShell'de pnpm'i açın:

```powershell
corepack enable
node -v
pnpm -v
```

## 2. PostgreSQL

[postgresql.org/download/windows](https://www.postgresql.org/download/windows/) üzerinden
**PostgreSQL 16 veya 17**'yi kurun. Kurulumda verdiğiniz `postgres` şifresini not edin.
Sonra veritabanını ve kullanıcıyı oluşturun (Start menüsünden **SQL Shell (psql)**):

```sql
CREATE USER gotech WITH PASSWORD 'buraya-guclu-bir-sifre';
CREATE DATABASE gotech OWNER gotech;
```

Tabloları elle oluşturmanız gerekmiyor: uygulama ilk açılışta `drizzle/` altındaki göçleri
kendisi çalıştırıyor.

PostgreSQL'i dışarıya kapalı tutun; `postgresql.conf` içinde `listen_addresses = 'localhost'`
kalsın ve 5432'yi güvenlik duvarında dışarıya açmayın.

## 3. Uygulama

Depoyu `C:\gotech\web` olacak şekilde kopyalayın (bu deponun **web** klasörü). Sonra:

```powershell
cd C:\gotech\web
pnpm install --frozen-lockfile
```

`deploy\windows\env.ornek` dosyasını `C:\gotech\web\.env` olarak kopyalayın ve doldurun.
`DESK_SECRET_KEY` için:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> Bu anahtar bir kez üretilir. Sonradan değiştirilirse kayıtlı uzak erişim şifreleri okunamaz hale gelir.

Yükleme klasörünü açın ve derleyin:

```powershell
mkdir C:\gotech\data\uploads
mkdir C:\gotech\logs
cd C:\gotech\web
pnpm build
```

Bir kez elle çalıştırıp hata var mı bakın:

```powershell
pnpm exec next start -H 127.0.0.1 -p 3000
```

Başka bir pencerede `curl http://127.0.0.1:3000` cevap veriyorsa tamam; `Ctrl+C` ile durdurun.

## 4. Node'u Windows servisi yapmak

Sunucu yeniden başladığında uygulama da kendiliğinden kalksın diye
[NSSM](https://nssm.cc/download) kullanıyoruz. `nssm.exe`'yi `C:\gotech\` altına koyun,
yönetici PowerShell'de:

```powershell
C:\gotech\nssm.exe install GoTechWeb "C:\Program Files\nodejs\node.exe" "C:\gotech\web\node_modules\next\dist\bin\next" start -H 127.0.0.1 -p 3000
C:\gotech\nssm.exe set GoTechWeb AppDirectory C:\gotech\web
C:\gotech\nssm.exe set GoTechWeb AppEnvironmentExtra NODE_ENV=production
C:\gotech\nssm.exe set GoTechWeb AppStdout C:\gotech\logs\web.log
C:\gotech\nssm.exe set GoTechWeb AppStderr C:\gotech\logs\web-error.log
C:\gotech\nssm.exe set GoTechWeb Start SERVICE_AUTO_START
C:\gotech\nssm.exe start GoTechWeb
```

Durum kontrolü: `Get-Service GoTechWeb` · Durdurma: `C:\gotech\nssm.exe stop GoTechWeb`

`.env` dosyasını Next.js kendisi okur. Yine de bir değer alınmıyorsa aynı değeri
`AppEnvironmentExtra` satırına eklemek işi garantiye alır (her değer ayrı `AD=deger` olarak).

## 5. IIS

**Sunucu Yöneticisi → Rol ve Özellik Ekle** ile *Web Sunucusu (IIS)* rolünü kurun.
Sonra iki eklentiyi indirip kurun (Microsoft Web Platform Installer olmadan, doğrudan MSI olarak):

- **URL Rewrite 2.1**
- **Application Request Routing (ARR) 3.0**

Kurulumdan sonra IIS Yöneticisi'nde:

1. Sunucu düğümüne tıklayın → **Application Request Routing Cache** → sağdaki
   **Server Proxy Settings** → **Enable proxy** işaretli olsun → Uygula.
2. Yine sunucu düğümü → **URL Rewrite** → sağdaki **View Server Variables** →
   **Add** ile `HTTP_X_FORWARDED_PROTO` ekleyin. (Bu olmadan `web.config`'deki satır hata verir.)

Siteyi oluşturun:

1. `C:\gotech\iis` klasörünü açın ve bu depodaki `web\deploy\windows\web.config` dosyasını
   içine kopyalayın.
2. IIS Yöneticisi → **Siteler** → **Web Sitesi Ekle**
   - Site adı: `gotech`
   - Fiziksel yol: `C:\gotech\iis`
   - Bağlama: `http`, port 80, ana bilgisayar adı `gotech.com.tr`
3. SSL sertifikasını kurun ve `https` / 443 bağlamasını ekleyin.
   Sertifikanız yoksa [win-acme](https://www.win-acme.com/) ile ücretsiz Let's Encrypt
   sertifikası alıp IIS'e bağlayabilirsiniz; yenilemeyi de kendisi üstlenir.
4. Site → **SSL Ayarları**'nda *SSL gerektir* işaretlenebilir; 80'den 443'e yönlendirme için
   ayrı bir rewrite kuralı eklemek isterseniz URL Rewrite'tan ekleyin.

> **Giriş yapılamıyorsa ilk bakılacak yer HTTPS.** Oturum çerezi üretimde `secure` işaretli,
> yani düz `http://` üzerinden giriş çalışmaz.

Uygulama havuzunun (`gotech` app pool) ayarları önemsiz — IIS hiç .NET kodu çalıştırmıyor,
sadece proxy yapıyor. İsterseniz **.NET CLR sürümü: Yönetilen kod yok** yapabilirsiniz.

## 6. İlk ekip hesabı

```powershell
cd C:\gotech\web
pnpm create-staff "Ad Soyad" ad@gotech.com.tr
```

Komut bir şifre belirleme linki yazdırır; tarayıcıda açıp şifreyi belirleyin, sonra
`https://gotech.com.tr/giris` üzerinden yönetim paneline girin.

SMTP henüz ayarlı değilse mailler gönderilmez; gönderilecek maillerin tamamı
`/yonetim/mailler` sayfasında görünür, davet linkleri oradan da açılabilir.

## 7. Güvenlik duvarı

| Port | Kime açık |
| --- | --- |
| 80, 443 | herkese |
| 3000 | sadece 127.0.0.1 (dışarı **kapalı**) |
| 5432 | sadece 127.0.0.1 (dışarı **kapalı**) |

## 8. Yedek

Düzenli yedeklenmesi gerekenler:

- **Veritabanı:** `pg_dump -U gotech gotech > C:\gotech\data\yedek\gotech-YYYYAAGG.sql`
- **Yüklenen dosyalar:** `C:\gotech\data\uploads`
- **`.env` dosyası** (özellikle `DESK_SECRET_KEY`)

## Güncelleme

```powershell
C:\gotech\nssm.exe stop GoTechWeb
cd C:\gotech\web
git pull                      # ya da yeni dosyaları kopyalayın
pnpm install --frozen-lockfile
pnpm build
C:\gotech\nssm.exe start GoTechWeb
```

Yeni veritabanı göçü varsa servis açılırken kendiliğinden uygulanır.

## Bir şey çalışmazsa

| Belirti | Bakılacak yer |
| --- | --- |
| IIS 502.3 / boş sayfa | `Get-Service GoTechWeb` çalışıyor mu, `C:\gotech\logs\web-error.log` |
| IIS 500.50 | `HTTP_X_FORWARDED_PROTO` sunucu değişkeni eklenmemiş (Adım 5.2) |
| Giriş yapılıyor ama hemen çıkıyor | Site https üzerinden mi açılıyor |
| Veritabanına bağlanamıyor | `.env` içindeki `DATABASE_URL`, PostgreSQL servisi çalışıyor mu |
| Büyük dosya yüklenmiyor | `web.config`'deki `maxAllowedContentLength`, ardından ARR'ın istek arabellek sınırı |
| Mail gitmiyor | `/yonetim/mailler` sayfası — `SMTP_HOST` boşsa test modundadır |

## Açık konu: uzak destek sunucusu

Panelin uzak destek bölümü, müşteri bilgisayarlarının RustDesk buluşma sunucusuna
(`DESK_SERVER_HOST`) bağlanmasına dayanıyor. Bu sunucu şu an **152.53.142.222**'de çalışıyor
(`hbbs` / `hbbr`). Site Windows'a taşındığında iki seçenek var:

1. **Olduğu gibi bırakmak** — panel Windows'ta, buluşma sunucusu 152.53.142.222'de kalır.
   Hiçbir şey değişmez, kurulu müşteri bilgisayarları çalışmaya devam eder.
2. **Windows'a taşımak** — RustDesk sunucusunun Windows sürümü kurulur, `DESK_SERVER_HOST`
   yeni adrese çevrilir. Bu durumda **kurulu bütün müşteri bilgisayarlarının yeniden
   yapılandırılması gerekir**, yoksa çevrimdışı görünürler.
