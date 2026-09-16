// AES-256-GCM for unattended-access passwords of GoTech Desk computers.
// Also used by the development seed, which CLI scripts (tsx) load, so this module must not import "server-only".
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTES = 32;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const PART_COUNT = 3;
const DEV_KEY_SEED = "gotech-desk-development-key";

let devKeyWarned = false;

function secretKey(): Buffer {
  if (!env.desk.secretKey) {
    if (env.isProduction) throw new Error("DESK_SECRET_KEY is not set. Generate one with: openssl rand -base64 32");
    if (!devKeyWarned) {
      console.warn("[desk] DESK_SECRET_KEY is not set, using the fixed development key.");
      devKeyWarned = true;
    }
    return createHash("sha256").update(DEV_KEY_SEED).digest();
  }
  const key = Buffer.from(env.desk.secretKey, "base64");
  if (key.length !== KEY_BYTES) throw new Error(`DESK_SECRET_KEY must be base64 of ${KEY_BYTES} bytes.`);
  return key;
}

/** Returns `base64(iv).base64(tag).base64(ciphertext)`. */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, secretKey(), iv, { authTagLength: TAG_BYTES });
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64")).join(".");
}

export function decryptSecret(stored: string): string {
  const parts = stored.split(".");
  if (parts.length !== PART_COUNT) throw new Error("Malformed encrypted value.");
  const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, "base64"));
  const decipher = createDecipheriv(ALGORITHM, secretKey(), iv, { authTagLength: TAG_BYTES });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
