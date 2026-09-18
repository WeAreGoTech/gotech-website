// Also read by CLI scripts (tsx), so this module must not import "server-only".
import path from "node:path";

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
  // ticket attachments; in production a mounted volume at /app/.data/uploads (the default under WORKDIR /app)
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), ".data", "uploads"),
  desk: {
    secretKey: process.env.DESK_SECRET_KEY || "",
    serverHost: process.env.DESK_SERVER_HOST || DEFAULT_DESK_SERVER_HOST,
    natPort: Number(process.env.DESK_SERVER_NAT_PORT) || DEFAULT_DESK_NAT_PORT,
    // installers come from the repo's latest GitHub release; these only apply while GitHub cannot be reached
    releasesRepo: process.env.DESK_RELEASES_REPO || "WeAreGoTech/gotech-desk",
    downloadWindowsUrl: process.env.DESK_DOWNLOAD_WINDOWS_URL || "",
    downloadMacUrl: process.env.DESK_DOWNLOAD_MAC_URL || "",
    // version the desktop app should update itself to; empty means "no update to offer"
    latestVersion: process.env.DESK_LATEST_VERSION || "",
  },
};
