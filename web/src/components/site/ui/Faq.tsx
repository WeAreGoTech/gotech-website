import type { PageLinkData } from "@/components/home/parts";
import f from "./faq.module.css";
import { cx, Go, Head } from "./parts";

export type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  label?: string;
  title?: string;
  lede?: string;
  id?: string;
  link?: PageLinkData;
};

const ASK: PageLinkData = { label: "Bize yazın", href: "#iletisim", konu: "bilgi" };

/** SSS: solda başlık (yapışkan), sağda sorular. Yerel <details>: JS gerekmez, açılış yüksekliği CSS'le akar. */
export function Faq({
  items,
  label = "Sık sorulanlar",
  title = "Bize en çok sorulanlar",
  lede = "Burada olmayan bir sorunuz varsa bize yazın; çalışma saatlerinde cevaplıyoruz.",
  id = "sss",
  link = ASK,
}: Props) {
  return (
    <section className="sec sec-line" id={id}>
      <div className={cx("wrap", f.faq)}>
        <div className={f.side}>
          <Head label={label} title={title} lede={lede} />
          <Go link={link} reveal />
        </div>
        <div className={f.list}>
          {items.map((item) => (
            <details key={item.q} className={f.item} data-reveal="">
              <summary>
                <span>{item.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
