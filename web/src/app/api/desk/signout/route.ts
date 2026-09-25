import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { devices } from "@/db/schema";
import { notRegistered, readDeskRequest } from "@/features/devices/api-http";
import { sessionsSchema } from "@/features/devices/api-schemas";
import { authenticateDevice } from "@/features/devices/device-auth";
import { deviceHref } from "@/features/devices/labels";

// "Çıkış yap" in the app: the computer drops its registration, as "Kaldır" on the devices page would, so the next
// person to sign in on it starts clean. Only the computer itself can do this, with the device token it was given.
const SIGNOUTS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "signout", perMinute: SIGNOUTS_PER_MINUTE }, sessionsSchema);
  if ("response" in input) return input.response;

  const device = await authenticateDevice(input.data.deskId, input.data.deviceToken);
  if (!device) return notRegistered();

  const db = await getDb();
  await db.delete(devices).where(eq(devices.id, device.id));
  revalidatePath("/yonetim/cihazlar");
  revalidatePath(deviceHref(device.id));
  revalidatePath(`/yonetim/musteriler/${device.companyId}`);
  revalidatePath("/panel/uzak-destek");
  return Response.json({ ok: true });
}
