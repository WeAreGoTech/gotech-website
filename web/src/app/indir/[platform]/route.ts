import { CUSTOMER_CODE_PATTERN } from "@/features/customers/customer-code";
import { installerFileName, installerUrl, isDeskPlatform } from "@/features/devices/downloads";
import { findCompanyByCode } from "@/features/devices/people";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// Public link customers share inside their company; the company code in ?firma= only shapes the file name.
const DOWNLOADS_PER_MINUTE = 30;
const MINUTE_MS = 60_000;
const HTTP = { notFound: 404, tooMany: 429, badGateway: 502 } as const;
// everything else about the upstream response is ours to set
const PASSED_THROUGH = ["content-length", "content-type"] as const;

const message = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request: Request, ctx: RouteContext<"/indir/[platform]">) {
  const { platform } = await ctx.params;
  if (!isDeskPlatform(platform)) return message("Kurulum dosyası bulunamadı.", HTTP.notFound);
  if (isRateLimited(`desk-download:${await clientIp()}`, DOWNLOADS_PER_MINUTE, MINUTE_MS)) {
    return message("Çok fazla indirme isteği. Lütfen biraz sonra tekrar deneyin.", HTTP.tooMany);
  }

  const source = installerUrl(platform);
  if (!source) return message("Bu işletim sistemi için kurulum dosyası henüz yayınlanmadı.", HTTP.notFound);

  const code = new URL(request.url).searchParams.get("firma") ?? "";
  const company = CUSTOMER_CODE_PATTERN.test(code) ? await findCompanyByCode(code) : null;

  const upstream = await fetch(source, { cache: "no-store" }).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return message("Kurulum dosyasına şu an ulaşılamıyor. Lütfen biraz sonra tekrar deneyin ya da bize yazın.", HTTP.badGateway);
  }

  const headers = new Headers({
    "Content-Disposition": `attachment; filename="${installerFileName(platform, company ? code : undefined)}"`,
    "Cache-Control": "no-store",
  });
  for (const name of PASSED_THROUGH) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  // streamed straight through: installers are big and never need to sit in memory
  return new Response(upstream.body, { headers });
}
