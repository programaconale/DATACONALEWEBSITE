"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { useReducedMotion, useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND } from "../ui/TechLogo";

const css = `
.ac{position:relative}
.ac-pin{position:sticky;top:0;height:100svh;overflow:clip;display:flex;flex-direction:column;justify-content:center;gap:clamp(28px,5vh,56px);padding-top:var(--nav-h)}
.ac-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px}
.ac-head .h2{font-size:clamp(40px,5.6vw,84px)}
.ac-prog{width:min(280px,40vw);display:flex;flex-direction:column;gap:10px;font:500 11.5px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.ac-prog i{display:block;height:2px;background:var(--line);overflow:hidden}
.ac-prog i b{display:block;height:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%}
.ac-track{display:flex;gap:20px;align-items:center;list-style:none;margin:0;padding:24px max(var(--gutter),calc((100vw - var(--maxw)) / 2));will-change:transform;width:max-content}
.acc{position:relative;flex:none;width:clamp(min(340px,82vw),40vw,540px);height:clamp(260px,36vh,310px);border-radius:28px;background:var(--card);box-shadow:var(--hair),0 20px 40px -32px rgba(13,13,13,.25);
  padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.acc.is-active{transform:translateY(-12px);box-shadow:var(--hair),0 50px 80px -36px rgba(13,13,13,.32),0 18px 30px -20px rgba(13,13,13,.16)}
.acc-top{display:flex;justify-content:space-between;align-items:flex-start}
.acc-logo{position:relative;width:72px;height:72px;border-radius:20px;background:#fff;box-shadow:var(--hair);display:grid;place-items:center}
.acc-glow{position:absolute;inset:-6px;border-radius:50%;filter:blur(22px);opacity:.14;z-index:-1;transition:opacity .8s var(--ease)}
.acc.is-active .acc-glow{opacity:.36}
.acc-logo>*:not(.acc-glow){position:relative}
.acc-idx{font:500 12px/1 var(--font-mono);color:var(--mute)}
.acc-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:18px}
.acc-txt{min-width:0;max-width:58%}
.acc h3{margin:0;font-weight:700;font-size:18px;letter-spacing:-.03em;line-height:1.15}
.acc-cap{margin:5px 0 0;font:500 11px/1.45 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.acc-det{margin:8px 0 0;font-size:13px;line-height:1.45;color:var(--ink-2)}
.acc-num{flex:none;font-weight:700;letter-spacing:-.06em;line-height:.8;font-size:clamp(64px,7vw,112px);font-variant-numeric:tabular-nums;white-space:nowrap}
.acc-num small{font-size:.32em;letter-spacing:-.02em;margin-left:2px;color:var(--mute);font-weight:600}
.ac-end{flex:none;padding:0 clamp(24px,6vw,96px) 0 20px;font-weight:700;font-size:clamp(28px,3vw,44px);letter-spacing:-.045em;white-space:nowrap}
.ac-end em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
@media (max-width:639px){.acc{padding:18px}.acc-txt{max-width:56%}.acc-num{font-size:60px}.acc-logo{width:60px;height:60px;border-radius:16px}}
/* reduced motion: no pin, a plain horizontally scrollable row */
.ac.is-static{height:auto !important;padding-block:var(--pad-y)}
.ac.is-static .ac-pin{position:relative;height:auto;padding-top:0}
.ac.is-static .ac-track{width:auto;overflow-x:auto;transform:none !important;scroll-snap-type:x mandatory}
.ac.is-static .acc{scroll-snap-align:start}
`;

function fmt(a: Achievement, v: number) {
  return (a.prefix ?? "") + v.toFixed(a.decimals ?? 0);
}

export default function Achievements() {
  const sec = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [travel, setTravel] = useState(0);
  const reduced = useReducedMotion();

  // horizontal travel distance = track width − viewport width
  useEffect(() => {
    const measure = () => {
      if (!track.current || !pin.current) return;
      setTravel(Math.max(0, track.current.scrollWidth - pin.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (pin.current) ro.observe(pin.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useScrollProgress(
    sec,
    (p) => {
      const t = track.current;
      if (!t || reduced) return;
      t.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      // lift the card closest to the viewport centre
      const mid = window.innerWidth / 2;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      t.querySelectorAll<HTMLElement>(".acc").forEach((c) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      });
      t.querySelectorAll<HTMLElement>(".acc").forEach((c) => {
        c.classList.toggle("is-active", c === best);
        // a card that slid past within a single frame never intersected: show its final value
        if (!c.dataset.done && c.getBoundingClientRect().right < 0) {
          c.dataset.done = "1";
          const out = c.querySelector<HTMLElement>("[data-num]");
          const a = ACHIEVEMENTS[Number(c.dataset.i)];
          if (out) out.textContent = fmt(a, a.value);
        }
      });
    },
    "pinned",
  );

  // count up once per card, the first time it is seen
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const cards = Array.from(t.querySelectorAll<HTMLElement>(".acc"));
    if (reduced) return;
    const rafs: number[] = [];
    cards.forEach((c) => {
      const a = ACHIEVEMENTS[Number(c.dataset.i)];
      const out = c.querySelector<HTMLElement>("[data-num]");
      if (out) out.textContent = fmt(a, 0);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          if (el.dataset.done) continue;
          el.dataset.done = "1";
          const a = ACHIEVEMENTS[Number(el.dataset.i)];
          const out = el.querySelector<HTMLElement>("[data-num]");
          if (!out) continue;
          const t0 = performance.now();
          const step = (now: number) => {
            const k = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - k, 4); // easeOutQuart
            out.textContent = fmt(a, a.value * eased);
            if (k < 1) rafs.push(requestAnimationFrame(step));
          };
          rafs.push(requestAnimationFrame(step));
        }
      },
      { threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => {
      io.disconnect();
      rafs.forEach(cancelAnimationFrame);
    };
  }, [reduced]);

  // re-apply the transform once the real travel distance is known
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [travel]);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section
      id="achievements"
      ref={sec}
      className={`ac${reduced ? " is-static" : ""}`}
      style={{ height: `calc(100svh + ${travel}px)` }}
      aria-labelledby="achievements-title"
    >
      <style>{css}</style>
      <div ref={pin} className="ac-pin">
        <div className="wrap ac-head">
          <SectionHead id="achievements" label="Achievements" lead="Proof, in" accent="numbers." />
          <div className="ac-prog rv" aria-hidden="true">
            <span>Scroll →</span>
            <i>
              <b ref={bar} />
            </i>
          </div>
        </div>
        <ul ref={track} className="ac-track">
          {ACHIEVEMENTS.map((a, i) => {
            const tint = BRAND[a.icon]?.tint;
            return (
              <li key={a.id} className="acc" data-i={i}>
                <div className="acc-top">
                  <span className="acc-logo">
                    {tint && <span className="acc-glow" style={{ background: tint }} aria-hidden="true" />}
                    <TechLogo id={a.icon} size={40} />
                  </span>
                  <span className="acc-idx">
                    {String(i + 1).padStart(2, "0")} / {total}
                  </span>
                </div>
                <div className="acc-bot">
                  <div className="acc-txt">
                    <h3>{a.label}</h3>
                    <p className="acc-cap">{a.caption}</p>
                    <p className="acc-det">{a.detail}</p>
                  </div>
                  <p className="acc-num">
                    <span className="sr-only">{`${a.prefix ?? ""}${a.value}${a.suffix ?? ""}`}</span>
                    <span data-num aria-hidden="true">
                      {fmt(a, a.value)}
                    </span>
                    {a.suffix && <small aria-hidden="true">{a.suffix}</small>}
                  </p>
                </div>
              </li>
            );
          })}
          <li className="ac-end" aria-hidden="true">
            and <em>counting</em> →
          </li>
        </ul>
      </div>
    </section>
  );
}
