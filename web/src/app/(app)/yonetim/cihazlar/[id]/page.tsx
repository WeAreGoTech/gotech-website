import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackButton } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { DeviceHeader } from "@/components/app/device-detail";
import { DeviceAssignmentForm } from "@/components/app/device-forms";
import { ConnectionList, DevicePerson, SessionList, StatusUnknownNotice } from "@/components/app/devices";
import { DetailRows } from "@/components/app/ticket-detail";
import { listCompanyPeople } from "@/features/customers/queries";
import { removeDevice, updateDeviceAssignment } from "@/features/devices/actions";
import { getDeviceView, listDeviceConnections } from "@/features/devices/queries";
import { listDeviceSessions } from "@/features/devices/sessions";
import { requireStaff } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Cihaz" };

export default async function DevicePage({ params }: PageProps<"/yonetim/cihazlar/[id]">) {
  await requireStaff();
  const { id } = await params;
  const view = z.uuid().safeParse(id).success ? await getDeviceView(id) : null;
  if (!view) notFound();

  const { device, statusKnown } = view;
  const [people, connections, sessions] = await Promise.all([
    listCompanyPeople(device.companyId),
    listDeviceConnections(device.id),
    listDeviceSessions(device.id),
  ]);

  return (
    <>
      <BackButton href="/yonetim/cihazlar" label="Cihazlara dön" />
      <DeviceHeader device={device} />
      <StatusUnknownNotice show={!statusKnown} />
      <div className="t-layout">
        <div>
          <Section title="Oturumlar">
            <SessionList sessions={sessions} showDevice={false} />
          </Section>
          <Section title="Panelden bağlanma geçmişi">
            <ConnectionList connections={connections} showDevice={false} />
          </Section>
        </div>
        <aside className="t-side">
          <DeviceAssignmentForm
            action={updateDeviceAssignment.bind(null, device.id)}
            people={people.map((p) => ({ id: p.id, name: p.name }))}
            userId={device.userId}
            contactName={device.contactName}
            label={device.label}
          />
          <DetailRows
            compact
            rows={[
              ["Kişi", <DevicePerson key="person" device={device} audience="staff" />],
              ["Etiket", device.label ?? "—"],
              ["Bilgisayar adı", device.hostname],
              ["İlk kayıt", formatDateTime(device.registeredAt)],
              ["Son görülme", formatDateTime(device.lastRegisteredAt)],
            ]}
          >
            <form action={removeDevice.bind(null, device.id, true)} style={{ marginTop: 18 }}>
              <button className="btn btn-ghost" type="submit" style={{ width: "100%" }}>Cihazı kaldır</button>
            </form>
          </DetailRows>
        </aside>
      </div>
    </>
  );
}
