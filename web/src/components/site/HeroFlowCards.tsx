import type { CSSProperties, ReactNode } from "react";

// Small product screens shown on the hero rail. Two-state values (".off"/".on") roll over when the packet arrives.
const vars = (values: Record<string, string>) => values as CSSProperties;

function Swap({ from, to, className = "" }: { from: ReactNode; to: ReactNode; className?: string }) {
  return (
    <span className={`swap ${className}`}>
      <span className="off">{from}</span>
      <span className="on">{to}</span>
    </span>
  );
}

export function OrderCard() {
  return (
    <div className="b-card">
      <div className="bc-head"><span className="bc-title">Sipariş #1042</span><Swap className="bc-pill" from="Web sitesinden" to="Kaydedildi" /></div>
      <div className="bc-person"><span className="bc-avatar">AK</span><span>Ayşe Kaya<small>Kadıköy, İstanbul</small></span></div>
      <ul className="bc-items"><li><span>Kavrulmuş kahve, 1 kg</span><span>2 × ₺520</span></li><li><span>Filtre kağıdı</span><span>1 × ₺200</span></li></ul>
      <div className="bc-total"><span>Toplam</span><strong>₺1.240</strong></div>
    </div>
  );
}

export function StockCard() {
  return (
    <div className="b-card">
      <div className="bc-head"><span className="bc-title">Stok</span><span className="bc-sub">Ana depo</span></div>
      <div className="bc-stock">
        <div className="bc-row"><span>Kavrulmuş kahve, 1 kg</span><Swap className="num" from="88 adet" to="86 adet" /></div>
        <div className="bc-meter"><i style={vars({ "--from": "74%", "--to": "72%" })} /></div>
      </div>
      <div className="bc-stock is-low">
        <div className="bc-row"><span>Filtre kağıdı</span><Swap className="num" from="10 adet" to="9 adet" /></div>
        <div className="bc-meter"><i style={vars({ "--from": "16%", "--to": "13%" })} /></div>
      </div>
      <div className="bc-alert"><div><p>Filtre kağıdı azaldı. Tedarikçiye sipariş taslağı hazır.</p></div></div>
    </div>
  );
}

export function InvoiceCard() {
  return (
    <div className="b-card">
      <div className="bc-head"><span className="bc-title">e-Fatura</span><Swap className="bc-pill" from="Hazırlanıyor" to="Gönderildi" /></div>
      <dl className="bc-dl">
        <div><dt>Fatura no</dt><dd>GT2026000118</dd></div>
        <div><dt>Alıcı</dt><dd>Ayşe Kaya</dd></div>
        <div><dt>Tarih</dt><dd>16.09.2026</dd></div>
      </dl>
      <ul className="bc-items"><li><span>Kavrulmuş kahve, 1 kg × 2</span><span>₺1.040</span></li><li><span>Filtre kağıdı × 1</span><span>₺200</span></li></ul>
      <div className="bc-total"><span>KDV dahil</span><strong>₺1.240,00</strong></div>
    </div>
  );
}

const CHART_BARS = ["42%", "58%", "36%", "71%", "63%", "80%"];

export function ReportCard() {
  return (
    <div className="b-card">
      <div className="bc-head"><span className="bc-title">Bugünkü satış</span><span className="bc-sub">16 Eylül</span></div>
      <div className="bc-kpi">
        <strong><Swap from="₺17.220" to="₺18.460" /></strong>
        <small>Geçen haftanın aynı gününe göre %8 fazla</small>
      </div>
      <div className="bc-chart">
        {CHART_BARS.map((h, i) => <i key={i} style={vars({ "--h": h })} />)}
        <i className="is-today" style={vars({ "--h": "70%", "--h2": "92%" })} />
      </div>
    </div>
  );
}
