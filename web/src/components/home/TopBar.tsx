import type { SiteSettings } from "@/components/kurumsal/content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { telHref } from "./parts";

/**
 * Menünün üstündeki lacivert şerit (Mikro iş ortaklarının sitelerindeki kalıp): telefon, e-posta ve çalışma saatleri;
 * sağda iş ortaklığı ve LinkedIn. Değerler panelden (Site ayarları); telefon girilmemişse telefon satırı yok.
 * Menüyle birlikte yapışmaz: sayfa kayınca yukarıda kalır, yalnız menü yapışır.
 */
export function TopBar({ settings }: { settings: SiteSettings }) {
  const phone = settings.salesPhone || settings.supportPhone;
  // adresin son satırı (ör. "Alsancak — İzmir")
  const city = settings.address.split("\n").pop()?.trim();
  return (
    <div className={h.topbar}>
      <div className={h.wrap}>
        <ul className={h.topInfo}>
          {phone && (
            <li><Icon name="phone" size={15} /><a href={telHref(phone)}>{phone}</a></li>
          )}
          <li><Icon name="mail" size={15} /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
          <li className={h.topHours}><Icon name="clock" size={15} />{settings.workingHours}</li>
          {city && <li className={h.topCity}><Icon name="mapPin" size={15} />{city}</li>}
        </ul>
        <div className={h.topSide}>
          <span className={h.topPartner}><Icon name="shieldCheck" size={16} />Mikro Yazılım Jumper &amp; Flyer Silver Partner</span>
          {settings.linkedin && (
            <a className={h.topSocial} href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="GoTech LinkedIn sayfası">
              <Icon name="linkedin" size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
