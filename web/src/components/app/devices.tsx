import Link from "next/link";
import { CONNECTION_KIND_LABELS, connectHref, formatDeskId, platformLabel } from "@/features/devices/labels";
import type { ConnectionRow, DeviceRow } from "@/features/devices/queries";
import { formatDateTime } from "@/lib/format";
import { Icon } from "./Icon";

const onlineText = (online: boolean | null) => (online === null ? "Durum bilinmiyor" : online ? "Çevrimiçi" : "Çevrimdışı");

function DeviceIcon({ online }: { online: boolean | null }) {
  const state = online === null ? "unknown" : online ? "online" : "offline";
  return (
    <span className="w-icon desk-icon">
      <Icon name="monitor" size={18} />
      <span className={`desk-dot is-${state}`} title={onlineText(online)}>{online === null ? "?" : null}</span>
    </span>
  );
}

type DeviceListProps = {
  devices: DeviceRow[];
  audience: "staff" | "customer";
  showCompany?: boolean;
  removeAction?: (deviceId: string) => () => Promise<void>;
};

export function DeviceList({ devices, audience, showCompany = false, removeAction }: DeviceListProps) {
  return (
    <ul className="w-list">
      {devices.length === 0 && (
        <li className="empty-row">
          {audience === "staff" ? "Kayıtlı cihaz yok." : "Henüz kayıtlı bilgisayarınız yok. GoTech Desk'i kurup müşteri numaranızı girdiğinizde burada görünür."}
        </li>
      )}
      {devices.map((device) => (
        <li key={device.id} className="w-row desk-row">
          <DeviceIcon online={device.online} />
          <span className="w-row-main">
            <strong>{device.hostname}</strong>
            <small>
              {onlineText(device.online)}, <span className="desk-id">{formatDeskId(device.deskId)}</span>, {platformLabel(device.platform)} {device.appVersion}
              {showCompany && (
                <>, <Link className="desk-company" href={`/yonetim/musteriler/${device.companyId}`}>{device.companyName}</Link></>
              )}
            </small>
            <small>Son kayıt: {formatDateTime(device.lastRegisteredAt)}</small>
          </span>
          <span className="row-actions">
            {audience === "staff" ? (
              <>
                {device.unattended && <span className="badge is-active">Gözetimsiz</span>}
                <a className="btn btn-small" href={connectHref(device.id, "connect")} rel="noreferrer">Bağlan</a>
                <a className="btn btn-ghost btn-small" href={connectHref(device.id, "file")} rel="noreferrer">Dosya</a>
                {removeAction && (
                  <form action={removeAction(device.id)}>
                    <button className="btn btn-ghost btn-small" type="submit" title="Cihazı listeden kaldır">Kaldır</button>
                  </form>
                )}
              </>
            ) : (
              <span className={`badge${device.unattended ? " is-active" : ""}`}>Gözetimsiz erişim {device.unattended ? "açık" : "kapalı"}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ConnectionList({ connections }: { connections: ConnectionRow[] }) {
  return (
    <ul className="w-list">
      {connections.length === 0 && <li className="empty-row">Henüz bağlantı yapılmadı.</li>}
      {connections.map((c) => (
        <li key={c.id} className="w-row">
          <span className="w-icon"><Icon name={c.kind === "connect" ? "monitor" : "file"} size={18} /></span>
          <span className="w-row-main">
            <strong>{c.userName}, {CONNECTION_KIND_LABELS[c.kind]}</strong>
            <small>
              {c.hostname} ({formatDeskId(c.deskId)}), <Link className="desk-company" href={`/yonetim/musteriler/${c.companyId}`}>{c.companyName}</Link>
            </small>
          </span>
          <span className="w-row-side"><small>{formatDateTime(c.createdAt)}</small></span>
        </li>
      ))}
    </ul>
  );
}

export function StatusUnknownNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return <p className="notice desk-notice">GoTech Desk sunucusuna ulaşılamadı, çevrimiçi durumu şu an bilinmiyor.</p>;
}
