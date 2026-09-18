import { z } from "zod";
import { CUSTOMER_CODE_PATTERN } from "@/features/customers/customer-code";
import { CONTACT_NAME_MAX, LABEL_MAX } from "./labels";

// Request bodies of the GoTech Desk desktop app API (/api/desk/*).
const CONTACT_NAME_MIN = 2;
const SUPPORT_MESSAGE_MAX = 2000;
const DEVICE_TOKEN_MAX = 200;

const customerCode = z.string().regex(CUSTOMER_CODE_PATTERN);
const deskId = z.string().regex(/^\d{6,12}$/);
const hostname = z.string().trim().min(1).max(100);
const appVersion = z.string().trim().min(1).max(30);
const deviceToken = z.string().min(1).max(DEVICE_TOKEN_MAX);
// base64 of RustDesk's machine UUID; its connection audit identifies the computer by desk ID + this
const deviceUuid = z.string().min(1).max(DEVICE_TOKEN_MAX);

export const lookupSchema = z.object({ customerCode });

export const registerSchema = z.object({
  customerCode,
  deskId,
  hostname,
  platform: z.string().trim().min(1).max(20),
  appVersion,
  // null or missing means the customer turned unattended access off
  unattendedPassword: z.string().min(8).max(128).nullish(),
  // Person and label: missing keeps what is stored (staff may have edited it), null clears it.
  personId: z.uuid().nullish(),
  personName: z.string().trim().min(CONTACT_NAME_MIN).max(CONTACT_NAME_MAX).nullish(),
  label: z.string().trim().min(1).max(LABEL_MAX).nullish(),
});

export const teamSchema = z.object({ deskId, hostname, appVersion });

// Sent with the session token of an app sign-in: the account, not a company code, says whose computer it is.
export const claimSchema = registerSchema.pick({ deskId: true, hostname: true, platform: true, appVersion: true, unattendedPassword: true });

export const releaseSchema = registerSchema.pick({ deskId: true });

// the token of a person's setup link, read by the app from its installer's name or a gotechdesk://kur/<token> link
export const setupSchema = registerSchema
  .pick({ deskId: true, hostname: true, platform: true, appVersion: true })
  .extend({ token: z.string().regex(/^[A-Za-z0-9_-]{20,100}$/) });

// deviceUuid is optional: apps before 1.5.0-test9 do not send it
export const heartbeatSchema = z.object({ deskId, deviceToken, hostname, appVersion, deviceUuid: deviceUuid.optional() });

export const sessionsSchema = z.object({ deskId, deviceToken });

// RustDesk's connection audit (src/server/connection.rs post_conn_audit): one record when a connection opens,
// one with the peer when it is authorized, one on close. Other fields it sends are ignored.
export const connAuditSchema = z.object({
  id: deskId,
  uuid: deviceUuid,
  conn_id: z.number().int(),
  nonce: z.string().min(1).max(100),
  action: z.string().max(20).optional(),
  ip: z.string().max(100).optional(),
  peer: z.array(z.string().max(200)).max(2).optional(),
  type: z.number().int().optional(),
});

export const supportRequestSchema = z.object({
  deskId,
  deviceToken,
  message: z.string().trim().min(1).max(SUPPORT_MESSAGE_MAX),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type ConnAuditInput = z.infer<typeof connAuditSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
