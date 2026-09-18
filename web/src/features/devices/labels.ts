import type { DeviceConnectionKind } from "@/db/schema";

export const CONNECTION_KIND_LABELS: Record<DeviceConnectionKind, string> = {
  connect: "Uzak bağlantı",
  file_transfer: "Dosya aktarımı",
};

// limits shared by the desktop app API and the staff edit form
export const CONTACT_NAME_MAX = 120;
export const LABEL_MAX = 60;

// GoTech Desk IDs of our own computers; RustDesk hands out 9 digits, with room for longer ones later
export const STAFF_DESK_ID_PATTERN = /^\d{9,12}$/;
export const STAFF_DESK_ID_HINT = "GoTech Desk ID'si 9-12 haneli bir sayıdır.";

const PLATFORM_LABELS: Record<string, string> = { windows: "Windows", macos: "macOS", linux: "Linux" };
export const platformLabel = (platform: string) => PLATFORM_LABELS[platform.toLowerCase()] ?? platform;

// value of ?tur= on the connect link; ?talep= links the connection to the ticket it was opened from
export const CONNECT_PARAM_KINDS = { connect: "connect", file: "file_transfer" } as const satisfies Record<string, DeviceConnectionKind>;
export type ConnectParam = keyof typeof CONNECT_PARAM_KINDS;
export const connectHref = (deviceId: string, param: ConnectParam, ticketNumber?: number) =>
  `/yonetim/cihazlar/${deviceId}/baglan?tur=${param}${ticketNumber === undefined ? "" : `&talep=${ticketNumber}`}`;

export const deviceHref = (deviceId: string) => `/yonetim/cihazlar/${deviceId}`;

/** Label of a shared computer, else its hostname. */
export const deviceTitle = (device: { label: string | null; hostname: string }) => device.label ?? device.hostname;

/** Who connected in a session, as the customer should see it: the team member's name, else what their app called itself. */
export const sessionPeerName = (s: { staffName: string | null; peerName: string | null; peerDeskId: string | null }) =>
  s.staffName ?? (s.peerName || s.peerDeskId || "Bilinmeyen");

const DESK_ID_GROUP = 3;
/** "201369773" → "201 369 773" */
export const formatDeskId = (deskId: string) => deskId.match(new RegExp(`.{1,${DESK_ID_GROUP}}`, "g"))?.join(" ") ?? deskId;
