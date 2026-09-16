import "server-only";
import type { ZodType } from "zod";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// Shared plumbing of the GoTech Desk desktop app API: no session, JSON in and out, rate limited per IP.
export const HTTP = { badRequest: 400, unauthorized: 401, notFound: 404, conflict: 409, tooMany: 429 } as const;

export const DESK_ERRORS = {
  tooMany: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.",
  invalid: "Geçersiz istek.",
  unknownCompany: "Firma kodu bulunamadı.",
  notRegistered: "Cihaz kaydı bulunamadı.",
} as const;

const MINUTE_MS = 60_000;

export const deskFail = (error: string, status: number, code?: string) =>
  Response.json(code ? { ok: false, error, code } : { ok: false, error }, { status });

export const notRegistered = () => deskFail(DESK_ERRORS.notRegistered, HTTP.unauthorized, "not_registered");

type Guard = { bucket: string; perMinute: number };

/** Applies the per-IP rate limit, then validates the JSON body. Returns the data or the error response to send. */
export async function readDeskRequest<T>(request: Request, { bucket, perMinute }: Guard, schema: ZodType<T>): Promise<{ data: T } | { response: Response }> {
  if (isRateLimited(`desk-${bucket}:${await clientIp()}`, perMinute, MINUTE_MS)) {
    return { response: deskFail(DESK_ERRORS.tooMany, HTTP.tooMany) };
  }
  const body: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { response: deskFail(DESK_ERRORS.invalid, HTTP.badRequest) };
  return { data: parsed.data };
}
