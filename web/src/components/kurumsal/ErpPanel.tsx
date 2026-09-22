import { PANEL_IDLE_MODULES, PANEL_MODULES } from "./erp-panel-data";

// Temsili Mikro Jump ekranı. Hangi modülün açık olduğunu akış bölümü söylüyor;
// bileşenin kendi zamanlayıcısı yok.
export function ErpPanel({ active }: { active: number }) {
  const current = PANEL_MODULES[active] ?? PANEL_MODULES[0];

  return (
    <div className="panel" aria-hidden="true">
      <div className="panel-bar">
        <i />
        <i />
        <i />
        <span>Mikro Jump — {current.name}</span>
      </div>
      <div className="panel-body">
        <div className="panel-side">
          <b>MODÜLLER</b>
          {PANEL_MODULES.map((item, index) => (
            <u key={item.name} className={index === active ? "on" : undefined}>{item.name}</u>
          ))}
          {PANEL_IDLE_MODULES.map((name) => (
            <u key={name}>{name}</u>
          ))}
        </div>
        <div className="panel-main" key={active}>
          <div className="kpis">
            {current.kpis.map((kpi) => (
              <div className="kpi" key={kpi.label}>
                <span>{kpi.label}</span>
                <strong>{kpi.value}</strong>
              </div>
            ))}
          </div>
          <div className="tbl">
            <div className="hd">
              {current.columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            {current.rows.map((row) => (
              <div key={row.a} className={row.hot ? "hot" : undefined}>
                <span>{row.a}</span>
                <span>{row.b}</span>
                {row.hot ? <em>{row.tag}</em> : <span>{row.tag}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
