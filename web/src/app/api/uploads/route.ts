import { after } from "next/server";
import { z } from "zod";
import { createPendingAttachment, removeAbandonedUploads } from "@/features/attachments/queries";
import { MAX_FILE_BYTES, UPLOAD_ERRORS, fileTypeFor, sanitizeFileName } from "@/features/attachments/rules";
import { UploadTooLargeError, deleteStoredFile, saveStream } from "@/features/attachments/storage";
import { getCompany } from "@/features/customers/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { isRateLimited } from "@/lib/rate-limit";

// Ticket attachment upload. The body is the raw file (not multipart) and is streamed to disk, never buffered.
// Headers: x-file-name (URI-encoded), content-type, content-length. Staff also pass ?firma=<company id> of the ticket.

const HTTP = { badRequest: 400, unauthorized: 401, forbidden: 403, lengthRequired: 411, tooLarge: 413, unsupported: 415, tooMany: 429 } as const;
const ALLOWED_FETCH_SITES = new Set(["same-origin", "none"]);
const UPLOADS_PER_MINUTE = 30;
const MINUTE_MS = 60_000;
const ABANDONED_AFTER_MS = 24 * 60 * MINUTE_MS;
// abandoned uploads are looked for at most this often per process
const CLEANUP_INTERVAL_MS = 10 * MINUTE_MS;

const globalForCleanup = globalThis as unknown as { gotechUploadCleanupAt?: number };

const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });

function scheduleCleanup() {
  const now = Date.now();
  if (now - (globalForCleanup.gotechUploadCleanupAt ?? 0) < CLEANUP_INTERVAL_MS) return;
  globalForCleanup.gotechUploadCleanupAt = now;
  after(() => removeAbandonedUploads(ABANDONED_AFTER_MS).catch((error) => console.error("[uploads] cleanup failed", error)));
}

function decodeName(header: string | null) {
  try {
    return sanitizeFileName(decodeURIComponent(header ?? ""));
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  // uploads only come from our own pages (CSRF)
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !ALLOWED_FETCH_SITES.has(fetchSite)) return fail("Geçersiz istek kaynağı.", HTTP.forbidden);

  const user = await getCurrentUser();
  if (!user) return fail("Önce giriş yapın.", HTTP.unauthorized);
  if (isRateLimited(`upload:${user.id}`, UPLOADS_PER_MINUTE, MINUTE_MS)) return fail("Çok fazla dosya yüklendi. Lütfen biraz sonra tekrar deneyin.", HTTP.tooMany);

  const lengthHeader = request.headers.get("content-length");
  const declaredSize = Number(lengthHeader);
  if (!lengthHeader || !Number.isSafeInteger(declaredSize) || declaredSize < 0) return fail("Dosya boyutu bildirilmedi.", HTTP.lengthRequired);
  if (declaredSize > MAX_FILE_BYTES) return fail(UPLOAD_ERRORS.size, HTTP.tooLarge);

  const name = decodeName(request.headers.get("x-file-name"));
  if (!name) return fail(UPLOAD_ERRORS.name, HTTP.badRequest);
  const contentType = request.headers.get("content-type") ?? "";
  const fileType = fileTypeFor(name, contentType);
  if (!fileType) return fail(UPLOAD_ERRORS.type, HTTP.unsupported);
  if (declaredSize === 0) return fail(UPLOAD_ERRORS.empty, HTTP.badRequest);

  let companyId = user.companyId;
  if (user.role === "staff") {
    const firma = new URL(request.url).searchParams.get("firma") ?? "";
    companyId = z.uuid().safeParse(firma).success ? ((await getCompany(firma))?.id ?? null) : null;
  }
  if (!companyId) return fail("Firma bulunamadı.", HTTP.badRequest);
  if (!request.body) return fail(UPLOAD_ERRORS.empty, HTTP.badRequest);

  scheduleCleanup();
  let saved: Awaited<ReturnType<typeof saveStream>>;
  try {
    saved = await saveStream(request.body, declaredSize);
  } catch (error) {
    if (error instanceof UploadTooLargeError) return fail(UPLOAD_ERRORS.size, HTTP.tooLarge);
    console.error("[uploads] upload interrupted", error);
    return fail("Dosya yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.", HTTP.badRequest);
  }
  if (saved.size !== declaredSize) {
    await deleteStoredFile(saved.storageKey);
    return fail("Dosya eksik yüklendi. Tekrar deneyin.", HTTP.badRequest);
  }

  const attachment = await createPendingAttachment({
    companyId,
    uploadedById: user.id,
    originalName: name,
    mimeType: fileType.mime,
    sizeBytes: saved.size,
    storageKey: saved.storageKey,
  });
  return Response.json({ ok: true, id: attachment.id, name: attachment.originalName, size: attachment.sizeBytes, mimeType: attachment.mimeType });
}
