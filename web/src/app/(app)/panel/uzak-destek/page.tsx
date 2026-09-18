import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { DeviceList, StatusUnknownNotice } from "@/components/app/devices";
import { Icon } from "@/components/app/Icon";
import { getCompany } from "@/features/customers/queries";
import { claimDevice } from "@/features/devices/actions";
import { installerHref, installerUrl, type DeskPlatform } from "@/features/devices/downloads";
import { listDevices } from "@/features/devices/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Uzak destek" };

const DOWNLOADS: { platform: DeskPlatform; label: string; className: string }[] = [
  { platform: "windows", label: "Windows için indir", className: "btn" },
  { platform: "mac", label: "macOS için indir", className: "btn btn-ghost" },
];

export default async function RemoteSupportPage() {
  const user = await requireCustomer();
  const [company, { devices, statusKnown }] = await Promise.all([getCompany(user.companyId), listDevices(user.companyId)]);
  const customerCode = company?.customerCode;
  // the file the customer gets is named after their company, so the app knows the code before it starts
  const downloads = customerCode
    ? DOWNLOADS.filter((d) => installerUrl(d.platform)).map((d) => ({ ...d, href: installerHref(d.platform, customerCode) }))
    : [];
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
            <p className="desk-code-value">{customerCode}</p>
          </div>
          <ol className="desk-steps">
            <li>GoTech Desk&apos;i bilgisayarınıza indirip kurun.</li>
            <li>
              Açılışta bu panelin e-posta ve şifresiyle giriş yapın; bilgisayarınız aşağıdaki listeye adınızla eklenir. Hesabı olmayan
              çalışanlarınız ya da ortak bilgisayarlar için &quot;Firma koduyla kaydolun&quot; deyip yukarıdaki kodu girin.
            </li>
            <li>
              Destek gerektiğinde uygulamadaki &quot;Destek iste&quot; düğmesine basın, bizi arayın ya da{" "}
              <Link href="/panel/talep/yeni">destek talebi oluşturun</Link>.
            </li>
          </ol>
          {downloads.length > 0 && (
            <div className="desk-downloads">
              {downloads.map((d) => (
                <a key={d.platform} className={d.className} href={d.href}>
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
              emptyText="Size bağlı bilgisayar yok. GoTech Desk'i kurup bu hesapla giriş yapın ya da aşağıdan bilgisayarınızı sahiplenin."
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
