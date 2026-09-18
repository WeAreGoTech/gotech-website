import "server-only";
import { installerUrl, type DeskPlatform } from "./downloads";

const HTTP = { notFound: 404, badGateway: 502 } as const;
// everything else about the upstream response is ours to set
const PASSED_THROUGH = ["content-length", "content-type"] as const;

export const plainMessage = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

/** Streams that platform's installer from where it is hosted, under the given file name, which is what the app reads. */
export async function streamInstaller(platform: DeskPlatform, fileName: string): Promise<Response> {
  const source = await installerUrl(platform);
  if (!source) return plainMessage("Bu işletim sistemi için kurulum dosyası henüz yayınlanmadı.", HTTP.notFound);

  const upstream = await fetch(source, { cache: "no-store" }).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return plainMessage("Kurulum dosyasına şu an ulaşılamıyor. Lütfen biraz sonra tekrar deneyin ya da bize yazın.", HTTP.badGateway);
  }

  const headers = new Headers({ "Content-Disposition": `attachment; filename="${fileName}"`, "Cache-Control": "no-store" });
  for (const name of PASSED_THROUGH) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  // streamed straight through: installers are big and never need to sit in memory
  return new Response(upstream.body, { headers });
}
