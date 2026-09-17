import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform, type TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeWebStream } from "node:stream/web";
import { env } from "@/lib/env";

// Files live at <UPLOAD_DIR>/<yyyy>/<mm>/<uuid>; uploads are written to <UPLOAD_DIR>/tmp first and moved when complete.
const TMP_DIR = "tmp";
const STORAGE_KEY = /^\d{4}\/\d{2}\/[0-9a-f-]{36}$/;
const MONTH_DIGITS = 2;

export class UploadTooLargeError extends Error {}

/** Counts bytes on the way through and fails the pipeline as soon as the limit is passed. */
class ByteLimit extends Transform {
  bytes = 0;
  constructor(private readonly limit: number) {
    super();
  }
  _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback) {
    this.bytes += chunk.length;
    if (this.bytes > this.limit) callback(new UploadTooLargeError());
    else callback(null, chunk);
  }
}

const absolutePath = (storageKey: string) => {
  if (!STORAGE_KEY.test(storageKey)) throw new Error(`Invalid storage key: ${storageKey}`);
  return path.join(env.uploadDir, storageKey);
};

const removeQuietly = (file: string) => unlink(file).catch(() => undefined);

/**
 * Streams a request body to disk without holding it in memory.
 * Throws UploadTooLargeError past maxBytes; a partial file is always removed.
 */
export async function saveStream(body: ReadableStream<Uint8Array>, maxBytes: number): Promise<{ storageKey: string; size: number }> {
  const now = new Date();
  const id = randomUUID();
  const storageKey = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(MONTH_DIGITS, "0")}/${id}`;
  const tmpFile = path.join(env.uploadDir, TMP_DIR, `${id}.part`);
  await mkdir(path.dirname(tmpFile), { recursive: true });

  const counter = new ByteLimit(maxBytes);
  try {
    // the DOM and Node typings describe the same web stream differently
    await pipeline(Readable.fromWeb(body as NodeWebStream<Uint8Array>), counter, createWriteStream(tmpFile));
    const target = absolutePath(storageKey);
    await mkdir(path.dirname(target), { recursive: true });
    await rename(tmpFile, target);
  } catch (error) {
    await removeQuietly(tmpFile);
    throw error;
  }
  return { storageKey, size: counter.bytes };
}

export const deleteStoredFile = (storageKey: string) => removeQuietly(absolutePath(storageKey));

/** Size of a stored file, or null when it is missing on disk. */
export async function storedFileSize(storageKey: string): Promise<number | null> {
  const info = await stat(absolutePath(storageKey)).catch(() => null);
  return info?.isFile() ? info.size : null;
}

/** A byte range of a stored file (inclusive end) as a web stream for a Response body. */
export function readStoredFile(storageKey: string, start: number, end: number): ReadableStream<Uint8Array> {
  const stream = createReadStream(absolutePath(storageKey), { start, end });
  return Readable.toWeb(stream) as ReadableStream<Uint8Array>;
}

/** Removes .part files left behind by uploads that were interrupted by a crash or restart. */
export async function removeStaleTempFiles(olderThanMs: number) {
  const dir = path.join(env.uploadDir, TMP_DIR);
  const names = await readdir(dir).catch(() => [] as string[]);
  const cutoff = Date.now() - olderThanMs;
  for (const name of names) {
    const file = path.join(dir, name);
    const info = await stat(file).catch(() => null);
    if (info && info.mtimeMs < cutoff) await removeQuietly(file);
  }
}
