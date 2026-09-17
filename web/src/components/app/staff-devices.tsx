import { formatDeskId } from "@/features/devices/labels";
import { removeStaffDevice } from "@/features/devices/staff-device-actions";
import { listMyStaffDevices, type StaffDeviceRow } from "@/features/devices/staff-devices";
import { Icon } from "./Icon";
import { AddStaffDeviceForm } from "./staff-device-forms";

const LOCK_EXPLANATION =
  "Müşteri uygulaması kendini GoTech'e kilitlediğinde, o bilgisayara yalnızca bu listedeki GoTech bilgisayarları bağlanabilir.";

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
