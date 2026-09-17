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

export const heartbeatSchema = z.object({ deskId, deviceToken, hostname, appVersion });

export const supportRequestSchema = z.object({
  deskId,
  deviceToken,
  message: z.string().trim().min(1).max(SUPPORT_MESSAGE_MAX),
});

export type RegisterInput = z.infer<typeof registerSchema>;
