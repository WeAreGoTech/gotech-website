"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { LEAD_STATUSES, LEAD_TOPICS, leads } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { newLeadMail } from "@/lib/mail/templates";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const LEADS_PER_WINDOW = 5;
const LEAD_WINDOW_MS = 10 * 60_000;
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const leadSchema = z.object({
  name: z.string().trim().min(2, { error: "Adınızı ve soyadınızı yazın." }).max(120),
  company: optional(160),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın, örneğin ad@sirket.com." })),
  phone: optional(40),
  topics: z.array(z.enum(LEAD_TOPICS)),
  message: optional(5000),
  consent: z.literal(true, { error: "Devam etmek için aydınlatma metnini onaylayın." }),
});

export async function submitLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // honeypot: real visitors never see this field, so pretend success for bots
  if (text(formData, "website")) return success();
  if (isRateLimited(`lead:${await clientIp()}`, LEADS_PER_WINDOW, LEAD_WINDOW_MS)) {
    return failure("Kısa sürede çok fazla mesaj gönderildi. Birkaç dakika sonra tekrar deneyin.");
  }

  const parsed = leadSchema.safeParse({
    name: text(formData, "name"),
    company: text(formData, "company"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    topics: formData.getAll("topic").map(String),
    message: text(formData, "message"),
    consent: formData.get("consent") === "on",
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { name, company, email, phone, topics, message } = parsed.data;

  const db = await getDb();
  // consent is required by the schema, so reaching this point means it was given now
  const [lead] = await db.insert(leads).values({ name, company, email, phone, topics, message, consentAt: new Date() }).returning();
  await sendMail(newLeadMail(lead));
  revalidatePath("/yonetim/basvurular");
  return success();
}

export async function updateLeadStatus(leadId: string, formData: FormData) {
  await requireStaff();
  const status = z.enum(LEAD_STATUSES).parse(text(formData, "status"));
  const db = await getDb();
  await db.update(leads).set({ status }).where(eq(leads.id, leadId));
  revalidatePath("/yonetim/basvurular");
}
