import Link from "next/link";
import { connectHref, deviceHref, deviceTitle, formatDeskId, platformLabel } from "@/features/devices/labels";
import type { DeviceRow } from "@/features/devices/queries";
import { ConnectButtons, DeviceIcon, DevicePerson, onlineText } from "./devices";

/** Title block of a device's own page, with the connect buttons. */
export function DeviceHeader({ device }: { device: DeviceRow }) {
  return (
    <header className="t-head desk-head">
      <DeviceIcon online={device.online} />
      <div className="t-head-text">
        <h1>{deviceTitle(device)}</h1>
        <div className="t-meta">
          <span>{onlineText(device.online)}</span>
          <Link className="desk-company" href={`/yonetim/musteriler/${device.companyId}`}>{device.companyName}</Link>
          <span className="desk-id">{formatDeskId(device.deskId)}</span>
          <span>{platformLabel(device.platform)} {device.appVersion}</span>
          {device.unattended && <span className="badge is-active">Gözetimsiz</span>}
        </div>
      </div>
      <div className="desk-head-actions">
        <ConnectButtons deviceId={device.id} />
      </div>
    </header>
  );
}

function TicketDeviceRow({ device, ticketNumber, prominent }: { device: DeviceRow; ticketNumber: number; prominent?: boolean }) {
  return (
    <li className={`desk-ticket-row${prominent ? " is-prominent" : ""}`}>
      <DeviceIcon online={device.online} />
      <span className="w-row-main">
        <strong><Link href={deviceHref(device.id)}>{deviceTitle(device)}</Link></strong>
        <small>
          {onlineText(device.online)}, <DevicePerson device={device} audience="staff" />
        </small>
      </span>
      <span className="desk-ticket-actions">
        {prominent ? <ConnectButtons deviceId={device.id} ticketNumber={ticketNumber} /> : (
          <a className="btn btn-ghost btn-small" href={connectHref(device.id, "connect", ticketNumber)} rel="noreferrer">Bağlan</a>
        )}
      </span>
    </li>
  );
}

type TicketDevicesProps = { ticketNumber: number; device: DeviceRow | null; others: DeviceRow[]; statusKnown: boolean };

/** "Uzak destek" card on the staff ticket page: the computer the ticket came from, then the company's other computers. */
export function TicketDevices({ ticketNumber, device, others, statusKnown }: TicketDevicesProps) {
  return (
    <div className="card compact desk-ticket">
      <h2>Uzak destek</h2>
      {!statusKnown && <p className="desk-hint">Çevrimiçi durumu şu an bilinmiyor.</p>}
      {device ? (
        <ul className="desk-ticket-list">
          <TicketDeviceRow device={device} ticketNumber={ticketNumber} prominent />
        </ul>
      ) : (
        <p className="desk-hint">Bu talep bir bilgisayardan açılmadı.</p>
      )}
      {others.length > 0 && (
        <>
          <h3 className="desk-ticket-sub">Firmanın {device ? "diğer " : ""}cihazları</h3>
          <ul className="desk-ticket-list">
            {others.map((d) => <TicketDeviceRow key={d.id} device={d} ticketNumber={ticketNumber} />)}
          </ul>
        </>
      )}
    </div>
  );
}
