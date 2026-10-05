/**
 * Grayscale, illustrative mini-interfaces for the Work panels.
 * They only hint at what each deliverable does — they are labelled "Illustrative UI"
 * and are not screenshots. The only numbers shown are ones stated in the résumé.
 */

const css = `
.mu{position:relative;width:100%;height:100%;border-radius:18px;background:var(--paper);box-shadow:var(--hair);overflow:hidden;font-family:var(--font-sans);color:var(--ink)}
.mu-bar{display:flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-bottom:1px solid var(--line);background:#fff}
.mu-bar i{width:8px;height:8px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px var(--line)}
.mu-bar span{margin-left:8px;font:500 10.5px/1 var(--font-mono);color:var(--mute)}
.mu-pad{position:absolute;inset:34px 0 0;padding:18px}
.mu-box{background:#fff;border-radius:12px;box-shadow:var(--hair)}
.mu-lbl{font:500 9.5px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.mu-sk{height:7px;border-radius:4px;background:var(--soft)}
@keyframes mu-flow{to{stroke-dashoffset:-24}}
@keyframes mu-pulse{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes mu-grow{from{transform:scaleY(.15)}}
@keyframes mu-growx{from{transform:scaleX(.1)}}
@keyframes mu-float{50%{transform:translate(var(--fx,2px),var(--fy,-3px))}}
@keyframes mu-scan{0%{top:12%}50%{top:78%}100%{top:12%}}
.mu-flow{stroke-dasharray:4 4;animation:mu-flow 1.2s linear infinite}
`;

function Bar({ title }: { title: string }) {
  return (
    <div className="mu-bar" aria-hidden="true">
      <i />
      <i />
      <i />
      <span>{title}</span>
    </div>
  );
}

function Pipeline() {
  const nodes = [
    { x: 8, y: 18, t: "Legacy" },
    { x: 8, y: 58, t: "Legacy" },
    { x: 40, y: 38, t: "ETL" },
    { x: 72, y: 18, t: "Ingest" },
    { x: 72, y: 58, t: "Transform" },
  ];
  return (
    <>
      <Bar title="fabric / pipelines" />
      <div className="mu-pad">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 18, width: "calc(100% - 36px)", height: "62%" }}>
          {[
            [26, 26, 40, 46],
            [26, 66, 40, 46],
            [58, 46, 72, 26],
            [58, 46, 72, 66],
          ].map(([a, b, c, d], i) => (
            <path key={i} d={`M${a} ${b} C ${(a + c) / 2} ${b}, ${(a + c) / 2} ${d}, ${c} ${d}`} fill="none" stroke="#0d0d0d" strokeOpacity=".5" strokeWidth=".5" className="mu-flow" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div key={i} className="mu-box" style={{ position: "absolute", left: `${n.x}%`, top: `${n.y * 0.62 + 4}%`, width: "20%", padding: "10px 10px" }}>
            <div className="mu-lbl">{n.t}</div>
            <div className="mu-sk" style={{ marginTop: 8, width: "80%" }} />
          </div>
        ))}
        <div className="mu-box" style={{ position: "absolute", left: 18, right: 18, bottom: 18, padding: 14, display: "flex", gap: 10, alignItems: "flex-end", height: "28%" }}>
          <div style={{ flex: 1 }}>
            <div className="mu-lbl">Data Warehouse</div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flex: 1, height: 26, borderRadius: 6, background: i === 2 ? "var(--ink)" : "var(--soft)", animation: `mu-pulse 2.4s ${(i * 0.4).toFixed(1)}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Migration() {
  return (
    <>
      <Bar title="workflow.xlsx → airflow" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="mu-box" style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: 16, gap: 3, alignContent: "start", opacity: 0.6 }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} style={{ background: i < 4 ? "var(--faint)" : "var(--soft)", borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["extract", "transform", "load", "report"].map((t, i) => (
            <div key={t} className="mu-box" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ink)", animation: `mu-pulse 2s ${(i * 0.35).toFixed(2)}s infinite` }} />
              <span className="mu-lbl" style={{ color: "var(--ink)" }}>{t}</span>
            </div>
          ))}
          <div className="mu-box" style={{ padding: 12, marginTop: "auto" }}>
            <div className="mu-lbl">Manual Excel work</div>
            <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: "var(--soft)" }}>
              <div style={{ width: "10%", height: "100%", borderRadius: 4, background: "var(--ink)", transformOrigin: "left", animation: "mu-growx 1.6s var(--ease) both" }} />
            </div>
            <div style={{ marginTop: 6, fontWeight: 700, fontSize: 20, letterSpacing: "-.04em" }}>−90%</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Clusters() {
  const groups = [
    { cx: 28, cy: 34, n: 9 },
    { cx: 70, cy: 30, n: 7 },
    { cx: 50, cy: 70, n: 10 },
  ];
  return (
    <>
      <Bar title="complaints / clusters" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateRows: "1fr auto", gap: 12 }}>
        <div className="mu-box" style={{ position: "relative" }}>
          {groups.map((g, gi) => (
            <div key={gi}>
              <span style={{ position: "absolute", left: `${g.cx}%`, top: `${g.cy}%`, width: 90, height: 90, margin: "-45px 0 0 -45px", borderRadius: "50%", boxShadow: "inset 0 0 0 1px var(--line)", background: "rgba(13,13,13,.025)" }} />
              {Array.from({ length: g.n }, (_, i) => {
                const a = (i / g.n) * Math.PI * 2 + gi;
                const r = 12 + ((i * 37) % 22);
                // rounded so server and client render identical strings (no hydration mismatch)
                const dx = Math.round(Math.cos(a) * r);
                const dy = Math.round(Math.sin(a) * r);
                return (
                  <span key={i} style={{ position: "absolute", left: `calc(${g.cx}% + ${dx}px)`, top: `calc(${g.cy}% + ${dy}px)`, width: 7, height: 7, borderRadius: "50%", background: gi === 0 ? "var(--ink)" : gi === 1 ? "var(--mute)" : "var(--faint)", animation: `mu-float ${3 + (i % 3)}s ${(i * 0.2).toFixed(1)}s ease-in-out infinite` }} />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mu-box" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mu-lbl" style={{ color: "var(--ink)" }}>LLM</span>
          <div className="mu-sk" style={{ flex: 1 }} />
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--ink)" }} />
        </div>
      </div>
    </>
  );
}

function Quality() {
  return (
    <>
      <Bar title="data-quality / reconcile" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto 1fr", gap: 12 }}>
        {["MongoDB", "PostgreSQL"].map((t) => (
          <div key={t} className="mu-box" style={{ padding: 12 }}>
            <div className="mu-lbl">{t}</div>
            {[90, 70, 84, 60].map((w, i) => (
              <div key={i} className="mu-sk" style={{ marginTop: 8, width: `${w}%` }} />
            ))}
          </div>
        ))}
        <div className="mu-box" style={{ gridColumn: "1 / -1", padding: 14, display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="96" height="96" viewBox="0 0 36 36" aria-hidden="true" style={{ flex: "none" }}>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--soft)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--ink)" strokeWidth="3" strokeDasharray="95.2 97.4" strokeLinecap="round" transform="rotate(-90 18 18)" style={{ animation: "mu-dash 1.8s var(--ease) both" }} />
            <style>{`@keyframes mu-dash{from{stroke-dasharray:58.4 97.4}}`}</style>
          </svg>
          <div>
            <div className="mu-lbl">Consistency</div>
            <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-.05em", marginTop: 4 }}>60% → 98%</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Reports() {
  return (
    <>
      <Bar title="jasperserver / reports" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
        <div style={{ position: "relative" }}>
          {[2, 1, 0].map((i) => (
            <div key={i} className="mu-box" style={{ position: "absolute", inset: `${i * 10}px ${i * 10}px auto ${-i * 0}px`, height: "86%", padding: 14, transform: `translate(${i * 8}px, ${i * 8}px)`, opacity: 1 - i * 0.25 }}>
              {i === 0 && (
                <>
                  <div className="mu-lbl">Report</div>
                  {[80, 60, 90, 50, 70, 40].map((w, k) => (
                    <div key={k} className="mu-sk" style={{ marginTop: 10, width: `${w}%` }} />
                  ))}
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 50, marginTop: 14 }}>
                    {[40, 70, 55, 90, 65].map((h, k) => (
                      <div key={k} style={{ flex: 1, height: `${h}%`, background: k === 3 ? "var(--ink)" : "var(--soft)", borderRadius: 3, transformOrigin: "bottom", animation: `mu-grow 1.2s ${(k * 0.1).toFixed(1)}s var(--ease) both` }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Patient delivery", "−90%"],
            ["Manual work", "−80%"],
            ["Query time", "−40%"],
          ].map(([k, v]) => (
            <div key={k} className="mu-box" style={{ padding: 12 }}>
              <div className="mu-lbl">{k}</div>
              <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-.04em", marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const pts = [62, 55, 58, 44, 48, 36, 40, 28, 32, 22];
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 100} ${y}`).join(" ");
  return (
    <>
      <Bar title="looker studio / transport" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateRows: "auto 1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {["Regression", "Classification", "BigQuery"].map((t) => (
            <div key={t} className="mu-box" style={{ padding: "10px 12px" }}>
              <div className="mu-lbl">{t}</div>
              <div className="mu-sk" style={{ marginTop: 8, width: "60%" }} />
            </div>
          ))}
        </div>
        <div className="mu-box" style={{ padding: 12 }}>
          <svg viewBox="0 0 100 70" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }} aria-hidden="true">
            <path d={`${d} L100 70 L0 70 Z`} fill="rgba(13,13,13,.06)" />
            <path d={d} fill="none" stroke="#0d0d0d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path d="M0 50 L100 30" fill="none" stroke="#a9a6a0" strokeDasharray="3 3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mu-box" style={{ padding: 12, display: "flex", gap: 6, alignItems: "flex-end" }}>
          {[30, 52, 44, 70, 58, 82, 64, 90, 76, 60, 48, 66].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 7 ? "var(--ink)" : "var(--soft)", borderRadius: 3, transformOrigin: "bottom", animation: `mu-grow 1.2s ${(i * 0.05).toFixed(2)}s var(--ease) both` }} />
          ))}
        </div>
      </div>
    </>
  );
}

function Face() {
  return (
    <>
      <Bar title="cnn / face-recognition" />
      <div className="mu-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="mu-box" style={{ position: "relative", display: "grid", placeItems: "center" }}>
          <svg viewBox="0 0 100 120" width="70%" aria-hidden="true">
            <ellipse cx="50" cy="52" rx="28" ry="36" fill="none" stroke="#0d0d0d" strokeWidth="1.2" />
            <circle cx="39" cy="46" r="2.5" fill="#0d0d0d" />
            <circle cx="61" cy="46" r="2.5" fill="#0d0d0d" />
            <path d="M50 50v12h-4M42 72q8 6 16 0" fill="none" stroke="#0d0d0d" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 104q36-22 72 0" fill="none" stroke="#0d0d0d" strokeWidth="1.2" />
          </svg>
          <span style={{ position: "absolute", left: "16%", right: "16%", top: "8%", bottom: "26%", boxShadow: "inset 0 0 0 1.5px var(--ink)", borderRadius: 6 }} />
          <span style={{ position: "absolute", left: "16%", right: "16%", height: 1.5, background: "var(--ink)", opacity: 0.5, animation: "mu-scan 3s ease-in-out infinite" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          {[6, 5, 4, 3, 2].map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: n }, (_, k) => (
                <span key={k} style={{ flex: 1, height: 22 - i * 2, borderRadius: 4, background: k % 2 ? "var(--soft)" : "var(--faint)", animation: `mu-pulse 2.4s ${((i + k) * 0.12).toFixed(2)}s infinite` }} />
              ))}
            </div>
          ))}
          <div className="mu-box" style={{ padding: "10px 12px", marginTop: 6 }}>
            <div className="mu-lbl">Conv layers → match</div>
          </div>
        </div>
      </div>
    </>
  );
}

const MAP: Record<string, () => React.JSX.Element> = {
  "fabric-etl": Pipeline,
  "excel-migration": Migration,
  "complaint-clustering": Clusters,
  "data-quality": Quality,
  "genomics-apps": Reports,
  "transit-warehouse": Dashboard,
  "facial-recognition": Face,
};

export default function MiniUI({ id }: { id: string }) {
  const C = MAP[id] ?? Pipeline;
  return (
    <div className="mu">
      <style href="mini-ui" precedence="default">
        {css}
      </style>
      <C />
    </div>
  );
}
