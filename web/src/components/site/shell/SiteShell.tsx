import { ViewTransition, type ReactNode } from "react";
import { getSiteConfig } from "@/features/site-content/queries";
import "../site.css";
import { Footer } from "./Footer";
import { Motion } from "./Motion";
import { Nav } from "./Nav";
import { Notice } from "./Notice";
import { Prefill } from "./Prefill";

const ROOT_ID = "site";

/**
 * Kamuya açık sitenin tek kabuğu (ana sayfa ve iç sayfalar): üst bant, menü, alt bilgi, hareket.
 * Menü ve alt bilgi sayfa değişince yerinde kalır; yalnız içerik geçiş yapar (React ViewTransition, site.css).
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const { settings, content } = await getSiteConfig();

  return (
    <div id={ROOT_ID} className="gt">
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <Notice />
      <Nav />
      <ViewTransition default="none" update="gt-page">
        <div id="icerik">{children}</div>
      </ViewTransition>
      <Footer settings={settings} content={content} />
      <Motion rootId={ROOT_ID} />
      <Prefill rootId={ROOT_ID} />
    </div>
  );
}
