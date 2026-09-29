import { HOME_INTRO } from "../content";
import { cx, Go, Label, typo } from "../ui/parts";
import s from "./home.module.css";

/** Kısa tanıtım: kim olduğumuzu düz bir paragrafla söyler; kaydırdıkça kelimeler koyulaşır. */
export function Intro() {
  return (
    <section className={cx("sec", s.intro)} aria-label="GoTech hakkında">
      <div className={cx("wrap", s.introIn)}>
        <Label className={s.introLabel}>{HOME_INTRO.label}</Label>
        <div className={s.introBody}>
          <p className={s.statement} data-words="">{typo(HOME_INTRO.text)}</p>
          <Go link={HOME_INTRO.link} reveal />
        </div>
      </div>
    </section>
  );
}
