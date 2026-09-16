import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { DeviceList, StatusUnknownNotice } from "@/components/app/devices";
import { Icon } from "@/components/app/Icon";
import { getCompany } from "@/features/customers/queries";
import { claimDevice } from "@/features/devices/actions";
import { listDevices } from "@/features/devices/queries";
import { requireCustomer } from "@/lib/auth/session";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Uzak destek" };

const DOWNLOADS = [
  { url: env.desk.downloadWindowsUrl, label: "Windows için indir", className: "btn" },
  { url: env.desk.downloadMacUrl, label: "macOS için indir", className: "btn btn-ghost" },
];

export default async function RemoteSupportPage() {
  const user = await requireCustomer();
  const [company, { devices, statusKnown }] = await Promise.all([getCompany(user.companyId), listDevices(user.companyId)]);
  const downloads = DOWNLOADS.filter((d) => d.url);
  const mine = devices.filter((d) => d.userId === user.id);
  const others = devices.filter((d) => d.userId !== user.id);
  const claim = (deviceId: string) => claimDevice.bind(null, deviceId);

  return (
    <>
      <PageHeader title="Uzak destek" description="GoTech Desk ile ekibimiz, izin verdiğiniz bilgisayarlara bağlanıp sorunları yerinde çözer." />
      <div className="two-col">
        <section className="desk-code" aria-labelledby="desk-code-label">
          <div>
            <span className="desk-code-label" id="desk-code-label">Firma kodunuz</span>
            <p className="desk-code-value">{company?.customerCode}</p>
          </div>
          <ol className="desk-steps">
            <li>GoTech Desk&apos;i bilgisayarınıza indirip kurun.</li>
            <li>Açılışta firma kodunu girin ve listeden adınızı seçin. Bilgisayarınız aşağıdaki listeye eklenir.</li>
            <li>
              Destek gerektiğinde bizi arayın ya da <Link href="/panel/talep/yeni">destek talebi oluşturun</Link>.
            </li>
          </ol>
          {downloads.length > 0 && (
            <div className="desk-downloads">
              {downloads.map((d) => (
                <a key={d.label} className={d.className} href={d.url}>
                  <Icon name="download" size={18} />
                  {d.label}
                </a>
              ))}
            </div>
          )}
        </section>
        <div>
          <StatusUnknownNotice show={!statusKnown} />
          <Section title="Benim bilgisayarlarım">
            <DeviceList
              devices={mine}
              audience="customer"
              emptyText="Size bağlı bilgisayar yok. GoTech Desk'i kurup firma kodunu girin ve listeden adınızı seçin ya da aşağıdan bilgisayarınızı sahiplenin."
            />
          </Section>
          <Section title="Firmadaki diğer bilgisayarlar">
            <DeviceList devices={others} audience="customer" emptyText="Firmada başka kayıtlı bilgisayar yok." claimAction={claim} />
          </Section>
        </div>
      </div>
    </>
  );
}
