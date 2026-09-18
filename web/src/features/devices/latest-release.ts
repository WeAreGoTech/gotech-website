import "server-only";
import { env } from "@/lib/env";
import type { DeskPlatform } from "./downloads";

// The installers customers get: the newest release marked "Latest" on GitHub (pre-releases, i.e. test builds, never are).
// Checked at most every ten minutes, well inside GitHub's 60 unauthenticated requests an hour.
const CACHE_MS = 10 * 60_000;
const REQUEST_TIMEOUT_MS = 5_000;
// the Windows 10/11 installer and the Apple Silicon disk image; the "-win7" archive build never is the default
const ASSET_PATTERNS: Record<DeskPlatform, RegExp> = { windows: /-x86_64\.exe$/, mac: /-aarch64\.dmg$/ };

type Release = Record<DeskPlatform, string>;

let cached: { release: Release; at: number } | null = null;

async function fetchLatestRelease(): Promise<Release | null> {
  const response = await fetch(`https://api.github.com/repos/${env.desk.releasesRepo}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }).catch(() => null);
  if (!response?.ok) return null;
  const body: unknown = await response.json().catch(() => null);
  const assets = body && typeof body === "object" && "assets" in body && Array.isArray(body.assets) ? body.assets : [];
  const urlOf = (platform: DeskPlatform) => {
    const asset = assets.find(
      (a): a is { name: string; browser_download_url: string } =>
        typeof a?.name === "string" && typeof a?.browser_download_url === "string" && ASSET_PATTERNS[platform].test(a.name),
    );
    return asset?.browser_download_url ?? "";
  };
  return { windows: urlOf("windows"), mac: urlOf("mac") };
}

/** Where that platform's installer is: the latest GitHub release, else the DESK_DOWNLOAD_* fallback. */
export async function latestInstallerUrl(platform: DeskPlatform) {
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    const release = await fetchLatestRelease();
    // on a failed check keep serving the last good answer rather than falling back mid-day
    if (release) cached = { release, at: Date.now() };
  }
  const fallback = platform === "windows" ? env.desk.downloadWindowsUrl : env.desk.downloadMacUrl;
  return cached?.release[platform] || fallback;
}
