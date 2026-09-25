import { installerFileName, isDeskPlatform } from "@/features/devices/downloads";
import { plainMessage, streamInstaller } from "@/features/devices/installer-stream";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// Public download link; customers sign in with their panel account after installing.
const DOWNLOADS_PER_MINUTE = 30;
const MINUTE_MS = 60_000;
const HTTP = { notFound: 404, tooMany: 429 } as const;

export async function GET(request: Request, ctx: RouteContext<"/indir/[platform]">) {
  const { platform } = await ctx.params;
  if (!isDeskPlatform(platform)) return plainMessage("Kurulum dosyası bulunamadı.", HTTP.notFound);
  if (isRateLimited(`desk-download:${await clientIp()}`, DOWNLOADS_PER_MINUTE, MINUTE_MS)) {
    return plainMessage("Çok fazla indirme isteği. Lütfen biraz sonra tekrar deneyin.", HTTP.tooMany);
  }

  const portable = new URL(request.url).searchParams.get("portable") === "1";
  return streamInstaller(platform, installerFileName(platform, portable));
}
