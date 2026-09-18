import { formatDeskId } from "@/features/devices/labels";
import { removeStaffDevice } from "@/features/devices/staff-device-actions";
import { listMyStaffDevices, type StaffDeviceRow } from "@/features/devices/staff-devices";
import { DeviceIcon, onlineText } from "./devices";
import { Icon } from "./Icon";
import { AddStaffDeviceForm } from "./staff-device-forms";

const LOCK_EXPLANATION =
  "Müşteri uygulaması kendini GoTech'e kilitlediğinde, o bilgisayara yalnızca bu listedeki GoTech bilgisayarları bağlanabilir. " +
  "GoTech Desk'e bu hesapla giriş yaptığınız bilgisayar buraya kendiliğinden eklenir; giriş yapılamayan uygulamaları (ör. resmi RustDesk) elle ekleyin.";

/** Team computers on the devices page, so staff can connect to each other's the same way they connect to a customer's. */
export function TeamDeviceList({ devices, online }: { devices: StaffDeviceRow[]; online: Map<string, boolean> | null }) {
  return (
    <ul className="w-list">
      {devices.length === 0 && (
        <li className="empty-row">Ekip bilgisayarı yok. GoTech Desk&apos;e ekip hesabıyla giriş yapılan bilgisayarlar burada görünür.</li>
      )}
      {devices.map((device) => {
        const isOnline = online ? (online.get(device.deskId) ?? false) : null;
        return (
          <li key={device.id} className="w-row desk-row">
            <DeviceIcon online={isOnline} />
            <span className="w-row-main">
              <strong>{device.label}</strong>
              <small>
                {onlineText(isOnline)}, <span className="desk-id">{formatDeskId(device.deskId)}</span>, {device.ownerName}
              </small>
            </span>
            <span className="row-actions">
              {/* no stored password for a team computer: the app asks for one, or its owner accepts */}
              <a className="btn btn-small" href={`gotechdesk://connect/${device.deskId}`} rel="noreferrer">Bağlan</a>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** GoTech computers; "mine" swaps the owner's name for a remove button. */
export function StaffDeviceList({ devices, mine = false }: { devices: StaffDeviceRow[]; mine?: boolean }) {
  return (
    <ul className="w-list">
      {devices.length === 0 && (
        <li className="empty-row">{mine ? "Henüz bilgisayar eklemediniz." : "Ekipte kayıtlı GoTech Desk bilgisayarı yok."}</li>
      )}
      {devices.map((device) => (
        <li key={device.id} className="w-row">
          <span className="w-icon"><Icon name="monitor" size={18} /></span>
          <span className="w-row-main">
            <strong>{device.label}</strong>
            <small>
              <span className="desk-id">{formatDeskId(device.deskId)}</span>
              {!mine && <>, {device.ownerName}</>}
            </small>
          </span>
          {mine && (
            <span className="row-actions">
              <form action={removeStaffDevice.bind(null, device.id)}>
                <button className="btn btn-ghost btn-small" type="submit" title="Bilgisayarı listeden kaldır">Kaldır</button>
              </form>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Card on /yonetim/hesap where a team member keeps their own computers. */
export async function MyStaffDevicesCard({ userId }: { userId: string }) {
  const devices = await listMyStaffDevices(userId);
  return (
    <section className="card form-stack">
      <h2>GoTech Desk bilgisayarlarım</h2>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>{LOCK_EXPLANATION}</p>
      <StaffDeviceList devices={devices} mine />
      <AddStaffDeviceForm />
    </section>
  );
}
