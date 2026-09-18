import "server-only";
import { listDevices } from "@/features/devices/queries";
import type { DeskAccountUser } from "./session";

// The app's address book, filled from the panel: staff see every customer computer, a customer sees
// their own company's. It is read-only — the app pushes edits back, and the panel ignores them.
type AbPeer = {
  id: string;
  hostname: string;
  platform: string;
  alias: string;
  username: string;
  tags: string[];
};

const personOf = (device: { personName: string | null; label: string | null }) =>
  device.personName ?? device.label ?? "";

export async function addressBookFor(user: DeskAccountUser) {
  // a customer account only ever sees its own company; staff see everything
  const { devices } = await listDevices(user.role === "staff" ? undefined : (user.companyId ?? undefined));

  // alias is the card's title, so it stays short: the person, or the computer when nobody is named.
  // The company is the tag, which is both the card's second line and the filter on the left.
  const peers: AbPeer[] = devices.map((device) => ({
    id: device.deskId,
    hostname: device.hostname,
    platform: device.platform,
    alias: personOf(device) || device.hostname,
    username: personOf(device),
    tags: [device.companyName],
  }));

  const tags = [...new Set(peers.flatMap((peer) => peer.tags))].sort((a, b) => a.localeCompare(b, "tr"));
  return { tags, peers, tag_colors: "{}" };
}
