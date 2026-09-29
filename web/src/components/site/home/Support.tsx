/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
"use client";

import { useState } from "react";
import { HOME_SUPPORT, PHONE_CHANNEL_IMAGE, PORTAL_HREF, SUPPORT_CHANNELS, TAKEOVER, type SupportChannel } from "../content";
import { cx, Go, Head, telHref } from "../ui/parts";
import { LiveHours } from "./LiveHours";
import u from "./support.module.css";

type Props = { hours: string; phone: string };

/**
 * Destek: solda kanallar (seçilen açılır, solunda kırmızı çizgi), sağda seçilen kanalın fotoğrafı büyük.
 * Altında başka iş ortağından devir için tek satır. Ana sayfa ve /hizmetlerimiz'de aynı.
 */
export function Support({ hours, phone }: Props) {
  const channels: SupportChannel[] = [
    ...SUPPORT_CHANNELS,
    ...(phone ? [{ id: "telefon", title: "Telefon", body: `Destek hattımızı arayabilirsiniz: ${phone}`, note: hours, image: PHONE_CHANNEL_IMAGE }] : []),
  ];
  const [active, setActive] = useState(channels[0].id);

  return (
    <section className="sec sec-line" id="destek">
      <div className="wrap">
        <div className="split">
          <Head label={HOME_SUPPORT.label} title={HOME_SUPPORT.title} />
          <div className="split-side">
            <p className="lede" data-reveal="">{HOME_SUPPORT.body}</p>
            <LiveHours hours={hours} />
          </div>
        </div>

        <div className={u.help}>
          <div className={u.list}>
            {channels.map((ch) => {
              const open = ch.id === active;
              return (
                <div key={ch.id} className={cx(u.item, open && u.open)} data-reveal="">
                  <button type="button" className={u.head} aria-expanded={open} aria-controls={`kanal-${ch.id}`} onClick={() => setActive(ch.id)}>
                    <span className={u.title}>{ch.title}</span>
                    <span className={u.note}>{ch.note}</span>
                  </button>
                  <div className={u.body} id={`kanal-${ch.id}`} role="region" aria-label={ch.title} inert={!open}>
                    <div className={u.inner}>
                      <p>
                        {ch.id === "telefon" ? <>Destek hattımızı arayabilirsiniz: <a href={telHref(phone)}>{phone}</a></> : ch.body}
                      </p>
                      {ch.id === "portal" && <Go link={{ label: "Destek portalına girin", href: PORTAL_HREF }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={u.media} aria-hidden="true" data-media="">
            {channels.map((ch) => (
              <img key={ch.id} src={ch.image.src} alt="" width={960} height={640} loading="lazy" data-on={ch.id === active ? "" : undefined} />
            ))}
          </div>
        </div>

        <div className={u.takeover} data-reveal="">
          <p>
            <b>{TAKEOVER.title}</b> {TAKEOVER.body}
          </p>
          <Go link={TAKEOVER.link} />
        </div>
      </div>
    </section>
  );
}
