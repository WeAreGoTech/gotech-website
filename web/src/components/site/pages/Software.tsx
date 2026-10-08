/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
// /yazilim-cozumleri: iş türleri (süzgeçli), çalışma biçimi, ilkeler, referans.

import { REFERENCES } from "@/components/kurumsal/referanslar";
import { SOFTWARE_STEPS } from "@/components/yazilim/content";
import { SOFTWARE_TOPICS } from "../content";
import { cx, Head, typo } from "../ui/parts";
import p from "../ui/page.module.css";
import w from "./software.module.css";
import { WorkList } from "./WorkList";

const pad = (n: number) => String(n).padStart(2, "0");

export function Works() {
  return (
    <section className="sec sec-line" id="isler">
      <div className="wrap">
        <div className="split">
          <Head label="Çözümlerimiz" title="Mikro'ya özel geliştirmeler, web ve portal projeleri" />
          <p className="lede split-side" data-reveal="">
            Mikro&apos;ya özel ekran ve rapor geliştirmelerinin yanında kurumsal web sitesi, e-ticaret ve portal projelerini kendi yazılım ekibimizle yürütüyoruz.
          </p>
        </div>
        <WorkList />
      </div>
    </section>
  );
}

/** Nasıl çalışıyoruz: altı adım, üç sütun, kutusuz. */
export function Steps() {
  return (
    <section className="sec sec-line" id="nasil">
      <div className="wrap">
        <div className="split">
          <Head label="Proje süreci" title="Ön görüşmeden yayın sonrası desteğe" />
          <p className="lede split-side" data-reveal="">Yazılım projelerimiz aşağıdaki adımlarla yürütülür. Proje takvimi, kapsam belirlendikten sonra teklifle birlikte sunulur.</p>
        </div>
        <ol className={w.steps}>
          {SOFTWARE_STEPS.map((step, i) => (
            <li key={step.title} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <span className={w.stepNum}>{pad(i + 1)}</span>
              <h3 className="h3">{typo(step.title)}</h3>
              <p>{step.body}</p>
              <ul className={cx("ticks", w.stepScope)}>{step.scope.map((x) => <li key={x}>{x}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** İşin başında birlikte karar verilen konular: soru solda, açıklama sağda. */
export function Approach() {
  return (
    <section className="sec sec-line" id="ilkeler">
      <div className={cx("wrap", w.approach)}>
        <Head label={SOFTWARE_TOPICS.label} title={SOFTWARE_TOPICS.title} />
        <ul className={p.rows}>
          {SOFTWARE_TOPICS.items.map((a) => (
            <li key={a.title} className={p.row} data-reveal="">
              <i className={p.rule} data-draw="" aria-hidden="true" />
              <h3 className={p.rowTitle}>{typo(a.title)}</h3>
              <div className={p.rowBody}><p>{a.body}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Referans: özel yazılım geliştirdiğimiz kurum (yalnız GoTech'in onayladığı gerçek müşteriler). */
export function Reference() {
  return (
    <section className="sec sec-line" id="referans">
      <div className="wrap">
        {REFERENCES.map((ref) => (
          <div key={ref.name} className={w.ref}>
            <p className="label" data-reveal=""><span className="plus" aria-hidden="true" />Referans</p>
            <img className={w.refLogo} src={ref.logo.src} alt={ref.name} width={ref.logo.width} height={ref.logo.height} loading="lazy" data-reveal="" />
            <div className={w.refText} data-reveal="">
              <p className={w.refSector}>{ref.sector}</p>
              <p>{ref.work}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
