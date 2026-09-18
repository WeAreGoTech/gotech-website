import { isDeskPlatform, setupInstallerFileName } from "@/features/devices/downloads";
import { plainMessage, streamInstaller } from "@/features/devices/installer-stream";
import { findSetupLink } from "@/features/devices/setup-links";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// The installer of a person's setup link. Checked first, so a made-up token gets no file with a token in its name.
const DOWNLOADS_PER_MINUTE = 30;
const MINUTE_MS = 60_000;
const HTTP = { notFound: 404, tooMany: 429 } as const;

export async function GET(_request: Request, ctx: RouteContext<"/kur/[token]/[platform]">) {
  const { token, platform } = await ctx.params;
  if (!isDeskPlatform(platform)) return plainMessage("Kurulum dosyası bulunamadı.", HTTP.notFound);
  if (isRateLimited(`desk-download:${await clientIp()}`, DOWNLOADS_PER_MINUTE, MINUTE_MS)) {
    return plainMessage("Çok fazla indirme isteği. Lütfen biraz sonra tekrar deneyin.", HTTP.tooMany);
  }
  if (!(await findSetupLink(token))) return plainMessage("Kurulum bağlantısı geçersiz ya da süresi dolmuş. GoTech'ten yenisini isteyin.", HTTP.notFound);
  return streamInstaller(platform, setupInstallerFileName(platform, token));
}
