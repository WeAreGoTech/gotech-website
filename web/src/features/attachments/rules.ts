// Upload limits and allowed file types, shared by the upload route, the server actions and the picker in the browser.

const MB = 1024 * 1024;
export const MAX_FILE_MB = 250;
export const MAX_FILE_BYTES = MAX_FILE_MB * MB;
export const MAX_FILES_PER_MESSAGE = 10;
export const NAME_MAX = 200;
// name of the hidden inputs that carry uploaded attachment ids into the message form
export const ATTACHMENT_FIELD = "attachmentIds";

export type AttachmentKind = "image" | "video" | "file";

type FileType = { mime: string; kind: AttachmentKind };

// The extension decides the stored type; the browser's content-type is only checked against ACCEPTED_MIME_TYPES.
// HEIC and AVI are allowed but most browsers cannot show them, so they are listed as plain files.
const FILE_TYPES: Record<string, FileType> = {
  png: { mime: "image/png", kind: "image" },
  jpg: { mime: "image/jpeg", kind: "image" },
  jpeg: { mime: "image/jpeg", kind: "image" },
  gif: { mime: "image/gif", kind: "image" },
  webp: { mime: "image/webp", kind: "image" },
  heic: { mime: "image/heic", kind: "file" },
  mp4: { mime: "video/mp4", kind: "video" },
  mov: { mime: "video/quicktime", kind: "video" },
  webm: { mime: "video/webm", kind: "video" },
  mkv: { mime: "video/x-matroska", kind: "video" },
  avi: { mime: "video/x-msvideo", kind: "file" },
  pdf: { mime: "application/pdf", kind: "file" },
  txt: { mime: "text/plain", kind: "file" },
  log: { mime: "text/plain", kind: "file" },
  csv: { mime: "text/csv", kind: "file" },
  zip: { mime: "application/zip", kind: "file" },
  rar: { mime: "application/vnd.rar", kind: "file" },
  "7z": { mime: "application/x-7z-compressed", kind: "file" },
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", kind: "file" },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", kind: "file" },
  pptx: { mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", kind: "file" },
};

// what browsers and operating systems actually send for the types above
const MIME_ALIASES = [
  "application/octet-stream",
  "image/pjpeg",
  "image/heif",
  "video/avi",
  "video/msvideo",
  "text/x-log",
  "application/csv",
  "text/comma-separated-values",
  "application/vnd.ms-excel",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-rar",
  "application/x-7z",
];
const ACCEPTED_MIME_TYPES = new Set([...Object.values(FILE_TYPES).map((t) => t.mime), ...MIME_ALIASES]);

/** Value for the file input's accept attribute. */
export const ACCEPT_ATTRIBUTE = Object.keys(FILE_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");

export const UPLOAD_HINT = `Ekran kaydı, ekran görüntüsü, PDF veya zip ekleyebilirsiniz (dosya başına en fazla ${MAX_FILE_MB} MB).`;

export const UPLOAD_ERRORS = {
  type: "Bu dosya türü eklenemez. Resim, video, PDF, metin, zip/rar/7z veya Office dosyası ekleyin.",
  size: `Dosya en fazla ${MAX_FILE_MB} MB olabilir.`,
  empty: "Dosya boş.",
  count: `Bir mesaja en fazla ${MAX_FILES_PER_MESSAGE} dosya eklenebilir.`,
  name: "Dosya adı okunamadı.",
} as const;

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot + 1).toLowerCase();
};

/** The stored type of a file, or null when its extension or content-type is not allowed. */
export function fileTypeFor(name: string, contentType: string): FileType | null {
  const type = FILE_TYPES[extensionOf(name)];
  if (!type) return null;
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (mime && !ACCEPTED_MIME_TYPES.has(mime)) return null;
  return type;
}

/** Why a file cannot be uploaded, or null when it can; the picker checks this before uploading, the upload route checks the same rules. */
export function uploadProblem(name: string, contentType: string, size: number): string | null {
  if (!fileTypeFor(name, contentType)) return UPLOAD_ERRORS.type;
  if (size > MAX_FILE_BYTES) return UPLOAD_ERRORS.size;
  if (size === 0) return UPLOAD_ERRORS.empty;
  return null;
}

// control characters and path separators never end up in a stored name
const UNSAFE_NAME_CHARS = /[\u0000-\u001f\u007f/\\]+/g;

/** Keeps the last path segment, strips unsafe characters and shortens long names without losing the extension. */
export function sanitizeFileName(raw: string): string {
  const base = raw.split(/[/\\]/).pop() ?? "";
  const clean = base.replace(UNSAFE_NAME_CHARS, "").replace(/\s+/g, " ").trim();
  if (clean.length <= NAME_MAX) return clean;
  const ext = extensionOf(clean);
  const suffix = ext ? `.${ext}` : "";
  return clean.slice(0, NAME_MAX - suffix.length) + suffix;
}

/** Images, videos and PDFs open in the browser; everything else downloads. */
export const opensInline = (mime: string) => mime.startsWith("image/") || mime.startsWith("video/") || mime === "application/pdf";

export const kindOfMime = (mime: string): AttachmentKind =>
  Object.values(FILE_TYPES).find((t) => t.mime === mime)?.kind ?? "file";

export const attachmentHref = (id: string) => `/dosya/${id}`;
