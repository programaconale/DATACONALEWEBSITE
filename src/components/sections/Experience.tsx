"use client";

import { useRef, type MouseEvent } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "../ui/SectionHead";

const css = `
.xp-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px}
.xp-note{max-width:40ch;margin:0;color:var(--mute);font-size:15px}
.tl-ol{list-style:none;margin:0;padding:0}
.tl{position:relative;margin:64px 0 0;--yc:170px;--sx:calc(var(--yc) + 22px)}
.tl-spine,.tl-fill{position:absolute;top:8px;bottom:8px;left:var(--sx);width:1px}
.tl-spine{background:var(--line)}
.tl-fill{background:var(--ink);transform:scaleY(0);transform-origin:50% 0;will-change:transform}
.st{position:relative;display:grid;grid-template-columns:var(--yc) 44px minmax(0,1fr);padding:0 0 clamp(36px,5vw,56px)}
.st-year{padding-top:2px;text-align:right;font:500 12.5px/1.5 var(--font-mono);color:var(--mute);transition:color .6s var(--ease)}
.st-year b{display:block;font:700 26px/1 var(--font-sans);letter-spacing:-.04em;margin-bottom:6px;transition:color .6s var(--ease)}
.st-dot{position:relative;justify-self:center;margin-top:8px;width:13px;height:13px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1px var(--faint);transition:background-color .5s var(--ease),box-shadow .5s var(--ease),transform .6s var(--ease)}
.st-body{max-width:760px;color:var(--mute);transform:translateX(-6px);transition:color .7s var(--ease),transform .8s var(--ease)}
.st-body h3,.st-place,.st li{transition:color .7s var(--ease)}
.st:not(.is-lit) .st-body h3,.st:not(.is-lit) .st-place,.st:not(.is-lit) li{color:var(--mute)}
.st.is-lit .st-year{color:var(--mute)}
.st.is-lit .st-year b{color:var(--ink)}
.st.is-lit .st-dot{background:var(--ink);box-shadow:0 0 0 5px rgba(13,13,13,.08);transform:scale(1.1)}
.st.is-lit .st-body{color:var(--ink);transform:none}
.st-kind{display:inline-block;font:500 10.5px/1 var(--font-mono);text-transform:uppercase;letter-spacing:.04em;padding:6px 9px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}
.st h3{margin:12px 0 0;font-weight:700;font-size:clamp(22px,2.2vw,30px);letter-spacing:-.04em;line-height:1.1}
.st-place{margin:6px 0 0;font-size:15px;color:var(--ink-2)}
.st-place span{color:var(--mute)}
.st ul{list-style:none;margin:14px 0 0;padding:0}
.st li{position:relative;padding:7px 0 7px 18px;font-size:14.5px;line-height:1.5;color:var(--ink-2)}
.st li::before{content:"";position:absolute;left:0;top:15px;width:8px;height:1px;background:var(--faint)}
.st-next .st-body{transform:none}
.nxt{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;padding:28px 30px;border-radius:26px;border:1.5px dashed rgba(13,13,13,.25);transition:border-color .5s var(--ease),background-color .5s var(--ease)}
.nxt:hover{border-color:var(--ink);background:var(--card)}
.nxt p{margin:0;font-weight:700;font-size:clamp(26px,3vw,40px);letter-spacing:-.045em;line-height:1}
.nxt p small{display:block;margin-bottom:10px;font:500 11.5px/1 var(--font-mono);letter-spacing:0;text-transform:uppercase;color:var(--mute)}
.nxt em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
@media (max-width:759px){
  .tl{--sx:6px}
  .st{grid-template-columns:28px minmax(0,1fr);padding-bottom:40px}
  .st-year{grid-column:2;grid-row:1;text-align:left;margin-bottom:10px}
  .st-year b{display:inline;font-size:20px;margin-right:10px}
  .st-dot{grid-column:1;grid-row:1;justify-self:start;margin:4px 0 0}
  .st-body{grid-column:2}
  .nxt{padding:22px}
}
`;

type Stop = {
  id: string;
  kind: "Education" | "Experience";
  start: string;
  year: string;
  period: string;
  title: string;
  place: string;
  sub?: string;
  bullets: string[];
};

const STOPS: Stop[] = [
  ...EDUCATION.map<Stop>((e) => ({
    id: e.id,
    kind: "Education",
    start: e.start,
    year: e.start.slice(0, 4),
    period: e.period,
    title: e.degree,
    place: `${e.school}, ${e.place}`,
    bullets: e.bullets,
  })),
  ...EXPERIENCE.map<Stop>((x) => ({
    id: x.id,
    kind: "Experience",
    start: x.start,
    year: x.start.slice(0, 4),
    period: x.period,
    title: x.title,
    place: x.client ? `${x.org} — Client: ${x.client}` : x.org,
    sub: x.mode,
    bullets: x.bullets,
  })),
].sort((a, b) => a.start.localeCompare(b.start));

export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useScrollProgress(list, (p) => {
    const el = list.current;
    if (!el || !fill.current) return;
    fill.current.style.transform = `scaleY(${p})`;
    const reach = p * el.offsetHeight;
    el.querySelectorAll<HTMLElement>(".st").forEach((st) => {
      st.classList.toggle("is-lit", st.offsetTop + 10 <= reach + 1);
    });
  });

  const goContact = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#contact");
  };

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="xp-top">
          <SectionHead id="experience" label="Experience & education" lead="The path so" accent="far." />
          <p className="xp-note rv">Education and roles on one line, oldest first. The spine draws itself as you scroll.</p>
        </div>

        <div ref={list} className="tl">
          <span className="tl-spine" aria-hidden="true" />
          <span ref={fill} className="tl-fill" aria-hidden="true" />
          <ol className="tl-ol">
          {STOPS.map((s) => (
            <li key={s.id} className="st">
              <div className="st-year">
                <b>{s.year}</b>
                {s.period}
              </div>
              <span className="st-dot" aria-hidden="true" />
              <div className="st-body">
                <span className="st-kind">{s.kind}</span>
                <h3>{s.title}</h3>
                <p className="st-place">
                  {s.place}
                  {s.sub && <span> · {s.sub}</span>}
                </p>
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li className="st st-next">
            <div className="st-year">
              <b>Next</b>
            </div>
            <span className="st-dot" aria-hidden="true" />
            <div className="st-body">
              <a href="#contact" className="nxt" onClick={goContact}>
                <p>
                  <small>Next stop</small>
                  Your <em>team?</em>
                </p>
                <span className="btn btn-primary">
                  Let&apos;s talk <span className="arr" aria-hidden="true">↗</span>
                </span>
              </a>
            </div>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
