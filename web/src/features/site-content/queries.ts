import "server-only";
import { cache } from "react";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_SITE_SETTINGS,
  type SiteContent,
  type SiteSettings,
} from "@/components/kurumsal/content";
import { getDb } from "@/db";
import { siteTexts } from "@/db/schema";

export type SiteConfig = { settings: SiteSettings; content: SiteContent };

// Kayıtlı değerleri koddaki varsayılanların üzerine bindirir; bilinmeyen anahtarlar yok sayılır.
function merge<T extends Record<string, string>>(defaults: T, saved: Map<string, string>): T {
  const merged = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const value = saved.get(key);
    if (value !== undefined) merged[key as keyof T] = value as T[keyof T];
  }
  return merged;
}

// Sitenin bütün sayfaları ve kabuğu bu tek okumadan besleniyor; cache() aynı istekte tekrarını önlüyor.
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const db = await getDb();
  const texts = await db.select().from(siteTexts);
  const saved = new Map(texts.map((row) => [row.key, row.value]));

  return { settings: merge(DEFAULT_SITE_SETTINGS, saved), content: merge(DEFAULT_SITE_CONTENT, saved) };
});
