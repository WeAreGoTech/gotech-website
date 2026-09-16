// Also read by CLI scripts (tsx), so this module must not import "server-only".
const DEFAULT_SMTP_PORT = 587;
const DEFAULT_DESK_SERVER_HOST = "152.53.142.222";
const DEFAULT_DESK_NAT_PORT = 21115;

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
  desk: {
    secretKey: process.env.DESK_SECRET_KEY || "",
    serverHost: process.env.DESK_SERVER_HOST || DEFAULT_DESK_SERVER_HOST,
    natPort: Number(process.env.DESK_SERVER_NAT_PORT) || DEFAULT_DESK_NAT_PORT,
    downloadWindowsUrl: process.env.DESK_DOWNLOAD_WINDOWS_URL || "",
    downloadMacUrl: process.env.DESK_DOWNLOAD_MAC_URL || "",
  },
};
