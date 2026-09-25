import { KIND_LABEL, WORKS, type WorkKind } from "./content";
import s from "./yazilim.module.css";

const KINDS: WorkKind[] = ["mikro", "bagimsiz"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Geliştirdiğimiz yazılım türleri: iki grup (Mikro'ya bağlı / Mikro'dan bağımsız), her grupta numaralı liste. */
export function WorkIndex() {
  return (
    <div className={s.works}>
      {KINDS.map((kind) => (
        <section key={kind} className={s.group} aria-label={KIND_LABEL[kind]}>
          <p className={s.groupHead}>{KIND_LABEL[kind]}</p>
          <ol className={s.workList}>
            {WORKS.filter((w) => w.kind === kind).map((w) => (
              <li key={w.title}>
                <span className={s.workNum}>{pad(WORKS.indexOf(w) + 1)}</span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
