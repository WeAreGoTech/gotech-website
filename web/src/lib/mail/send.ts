import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { getDb } from "@/db";
import { emailLog } from "@/db/schema";
import { env } from "@/lib/env";

export type Mail = { to: string; subject: string; text: string };

let transporter: Transporter | null = null;

function smtpTransport(): Transporter {
  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

/**
 * Sends through SMTP when SMTP_HOST is set, otherwise only records the mail (test mode).
 * Never throws: a failed notification must not undo what the user just did.
 * Every mail, including failures with their error, is listed at /yonetim/mailler.
 */
export async function sendMail(mail: Mail) {
  const transport = env.smtp.host ? "smtp" : "mock";
  let error: string | null = null;

  if (transport === "smtp") {
    try {
      await smtpTransport().sendMail({ from: env.mailFrom, to: mail.to, subject: mail.subject, text: mail.text });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      console.error(`[mail] "${mail.subject}" to ${mail.to} failed:`, e);
    }
  }

  try {
    const db = await getDb();
    await db.insert(emailLog).values({ to: mail.to, subject: mail.subject, body: mail.text, transport, error });
  } catch (e) {
    console.error("[mail] could not write the mail log:", e);
  }
}
