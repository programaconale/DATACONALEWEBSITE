"use client";

import { useEffect, useRef } from "react";
import { COMMUNITY } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

/**
 * "Off the clock": browser windows with real full-page captures of the community sites.
 * Grayscale at rest; on hover/focus (or when centred on touch screens) the capture
 * turns to colour and scrolls through the whole page inside its window.
 */
const css = `
.cm-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px}
.cm-note{max-width:42ch;margin:0;color:var(--mute);font-size:15px}
.cm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(18px,2.4vw,36px);list-style:none;margin:64px 0 0;padding:0;align-items:start}
.cm-item:nth-child(2){margin-top:72px}
.cm-item:nth-child(3){margin-top:24px}
.cm-win{display:block;border-radius:22px;background:var(--card);box-shadow:var(--hair),0 30px 60px -40px rgba(13,13,13,.35);overflow:hidden;
  transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.cm-item:hover .cm-win,.cm-item:focus-within .cm-win,.cm-item.is-live .cm-win{transform:translateY(-8px);box-shadow:var(--hair),var(--lift)}
.cm-bar{display:flex;align-items:center;gap:6px;height:40px;padding:0 14px;border-bottom:1px solid var(--line)}
.cm-bar i{flex:none;width:9px;height:9px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px var(--line)}
.cm-url{flex:1;min-width:0;margin-left:8px;height:24px;border-radius:999px;background:var(--paper);display:flex;align-items:center;justify-content:center;gap:6px;
  font:500 11px/1 var(--font-mono);color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 10px}
.cm-url svg{flex:none}
.cm-view{position:relative;aspect-ratio:4/5;overflow:hidden;container-type:size;background:var(--soft)}
.cm-view img{display:block;width:100%;height:auto;filter:grayscale(1) contrast(1.04);transform:translateY(0);
  transition:transform 1.2s var(--ease),filter .8s var(--ease)}
.cm-item:hover .cm-view img,.cm-item:focus-within .cm-view img,.cm-item.is-live .cm-view img{filter:none;
  transform:translateY(calc(-100% + 100cqh));transition:transform 9s cubic-bezier(.45,.05,.35,1),filter .8s var(--ease)}
.cm-wipe{position:absolute;inset:0;background:var(--paper);transform-origin:50% 100%;transition:transform 1.2s var(--ease) calc(.15s + var(--i) * .12s);pointer-events:none}
.rv-ready .cm-item:not(.is-in) .cm-wipe{transform:scaleY(1)}
.cm-wipe{transform:scaleY(0)}
.cm-meta{padding:20px 4px 0}
.cm-row{display:flex;justify-content:space-between;align-items:center;gap:12px}
.cm-status{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font:500 10.5px/1 var(--font-mono);text-transform:uppercase;color:var(--ink-2)}
.cm-status b{width:7px;height:7px;border-radius:50%;background:var(--ink)}
.cm-status[data-s="In progress"] b{animation:cm-pulse 1.6s var(--ease) infinite}
.cm-status[data-s="Volunteer"] b{background:transparent;box-shadow:inset 0 0 0 1.5px var(--ink)}
@keyframes cm-pulse{0%{box-shadow:0 0 0 0 rgba(13,13,13,.45)}100%{box-shadow:0 0 0 7px rgba(13,13,13,0)}}
.cm-idx{font:500 12px/1 var(--font-mono);color:var(--mute)}
.cm-meta h3{margin:14px 0 0;font-weight:700;font-size:clamp(24px,2.2vw,32px);letter-spacing:-.045em;line-height:1}
.cm-kick{margin:8px 0 0;font:500 11.5px/1.4 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.cm-desc{margin:12px 0 0;font-size:15px;line-height:1.55;color:var(--ink-2)}
.cm-link{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font-weight:600;font-size:15px;letter-spacing:-.01em;
  background:linear-gradient(var(--ink),var(--ink)) 0 100%/100% 1.5px no-repeat;padding-bottom:2px;transition:background-size .6s var(--ease)}
.cm-link:hover{background-size:0 1.5px;background-position:100% 100%}
.cm-link .arr{transition:transform .5s var(--ease)}
.cm-link:hover .arr{transform:translate(2px,-2px)}
@media (max-width:899px){
  .cm-grid{grid-template-columns:minmax(0,1fr);gap:48px;max-width:520px;margin-inline:auto}
  .cm-item:nth-child(n){margin-top:0}
}
`;

export default function Community() {
  const list = useRef<HTMLUListElement>(null);

  // On touch screens there is no hover: play the preview while a window sits mid-screen.
  useEffect(() => {
    const el = list.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "-35% 0px -35% 0px" },
    );
    el.querySelectorAll(".cm-item").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="community" className="section" aria-labelledby="community-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="cm-top">
          <SectionHead id="community" label="Community" lead="Off the" accent="clock." />
          <p className="cm-note rv">
            Running, training and the communities around them, plus the websites I build for them. Hover a window to
            scroll through the real site.
          </p>
        </div>

        <ul ref={list} className="cm-grid">
          {COMMUNITY.map((c, i) => (
            <li key={c.id} className="cm-item rv" style={{ ["--i" as string]: i }}>
              <a className="cm-win" href={c.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                <span className="cm-bar">
                  <i />
                  <i />
                  <i />
                  <span className="cm-url">
                    <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true">
                      <rect x=".75" y="4.25" width="7.5" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
                      <path d="M2.4 4.2V3a2.1 2.1 0 0 1 4.2 0v1.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                    {c.domain}
                  </span>
                </span>
                <span className="cm-view">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" width={720} height={2025} loading="lazy" decoding="async" />
                  <span className="cm-wipe" />
                </span>
              </a>
              <div className="cm-meta">
                <div className="cm-row">
                  <span className="cm-status" data-s={c.status}>
                    <b aria-hidden="true" />
                    {c.status}
                  </span>
                  <span className="cm-idx" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")} / {String(COMMUNITY.length).padStart(2, "0")}
                  </span>
                </div>
                <h3>{c.name}</h3>
                <p className="cm-kick">{c.kicker}</p>
                <p className="cm-desc">{c.description}</p>
                <a className="cm-link" href={c.url} target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Visit </span>
                  {c.domain}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
