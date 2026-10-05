"use client";

import { useEffect, useState } from "react";
import { ALL_SKILLS, SKILL_GROUPS, projectsUsing } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const css = `
.sk-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:28px}
.sk-sub{max-width:40ch;margin:0;color:var(--mute);font-size:15px}
.sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin:44px 0 22px}
.sk-chip{height:36px;padding:0 15px;border-radius:999px;font-size:13.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.14);color:var(--ink-2);transition:background-color .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease)}
.sk-chip:hover{box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.sk-chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.sk-chip small{font:500 10.5px/1 var(--font-mono);margin-left:6px;opacity:.6}
.sk-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,2.4vw,36px);align-items:start}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.el{position:relative;width:100%;aspect-ratio:1/1.08;text-align:left;padding:9px 10px;border-radius:14px;background:var(--card);box-shadow:var(--hair);
  display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;
  opacity:0;transform:translateY(14px) scale(.94);
  transition:opacity .7s var(--ease) var(--d),transform .8s var(--ease) var(--d),background-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease)}
.sk-grid.is-in .el{opacity:1;transform:none}
.sk-grid.is-in .el.is-dim{opacity:.22;transition-delay:0s}
.el:hover,.el.is-active{background:var(--ink);color:#fff;box-shadow:0 18px 36px -18px rgba(13,13,13,.55);transition-delay:0s}
.sk-grid.is-in .el:hover{transform:translateY(-3px)}
.el-n{font:500 10px/1 var(--font-mono);color:var(--mute)}
.el:hover .el-n,.el.is-active .el-n,.el:hover .el-f,.el.is-active .el-f{color:rgba(255,255,255,.6)}
.el-s{font-weight:700;font-size:clamp(20px,2.1vw,30px);letter-spacing:-.05em;line-height:1}
.el-name{font-size:11.5px;font-weight:500;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.el-f{font:500 9px/1 var(--font-mono);text-transform:uppercase;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.insp{position:sticky;top:calc(var(--nav-h) + 20px);padding:22px;display:flex;flex-direction:column;gap:16px;min-height:520px}
.insp-head{display:flex;justify-content:space-between;font:500 11px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.insp-logo{position:relative;height:200px;display:grid;place-items:center;border-radius:18px;background:var(--paper);overflow:hidden}
.insp-glow{position:absolute;width:150px;height:150px;border-radius:50%;filter:blur(40px);opacity:.22}
.insp-pop{position:relative;animation:pop .7s var(--ease) both}
@keyframes pop{0%{opacity:0;transform:scale(.6) rotate(-6deg)}60%{opacity:1}100%{opacity:1;transform:none}}
.insp h3{margin:0;font-weight:700;font-size:30px;letter-spacing:-.045em;line-height:1}
.insp-fam{margin:6px 0 0;font-size:14px;color:var(--mute)}
.insp-used{border-top:1px solid var(--line);padding-top:14px}
.insp-used p{margin:0 0 8px;font:500 11px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.insp-used ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:14px}
.insp-used li{display:flex;gap:10px}
.insp-used li span{font:500 11px/1.6 var(--font-mono);color:var(--mute)}
.insp-note{font-size:13.5px;color:var(--mute);margin:0}
@media (max-width:1099px){.sk-body{grid-template-columns:minmax(0,1fr)}.sk-grid{grid-template-columns:repeat(6,minmax(0,1fr))}
  .insp{position:relative;top:auto;min-height:0;display:grid;grid-template-columns:180px minmax(0,1fr);gap:18px 22px;align-items:start}
  .insp-head{grid-column:1 / -1}.insp-logo{height:180px;grid-row:span 3}}
@media (max-width:639px){.sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.el{padding:7px 8px;border-radius:12px}.el-f{display:none}
  .insp{grid-template-columns:minmax(0,1fr)}.insp-logo{grid-row:auto}}
`;

const FAMILIES = SKILL_GROUPS.map((g) => ({ family: g.family, short: g.short, count: g.skills.length }));

function useCols() {
  const [cols, setCols] = useState(8);
  useEffect(() => {
    const calc = () => setCols(window.innerWidth < 640 ? 4 : window.innerWidth < 1100 ? 6 : 8);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return cols;
}

export default function Skills() {
  const [gridRef, inView] = useInView<HTMLUListElement>({ threshold: 0.12, once: true });
  const [filter, setFilter] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(ALL_SKILLS[0].id);
  const cols = useCols();
  const active = ALL_SKILLS.find((s) => s.id === activeId)!;
  const activeIndex = ALL_SKILLS.indexOf(active) + 1;
  const used = projectsUsing(active.id);

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="sk-top">
          <SectionHead id="skills" label="Skills" lead="The periodic table of my" accent="stack." />
          <p className="sk-sub rv">
            {ALL_SKILLS.length} elements from my résumé, grouped into {SKILL_GROUPS.length} families. Hover or focus a tile
            to inspect it.
          </p>
        </div>

        <div className="sk-chips rv" role="group" aria-label="Filter skills by family">
          <button type="button" className="sk-chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
            All<small>{ALL_SKILLS.length}</small>
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f.family}
              type="button"
              className="sk-chip"
              aria-pressed={filter === f.family}
              onClick={() => setFilter(filter === f.family ? null : f.family)}
              title={f.family}
            >
              {f.short}
              <small>{f.count}</small>
            </button>
          ))}
        </div>

        <div className="sk-body">
          <ul ref={gridRef} className={`sk-grid${inView ? " is-in" : ""}`} aria-label="Skills">
            {ALL_SKILLS.map((s, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const dim = filter !== null && s.family !== filter;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`el${dim ? " is-dim" : ""}${s.id === activeId ? " is-active" : ""}`}
                    style={{ ["--d" as string]: `${(row + col) * 40}ms` }}
                    aria-label={`${s.name} — ${s.family}`}
                    aria-describedby="skill-inspector"
                    onMouseEnter={() => setActiveId(s.id)}
                    onFocus={() => setActiveId(s.id)}
                    onClick={() => setActiveId(s.id)}
                  >
                    <span className="el-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="el-s" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span aria-hidden="true">
                      <span className="el-name" style={{ display: "block" }}>
                        {s.name}
                      </span>
                      <span className="el-f" style={{ display: "block" }}>
                        {s.short}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside id="skill-inspector" className="card insp rv" aria-label="Skill inspector">
            <div className="insp-head">
              <span>No. {String(activeIndex).padStart(2, "0")}</span>
              <span>{active.symbol}</span>
            </div>
            <div className="insp-logo" aria-hidden="true">
              {isBrand(active.id) && <span className="insp-glow" style={{ background: BRAND[active.id].tint }} />}
              <span className="insp-pop" key={active.id}>
                <TechLogo id={active.id} size={isBrand(active.id) ? 150 : 110} />
              </span>
            </div>
            <div>
              <h3>{active.name}</h3>
              <p className="insp-fam">{active.family}</p>
            </div>
            <div className="insp-used">
              {used.length > 0 ? (
                <>
                  <p>Used in</p>
                  <ul>
                    {used.map((p) => (
                      <li key={p.id}>
                        <span>{p.index}</span>
                        {p.title}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="insp-note" style={{ textTransform: "none", font: "inherit", fontSize: 13.5 }}>
                  Listed in my résumé under {active.family}.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
