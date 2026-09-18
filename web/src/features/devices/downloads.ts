// Installer links of the GoTech Desk desktop app; the company code travels in the file name.
import { env } from "@/lib/env";
import { latestInstallerUrl } from "./latest-release";

export const DESK_PLATFORMS = ["windows", "mac"] as const;
export type DeskPlatform = (typeof DESK_PLATFORMS)[number];

export const DESK_PLATFORM_LABELS: Record<DeskPlatform, string> = { windows: "Windows", mac: "macOS" };
const INSTALLER_EXTENSIONS: Record<DeskPlatform, string> = { windows: "exe", mac: "dmg" };
const INSTALLER_NAME = "GoTechDesk";

export const isDeskPlatform = (value: string): value is DeskPlatform => (DESK_PLATFORMS as readonly string[]).includes(value);

/** Where that platform's installer is hosted; empty when there is none. */
export const installerUrl = (platform: DeskPlatform) => latestInstallerUrl(platform);

/** "GoTechDesk-482913.exe" for a known company, "GoTechDesk.exe" without one. */
export const installerFileName = (platform: DeskPlatform, customerCode?: string) =>
  `${INSTALLER_NAME}${customerCode ? `-${customerCode}` : ""}.${INSTALLER_EXTENSIONS[platform]}`;

/**
 * A setup link's installer: on Windows the token rides in the file name ("GoTechDesk-kur-<token>.exe") and the app reads
 * it at its first start. A Mac app cannot see its disk image's name, so it gets the token from a gotechdesk:// link.
 */
export const setupInstallerFileName = (platform: DeskPlatform, token: string) =>
  platform === "windows" ? `${INSTALLER_NAME}-kur-${token}.${INSTALLER_EXTENSIONS.windows}` : installerFileName(platform);

/** The download link a customer follows; staff can send it as is. */
export const installerHref = (platform: DeskPlatform, customerCode: string) => `/indir/${platform}?firma=${customerCode}`;
export const installerLink = (platform: DeskPlatform, customerCode: string) => `${env.siteUrl}${installerHref(platform, customerCode)}`;

/** The version the app should update itself to, or null while none is published. */
export async function latestDeskUpdate() {
  if (!env.desk.latestVersion) return null;
  const [windowsUrl, macUrl] = await Promise.all([installerUrl("windows"), installerUrl("mac")]);
  return { version: env.desk.latestVersion, windowsUrl, macUrl };
}
