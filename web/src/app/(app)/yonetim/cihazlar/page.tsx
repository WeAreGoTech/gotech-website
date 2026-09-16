import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { ConnectionList, DeviceList, StatusUnknownNotice } from "@/components/app/devices";
import { removeDevice } from "@/features/devices/actions";
import { listDevices, listRecentConnections } from "@/features/devices/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Cihazlar" };

export default async function DevicesPage() {
  await requireStaff();
  const [{ devices, statusKnown }, connections] = await Promise.all([listDevices(), listRecentConnections()]);
  const onlineCount = devices.filter((d) => d.online).length;

  return (
    <>
      <PageHeader
        title="Cihazlar"
        description={`GoTech Desk kurulu müşteri bilgisayarları${statusKnown ? `, ${onlineCount} tanesi çevrimiçi` : ""}. Bağlan uzak masaüstünü, Dosya dosya aktarımını açar; kişi ve etiket için cihazın adına tıklayın.`}
      />
      <StatusUnknownNotice show={!statusKnown} />
      <Section title="Tüm cihazlar">
        <DeviceList devices={devices} audience="staff" showCompany removeAction={(deviceId) => removeDevice.bind(null, deviceId)} />
      </Section>
      <Section title="Son bağlantılar">
        <ConnectionList connections={connections} />
      </Section>
    </>
  );
}
