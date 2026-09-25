// Installer links of the GoTech Desk desktop app.
import { env } from "@/lib/env";
import { latestInstallerUrl, latestReleaseVersion } from "./latest-release";

export const DESK_PLATFORMS = ["windows", "mac"] as const;
export type DeskPlatform = (typeof DESK_PLATFORMS)[number];

export const DESK_PLATFORM_LABELS: Record<DeskPlatform, string> = { windows: "Windows", mac: "macOS" };
const INSTALLER_EXTENSIONS: Record<DeskPlatform, string> = { windows: "exe", mac: "dmg" };
const INSTALLER_NAME = "GoTechDesk";

export const isDeskPlatform = (value: string): value is DeskPlatform => (DESK_PLATFORMS as readonly string[]).includes(value);

/** Where that platform's installer is hosted; empty when there is none. */
export const installerUrl = (platform: DeskPlatform) => latestInstallerUrl(platform);

/**
 * "GoTechDesk.exe". The Windows app installs itself at its first start unless its name says "portable", which is
 * the separate no-install download.
 */
export const installerFileName = (platform: DeskPlatform, portable = false) =>
  `${INSTALLER_NAME}${portable && platform === "windows" ? "-portable" : ""}.${INSTALLER_EXTENSIONS[platform]}`;

/**
 * A setup link's installer: on Windows the token rides in the file name ("GoTechDesk-kur-<token>.exe") and the app reads
 * it at its first start. A Mac app cannot see its disk image's name, so it gets the token from a gotechdesk:// link.
 */
export const setupInstallerFileName = (platform: DeskPlatform, token: string) =>
  platform === "windows" ? `${INSTALLER_NAME}-kur-${token}.${INSTALLER_EXTENSIONS.windows}` : installerFileName(platform);

/** The download link a customer follows; staff can send it as is. */
export const installerHref = (platform: DeskPlatform, portable = false) => `/indir/${platform}${portable ? "?portable=1" : ""}`;
export const installerLink = (platform: DeskPlatform) => `${env.siteUrl}${installerHref(platform)}`;

/**
 * The version the app should update itself to, or null while none is published. It follows the latest GitHub release;
 * DESK_LATEST_VERSION still overrides it, e.g. to hold customers back from a release.
 */
export async function latestDeskUpdate() {
  const version = env.desk.latestVersion || (await latestReleaseVersion());
  if (!version) return null;
  const [windowsUrl, macUrl] = await Promise.all([installerUrl("windows"), installerUrl("mac")]);
  return { version, windowsUrl, macUrl };
}
