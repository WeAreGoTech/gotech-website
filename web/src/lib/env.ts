// Also read by CLI scripts (tsx), so this module must not import "server-only".
const DEFAULT_SMTP_PORT = 587;

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || "",
  notifyEmail: process.env.NOTIFY_EMAIL || "destek@gotech.local",
  mailFrom: process.env.MAIL_FROM || "GoTech <bildirim@gotech.local>",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};
