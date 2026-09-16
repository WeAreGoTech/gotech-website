import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTES = 32;

export const newToken = () => randomBytes(TOKEN_BYTES).toString("base64url");

// Tokens are stored hashed; only the user's cookie or e-mail link holds the raw value.
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
