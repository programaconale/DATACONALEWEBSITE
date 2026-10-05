"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, skillById } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";
import MiniUI from "../ui/MiniUI";

const css = `
.wk-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px}
.wk-note{max-width:44ch;margin:0;color:var(--mute);font-size:15px}
.wk-list{display:flex;gap:10px;height:min(78svh,600px);margin:56px 0 0;padding:0;list-style:none}
.wk{position:relative;flex:1 1 0;min-width:0;border-radius:26px;background:var(--card);box-shadow:var(--hair);overflow:hidden;
  transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk.is-open{flex-grow:12;box-shadow:var(--hair),var(--lift)}
.wk-spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;
  transition:opacity .4s var(--ease);text-align:center}
.wk.is-open .wk-spine{opacity:0;pointer-events:none}
.wk-num{font:500 12px/1 var(--font-mono);color:var(--mute)}
.wk-vt{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:15px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:70%}
.wk-plus{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:transform .6s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
.wk-spine:hover .wk-plus,.wk-spine:focus-visible .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.wk-body{position:absolute;top:0;left:0;bottom:0;width:var(--open-w,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px;padding:32px;
  opacity:0;transition:opacity .45s var(--ease)}
.wk.is-open .wk-body{opacity:1;transition:opacity .7s var(--ease) .28s}
.wk-list.is-compact .wk-body{grid-template-columns:minmax(0,1fr)}
.wk-list.is-compact .wk-ui{display:none}
.wk-text{display:flex;flex-direction:column;min-height:0;overflow:auto;scrollbar-width:none}
.wk-kick{display:flex;gap:12px;align-items:baseline;font:500 11.5px/1.4 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.wk-kick b{color:var(--ink);font-weight:500}
.wk h3{margin:16px 0 0;font-weight:700;font-size:clamp(28px,2.6vw,40px);letter-spacing:-.045em;line-height:1}
.wk-desc{margin:16px 0 0;color:var(--ink-2);font-size:15px;line-height:1.55}
.wk-feat{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0 18px}
.wk-feat li{padding:9px 0;border-top:1px solid var(--line);font-size:13.5px;display:flex;gap:8px}
.wk-feat li::before{content:"";flex:none;width:5px;height:5px;margin-top:7px;border-radius:50%;background:var(--ink)}
.wk-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px}
.wk-tech .chip{height:30px;font-size:12.5px;background:var(--paper)}
.wk-cta{margin-top:auto;padding-top:20px}
.wk-ui{position:relative;display:flex;flex-direction:column;gap:10px;min-height:0;clip-path:inset(0 100% 0 0);transition:clip-path .5s var(--ease)}
.wk.is-open .wk-ui{clip-path:inset(0 0 0 0);transition:clip-path 1.2s var(--ease) .38s}
.wk-ui>div:first-child{flex:1;min-height:0}
.wk-ui-lbl{font:500 10.5px/1 var(--font-mono);text-transform:uppercase;color:var(--mute);text-align:right}
@media (max-width:899px){
  .wk-list{flex-direction:column;height:auto;gap:8px}
  .wk{flex:none;border-radius:22px}
  .wk-spine{position:relative;flex-direction:row;padding:18px 18px;gap:14px;justify-content:flex-start;text-align:left}
  .wk.is-open .wk-spine{opacity:1;pointer-events:auto}
  .wk-vt{writing-mode:horizontal-tb;transform:none;flex:1;max-height:none}
  .wk.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
  .wk.is-open .wk-vt{opacity:0}
  .wk-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s var(--ease)}
  .wk.is-open .wk-wrap{grid-template-rows:1fr}
  .wk-wrap>div{min-height:0;overflow:hidden}
  .wk-body{position:relative;width:auto;grid-template-columns:minmax(0,1fr);padding:4px 18px 22px;opacity:1}
  .wk-list.is-compact .wk-ui{display:flex}
  .wk-ui{height:240px}
  .wk-feat{grid-template-columns:minmax(0,1fr)}
}
`;

const isDesktop = () => window.matchMedia("(hover: hover) and (min-width: 900px)").matches;

export default function Work() {
  const [open, setOpen] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const [compact, setCompact] = useState(false);

  // Fix the open panel's content width so it never reflows while the panels animate.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const n = PROJECTS.length;
      const gap = 10;
      const w = el.clientWidth - gap * (n - 1);
      const openW = (w * 12) / (12 + (n - 1));
      el.style.setProperty("--open-w", `${openW}px`);
      setCompact(openW < 700);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="wk-top">
          <SectionHead id="work" label="Selected work" lead="Things I've" accent="built." />
          <p className="wk-note rv">
            Deliverables from my roles, in my résumé&apos;s words. The interfaces on the right are illustrative sketches, not
            screenshots.
          </p>
        </div>

        <ul ref={list} className={`wk-list rv${compact ? " is-compact" : ""}`}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <li
                key={p.id}
                className={`wk${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => isDesktop() && setOpen(i)}
                onFocusCapture={(e) => (e.target as HTMLElement).matches(":focus-visible") && setOpen(i)}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-${p.id}`}
                  onClick={() => setOpen(isOpen && !isDesktop() ? -1 : i)}
                >
                  <span className="wk-num">{p.index}</span>
                  <span className="wk-vt">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div className="wk-wrap">
                  <div>
                    <div id={`wk-${p.id}`} className="wk-body" role="region" aria-labelledby={`wk-t-${p.id}`} inert={!isOpen}>
                      <div className="wk-text">
                        <p className="wk-kick">
                          <b>{p.index}</b> {p.kicker}
                        </p>
                        <h3 id={`wk-t-${p.id}`}>{p.title}</h3>
                        <p className="wk-desc">{p.description}</p>
                        <ul className="wk-feat">
                          {p.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                        {p.tech.length > 0 && (
                          <div className="wk-tech">
                            {p.tech.map((t) => (
                              <span key={t} className="chip">
                                <TechLogo id={t} size={15} />
                                {skillById(t)?.name ?? t}
                              </span>
                            ))}
                          </div>
                        )}
                        {p.github && (
                          <div className="wk-cta">
                            <a className="btn btn-primary" href={p.github} target="_blank" rel="noopener noreferrer">
                              View on GitHub <span className="arr" aria-hidden="true">↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="wk-ui" role="img" aria-label={`Illustrative UI sketch for ${p.title} (not a screenshot)`}>
                        <MiniUI id={p.id} />
                        <span className="wk-ui-lbl">Illustrative UI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
