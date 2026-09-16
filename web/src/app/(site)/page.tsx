import { Contact } from "@/components/site/Contact";
import { HeroFlow } from "@/components/site/HeroFlow";
import { Process } from "@/components/site/Process";
import { Services } from "@/components/site/Services";
import { SiteNav } from "@/components/site/SiteNav";
import "@/components/site/site.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Compare, Faq, Logos, SiteFooter, Work } from "@/components/site/StaticSections";

export default function HomePage() {
  return (
    <>
      <a className="skip" href="#hizmetler">İçeriğe geç</a>
      <SmoothScroll />
      <SiteNav />
      <main id="top">
        <HeroFlow />
        <Logos />
        <Services />
        <Process />
        <Work />
        <Compare />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
