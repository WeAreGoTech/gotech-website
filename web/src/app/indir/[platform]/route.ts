import { CUSTOMER_CODE_PATTERN } from "@/features/customers/customer-code";
import { installerFileName, isDeskPlatform } from "@/features/devices/downloads";
import { plainMessage, streamInstaller } from "@/features/devices/installer-stream";
import { findCompanyByCode } from "@/features/devices/people";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// Public link customers share inside their company; the company code in ?firma= only shapes the file name.
const DOWNLOADS_PER_MINUTE = 30;
const MINUTE_MS = 60_000;
const HTTP = { notFound: 404, tooMany: 429 } as const;

export async function GET(request: Request, ctx: RouteContext<"/indir/[platform]">) {
  const { platform } = await ctx.params;
  if (!isDeskPlatform(platform)) return plainMessage("Kurulum dosyası bulunamadı.", HTTP.notFound);
  if (isRateLimited(`desk-download:${await clientIp()}`, DOWNLOADS_PER_MINUTE, MINUTE_MS)) {
    return plainMessage("Çok fazla indirme isteği. Lütfen biraz sonra tekrar deneyin.", HTTP.tooMany);
  }

  const code = new URL(request.url).searchParams.get("firma") ?? "";
  const company = CUSTOMER_CODE_PATTERN.test(code) ? await findCompanyByCode(code) : null;
  return streamInstaller(platform, installerFileName(platform, company ? code : undefined));
}
