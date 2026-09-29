import type { ReactNode } from "react";
import { getSiteConfig } from "@/features/site-content/queries";
import "../site.css";
import { Footer } from "./Footer";
import { Motion } from "./Motion";
import { Nav } from "./Nav";
import { Notice } from "./Notice";
import { Prefill } from "./Prefill";

const ROOT_ID = "site";
// sayfa içeriğinin kabı: Motion yeni sayfanın buraya girdiği anı izler
const CONTENT_ID = "icerik";

/**
 * Kamuya açık sitenin tek kabuğu (ana sayfa ve iç sayfalar): üst bant, menü, alt bilgi, hareket.
 * Menü ve alt bilgi sayfa değişince yerinde kalır. Sayfalar arasında geçiş animasyonu yok: eski sayfanın sönüp yenisinin
 * belirmesi (ViewTransition) kaydırma ve giriş animasyonlarıyla çakışıp sayfayı yanıp söndürüyordu (29.09).
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const { settings, content } = await getSiteConfig();

  return (
    <div id={ROOT_ID} className="gt">
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <Notice />
      <Nav />
      <div id={CONTENT_ID}>{children}</div>
      <Footer settings={settings} content={content} />
      <Motion rootId={ROOT_ID} contentId={CONTENT_ID} />
      <Prefill rootId={ROOT_ID} />
    </div>
  );
}
