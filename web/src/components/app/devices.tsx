import Link from "next/link";
import { DESK_PLATFORMS, DESK_PLATFORM_LABELS, installerLink, installerUrl } from "@/features/devices/downloads";
import { CONNECTION_KIND_LABELS, connectHref, deviceHref, deviceTitle, formatDeskId, platformLabel } from "@/features/devices/labels";
import type { ConnectionRow, DeviceRow } from "@/features/devices/queries";
import { formatDateTime } from "@/lib/format";
import { Icon } from "./Icon";

type Audience = "staff" | "customer";
type RowAction = (deviceId: string) => () => Promise<void>;

export const onlineText = (online: boolean | null) => (online === null ? "Durum bilinmiyor" : online ? "Çevrimiçi" : "Çevrimdışı");

export function DeviceIcon({ online }: { online: boolean | null }) {
  const state = online === null ? "unknown" : online ? "online" : "offline";
  return (
    <span className="w-icon desk-icon">
      <Icon name="monitor" size={18} />
      <span className={`desk-dot is-${state}`} title={onlineText(online)}>{online === null ? "?" : null}</span>
    </span>
  );
}

/** Linked panel user or the name typed in the app; staff also sees when that person has no panel account or left the company. */
export function DevicePerson({ device, audience }: { device: Pick<DeviceRow, "personName" | "personIsUser" | "personRemoved">; audience: Audience }) {
  if (!device.personName) return <>—</>;
  return (
    <>
      {device.personName}
      {audience === "staff" && !device.personIsUser && <span className="desk-hint"> (panelde yok)</span>}
      {audience === "staff" && device.personRemoved && <span className="desk-hint"> (çıkarıldı)</span>}
    </>
  );
}

export function ConnectButtons({ deviceId, ticketNumber }: { deviceId: string; ticketNumber?: number }) {
  return (
    <>
      <a className="btn btn-small" href={connectHref(deviceId, "connect", ticketNumber)} rel="noreferrer">Bağlan</a>
      <a className="btn btn-ghost btn-small" href={connectHref(deviceId, "file", ticketNumber)} rel="noreferrer">Dosya</a>
    </>
  );
}

type DeviceListProps = {
  devices: DeviceRow[];
  audience: Audience;
  emptyText?: string;
  showCompany?: boolean;
  removeAction?: RowAction;
  claimAction?: RowAction;
};

const DEFAULT_EMPTY: Record<Audience, string> = {
  staff: "Kayıtlı cihaz yok.",
  customer: "Henüz kayıtlı bilgisayar yok. GoTech Desk'i kurup panel hesabınızla giriş yaptığınızda burada görünür.",
};

export function DeviceList({ devices, audience, emptyText, showCompany = false, removeAction, claimAction }: DeviceListProps) {
  return (
    <ul className="w-list">
      {devices.length === 0 && <li className="empty-row">{emptyText ?? DEFAULT_EMPTY[audience]}</li>}
      {devices.map((device) => (
        <li key={device.id} className="w-row desk-row">
          <DeviceIcon online={device.online} />
          <span className="w-row-main">
            <strong>{audience === "staff" ? <Link href={deviceHref(device.id)}>{deviceTitle(device)}</Link> : deviceTitle(device)}</strong>
            <small>
              {device.label && <>{device.hostname}, </>}
              {onlineText(device.online)}, <span className="desk-id">{formatDeskId(device.deskId)}</span>, {platformLabel(device.platform)} {device.appVersion}
              {showCompany && (
                <>, <Link className="desk-company" href={`/yonetim/musteriler/${device.companyId}`}>{device.companyName}</Link></>
              )}
            </small>
            <small>
              Kişi: <DevicePerson device={device} audience={audience} />, son kayıt: {formatDateTime(device.lastRegisteredAt)}
            </small>
          </span>
          <span className="row-actions">
            {audience === "staff" ? (
              <>
                {device.unattended && <span className="badge is-active">Gözetimsiz</span>}
                <ConnectButtons deviceId={device.id} />
                {removeAction && (
                  <form action={removeAction(device.id)}>
                    <button className="btn btn-ghost btn-small" type="submit" title="Cihazı listeden kaldır">Kaldır</button>
                  </form>
                )}
              </>
            ) : (
              <>
                {claimAction && !device.userId && (
                  <form action={claimAction(device.id)}>
                    <button className="btn btn-ghost btn-small" type="submit">Bu benim bilgisayarım</button>
                  </form>
                )}
                <span className={`badge${device.unattended ? " is-active" : ""}`}>Gözetimsiz erişim {device.unattended ? "açık" : "kapalı"}</span>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Connection log; showDevice=false on a device's own page, where every row is the same computer. */
export function ConnectionList({ connections, showDevice = true }: { connections: ConnectionRow[]; showDevice?: boolean }) {
  return (
    <ul className="w-list">
      {connections.length === 0 && <li className="empty-row">Henüz bağlantı yapılmadı.</li>}
      {connections.map((c) => (
        <li key={c.id} className="w-row">
          <span className="w-icon"><Icon name={c.kind === "connect" ? "monitor" : "file"} size={18} /></span>
          <span className="w-row-main">
            <strong>{c.userName}, {CONNECTION_KIND_LABELS[c.kind]}</strong>
            {(showDevice || c.ticketNumber !== null) && (
              <small>
                {showDevice && (
                  <>
                    <Link href={deviceHref(c.deviceId)}>{deviceTitle(c)}</Link> ({formatDeskId(c.deskId)}),{" "}
                    <Link className="desk-company" href={`/yonetim/musteriler/${c.companyId}`}>{c.companyName}</Link>
                  </>
                )}
                {showDevice && c.ticketNumber !== null && ", "}
                {c.ticketNumber !== null && <Link className="desk-company" href={`/yonetim/talep/${c.ticketNumber}`}>Talep #{c.ticketNumber}</Link>}
              </small>
            )}
          </span>
          <span className="w-row-side"><small>{formatDateTime(c.createdAt)}</small></span>
        </li>
      ))}
    </ul>
  );
}

/** The link staff send a customer: the installer arrives with their company code in its file name. */
export function InstallLinks({ customerCode }: { customerCode: string }) {
  const platforms = DESK_PLATFORMS.filter((platform) => installerUrl(platform));
  if (platforms.length === 0) return null;
  return (
    <div className="desk-install">
      <strong>Kurulum linki</strong>
      {platforms.map((platform) => (
        <span key={platform}>
          {DESK_PLATFORM_LABELS[platform]}: <code>{installerLink(platform, customerCode)}</code>
        </span>
      ))}
    </div>
  );
}

export function StatusUnknownNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return <p className="notice desk-notice">GoTech Desk sunucusuna ulaşılamadı, çevrimiçi durumu şu an bilinmiyor.</p>;
}
