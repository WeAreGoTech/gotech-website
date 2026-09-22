import { FlowSection } from "@/components/kurumsal/FlowSection";
import { Hero } from "@/components/kurumsal/Hero";
import { Closing, PhotoBand, ProductRows, ServicesBlock } from "@/components/kurumsal/Sections";
import { getSiteConfig } from "@/features/site-content/queries";

export default async function HomePage() {
  const { settings, content } = await getSiteConfig();

  return (
    <main>
      <Hero settings={settings} content={content} />
      <FlowSection />
      <ProductRows />
      <ServicesBlock />
      <PhotoBand />
      <Closing settings={settings} content={content} />
    </main>
  );
}
