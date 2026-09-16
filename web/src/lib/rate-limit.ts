import "server-only";
import { headers } from "next/headers";

// In-memory, per process. Enough for a single VPS instance; use Redis if the app is scaled out.
const hitsByKey = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 10_000;

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (hitsByKey.size > MAX_TRACKED_KEYS) hitsByKey.clear();
  const hits = (hitsByKey.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  hitsByKey.set(key, hits);
  return hits.length > limit;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}
