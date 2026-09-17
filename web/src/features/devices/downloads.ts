// Installer links of the GoTech Desk desktop app; the company code travels in the file name.
import { env } from "@/lib/env";

export const DESK_PLATFORMS = ["windows", "mac"] as const;
export type DeskPlatform = (typeof DESK_PLATFORMS)[number];

export const DESK_PLATFORM_LABELS: Record<DeskPlatform, string> = { windows: "Windows", mac: "macOS" };
const INSTALLER_EXTENSIONS: Record<DeskPlatform, string> = { windows: "exe", mac: "dmg" };
const INSTALLER_NAME = "GoTechDesk";

export const isDeskPlatform = (value: string): value is DeskPlatform => (DESK_PLATFORMS as readonly string[]).includes(value);

/** Where that platform's installer is hosted; empty when no link is configured. */
export const installerUrl = (platform: DeskPlatform) => (platform === "windows" ? env.desk.downloadWindowsUrl : env.desk.downloadMacUrl);

/** "GoTechDesk-482913.exe" for a known company, "GoTechDesk.exe" without one. */
export const installerFileName = (platform: DeskPlatform, customerCode?: string) =>
  `${INSTALLER_NAME}${customerCode ? `-${customerCode}` : ""}.${INSTALLER_EXTENSIONS[platform]}`;

/** The download link a customer follows; staff can send it as is. */
export const installerHref = (platform: DeskPlatform, customerCode: string) => `/indir/${platform}?firma=${customerCode}`;
export const installerLink = (platform: DeskPlatform, customerCode: string) => `${env.siteUrl}${installerHref(platform, customerCode)}`;

/** The version the app should update itself to, or null while none is published. */
export function latestDeskUpdate() {
  if (!env.desk.latestVersion) return null;
  return { version: env.desk.latestVersion, windowsUrl: installerUrl("windows"), macUrl: installerUrl("mac") };
}
