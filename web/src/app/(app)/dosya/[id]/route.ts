import { z } from "zod";
import { getAttachmentForDownload } from "@/features/attachments/queries";
import { opensInline } from "@/features/attachments/rules";
import { readStoredFile, storedFileSize } from "@/features/attachments/storage";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";

const HTTP_OK = 200;
const HTTP_PARTIAL = 206;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_RANGE_NOT_SATISFIABLE = 416;

type Found = NonNullable<Awaited<ReturnType<typeof getAttachmentForDownload>>>;

/** Pending uploads: only the uploader. Staff: everything linked. Customers: their company's files, never those of internal notes. */
function canDownload(user: SessionUser, { attachment, isInternal }: Found) {
  if (!attachment.ticketId) return attachment.uploadedById === user.id;
  if (user.role === "staff") return true;
  return attachment.companyId === user.companyId && isInternal === false;
}

// RFC 6266 / 5987: a plain ASCII fallback plus the exact UTF-8 name
function contentDisposition(name: string, mime: string) {
  const fallback = name.replace(/[^\x20-\x7e]|["\\%]/g, "_");
  // encodeURIComponent leaves ' ( ) * alone, but they are not allowed in an RFC 5987 value
  const encoded = encodeURIComponent(name).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return `${opensInline(mime) ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

/** A single "bytes=start-end" range; null when absent, "invalid" when it cannot be served. */
function parseRange(header: string | null, size: number): { start: number; end: number } | "invalid" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return "invalid";
  if (!match[1]) {
    // "bytes=-500": the last 500 bytes
    const suffix = Number(match[2]);
    return suffix > 0 ? { start: Math.max(0, size - suffix), end: size - 1 } : "invalid";
  }
  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  return start <= end && start < size ? { start, end } : "invalid";
}

const notFound = () => new Response("Dosya bulunamadı.", { status: HTTP_NOT_FOUND, headers: { "Cache-Control": "private, no-store" } });

export async function GET(request: Request, ctx: RouteContext<"/dosya/[id]">) {
  const user = await getCurrentUser();
  if (!user) return new Response("Önce giriş yapın.", { status: HTTP_UNAUTHORIZED });

  const { id } = await ctx.params;
  const found = z.uuid().safeParse(id).success ? await getAttachmentForDownload(id) : null;
  // 404 whether it does not exist or is not visible to this user, so ids cannot be probed
  if (!found || !canDownload(user, found)) return notFound();
  const { attachment } = found;
  const size = await storedFileSize(attachment.storageKey);
  if (size === null) return notFound();

  const headers: Record<string, string> = {
    "Content-Type": attachment.mimeType,
    "Content-Disposition": contentDisposition(attachment.originalName, attachment.mimeType),
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };
  const range = parseRange(request.headers.get("range"), size);
  if (range === "invalid") {
    return new Response(null, { status: HTTP_RANGE_NOT_SATISFIABLE, headers: { ...headers, "Content-Range": `bytes */${size}` } });
  }

  const { start, end } = range ?? { start: 0, end: size - 1 };
  const body = readStoredFile(attachment.storageKey, start, end);
  headers["Content-Length"] = String(end - start + 1);
  if (!range) return new Response(body, { status: HTTP_OK, headers });
  return new Response(body, { status: HTTP_PARTIAL, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}` } });
}
