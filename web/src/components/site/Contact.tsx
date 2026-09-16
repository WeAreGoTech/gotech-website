import "./closing.css";
import { ContactForm } from "./ContactForm";
import { CONTACT_INFO } from "./content";

export function Contact() {
  return (
    <section className="section contact" id="iletisim" data-nav-tone="dark">
      <div className="contact-grid">
        <div className="contact-intro">
          <h2 className="contact-title">Projenizi anlatın.</h2>
          <p className="lede">Formu doldurun, işinizi konuşmak için size dönelim. Aceleniz varsa doğrudan arayabilirsiniz.</p>
          <dl className="contact-info">
            {CONTACT_INFO.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="form-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
