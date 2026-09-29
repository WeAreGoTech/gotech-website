/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { MikroLogo } from "@/components/kurumsal/Logo";
import p from "./page.module.css";

const BADGES = {
  jump: { src: "/images/jumper-silver.png", alt: "Jumper Silver Partner", width: 297, height: 233 },
  fly: { src: "/images/flyer-silver.png", alt: "Flyer Silver Partner", width: 324, height: 247 },
};

type Props = { only?: keyof typeof BADGES; text?: string };

/**
 * Mikro iş ortaklığı: Mikro logosu (kılavuz: en az 120px, yalnız beyaz zeminde) ve Silver rozetleri.
 * only: ürün sayfasında yalnız o ürünün rozeti.
 */
export function PartnerMarks({ only, text }: Props) {
  const badges = only ? [BADGES[only]] : [BADGES.jump, BADGES.fly];
  const line = text ?? (only === "jump" ? "Jumper Silver Partner" : only === "fly" ? "Flyer Silver Partner" : "Jumper ve Flyer Silver Partner");
  return (
    <div className={p.marks}>
      <MikroLogo className={p.mikro} />
      <div className={p.marksText}>
        <span className={p.badges}>
          {badges.map((b) => <img key={b.src} src={b.src} alt={b.alt} width={b.width} height={b.height} />)}
        </span>
        <p>Mikro Yazılım yetkili iş ortağı<br />{line}</p>
      </div>
    </div>
  );
}
