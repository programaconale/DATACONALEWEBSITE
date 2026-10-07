"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { EDUCATION, PROFILE, PROJECTS } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

const css = `
.about{overflow:clip}
.ab-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:stretch}
.ab-col{display:flex;flex-direction:column;min-width:0}
.ab-left .h2{font-size:clamp(40px,4.6vw,68px)}
.ab-left .lede{margin:28px 0 0}
.ab-line{margin:16px 0 0;font-size:15px;color:var(--mute)}
.ab-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
.ab-mid{position:relative;min-height:calc(var(--pad-y) + 560px);margin-top:calc(-1 * var(--pad-y))}
.ab-right{justify-content:space-between;gap:28px}
.facts{padding:8px 24px}
.facts h3{margin:18px 0 6px;font:500 12px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.facts dl{margin:0}
.facts div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:15px 0;border-top:1px solid var(--line);font-size:14.5px}
.facts div:first-of-type{border-top:0}
.facts dt{font:500 11.5px/1.6 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.facts dd{margin:0;color:var(--ink);overflow-wrap:anywhere}
.facts a{text-decoration:underline;text-decoration-color:var(--faint);text-underline-offset:3px}
.facts a:hover{text-decoration-color:var(--ink)}
.quote{margin:0;padding:0 4px}
.quote p{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(26px,2.4vw,34px);line-height:1.1;letter-spacing:-.01em;color:var(--ink)}
.quote p::before{content:"“";display:block;font-size:2.2em;line-height:.6;color:var(--faint)}
.quote footer{margin-top:14px;font:500 11.5px/1.4 var(--font-mono);text-transform:uppercase;color:var(--mute)}

/* lanyard */
.lan{position:absolute;top:0;left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;will-change:transform}
.lan-strap{position:relative;width:30px;height:calc(var(--pad-y) + 56px);margin:0 auto;background:#141414;overflow:hidden;
  box-shadow:inset 1px 0 0 rgba(255,255,255,.08),inset -1px 0 0 rgba(255,255,255,.08)}
.lan-strap::before,.lan-strap::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:repeating-linear-gradient(180deg,rgba(255,255,255,.18) 0 3px,transparent 3px 6px)}
.lan-strap::before{left:3px}.lan-strap::after{right:3px}
.lan-text{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;align-items:center;animation:strap 18s linear infinite}
.lan-text span{writing-mode:vertical-rl;font:600 10px/30px var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.82);white-space:nowrap;padding:10px 0}
@keyframes strap{to{transform:translateY(-50%)}}
.lan-clip{position:relative;width:34px;height:40px;margin:-2px auto 0}
.lan-clip::before{content:"";position:absolute;left:4px;right:4px;top:0;height:16px;border-radius:3px 3px 6px 6px;
  background:linear-gradient(90deg,#8d8d8d,#e9e9e9 35%,#bdbdbd 60%,#7a7a7a);box-shadow:0 1px 2px rgba(0,0,0,.3)}
.lan-clip::after{content:"";position:absolute;left:50%;top:13px;width:16px;height:26px;margin-left:-8px;border-radius:9px;border:3px solid #a4a4a4;border-top-color:#d8d8d8;box-shadow:0 1px 1px rgba(0,0,0,.2)}
.idc{position:relative;width:300px;height:404px;perspective:1400px;margin-top:-10px;cursor:pointer;border-radius:22px}
.idc-hit{position:absolute;inset:0;z-index:3;border-radius:22px;outline-offset:6px}
.idc-in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1.05s var(--ease)}
.idc.is-flipped .idc-in{transform:rotateY(180deg)}
.idc-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#fff;border-radius:22px;overflow:hidden;
  box-shadow:inset 0 0 0 1px var(--line),0 50px 90px -40px rgba(13,13,13,.4),0 18px 36px -22px rgba(13,13,13,.25);display:flex;flex-direction:column}
.idc-back{transform:rotateY(180deg)}
.idc-slot{position:absolute;top:10px;left:50%;width:44px;height:8px;margin-left:-22px;border-radius:6px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.25);z-index:2}
.idc-band{background:var(--ink);color:#fff;height:58px;padding:22px 18px 0;display:flex;justify-content:space-between;align-items:center;font:600 11px/1 var(--font-mono);letter-spacing:.18em}
.idc-band small{font-size:10px;letter-spacing:.04em;color:rgba(255,255,255,.55)}
.idc-body{flex:1;display:flex;flex-direction:column;align-items:center;padding:16px 20px 14px}
.idc-photo{position:relative;width:128px;height:156px;padding:3px;border-radius:18px;background:linear-gradient(150deg,#d9d9d9,#7d7d7d 45%,#e6e6e6 70%,#9a9a9a);
  box-shadow:0 0 0 8px rgba(13,13,13,.035),0 18px 34px -16px rgba(13,13,13,.45)}
.idc-photo div{width:100%;height:100%;border-radius:15px;overflow:hidden;background:#f2f2f2}
.idc-photo img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.idc-photo div{position:relative}
.idc-photo .idc-otw{position:absolute;left:0;top:18px;width:100%;height:auto;aspect-ratio:1;object-fit:contain;transform:none;pointer-events:none}
.idc:hover .idc-photo .idc-otw,.idc:has(.idc-hit:focus-visible) .idc-photo .idc-otw{transform:none}
.idc:hover .idc-photo img,.idc:has(.idc-hit:focus-visible) .idc-photo img{transform:scale(1.07)}
.idc-name{margin:12px 0 0;font-weight:700;font-size:17px;letter-spacing:-.03em;line-height:1.15;text-align:center}
.idc-role{margin:3px 0 0;font-size:12.5px;color:var(--mute)}
.idc-rows{width:100%;margin:10px 0 0;font:500 10.5px/1 var(--font-mono);text-transform:uppercase}
.idc-rows div{display:flex;justify-content:space-between;padding:5px 0;border-top:1px dashed var(--line)}
.idc-rows dt{color:var(--mute)}.idc-rows dd{margin:0}
.idc-foot{width:100%;display:flex;align-items:flex-end;justify-content:space-between;margin-top:auto}
.idc-holo{width:38px;height:38px;border-radius:50%;background:conic-gradient(from var(--a,0deg),#f4f4f4,#bdbdbd,#fafafa,#8f8f8f,#e2e2e2,#a8a8a8,#f4f4f4);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);animation:holo 6s linear infinite;position:relative}
.idc-holo::after{content:"";position:absolute;inset:9px;border-radius:50%;border:1px solid rgba(255,255,255,.8)}
@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes holo{to{--a:360deg}}
.idc-back .idc-body{align-items:stretch;text-align:left}
.idc-back h3{margin:2px 0 10px;font-weight:700;font-size:20px;letter-spacing:-.04em}
.idc-back h3 em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
.idc-back ul{list-style:none;margin:0;padding:0;font-size:12.5px;line-height:1.4;color:var(--ink-2)}
.idc-back li{display:grid;grid-template-columns:22px 1fr;padding:6px 0;border-top:1px solid var(--line)}
.idc-back li span{font:500 10px/1.7 var(--font-mono);color:var(--mute)}
.idc-sig{margin-top:auto;padding-top:8px}
.idc-sig b{display:block;font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:24px;line-height:1;border-bottom:1px solid var(--ink);padding-bottom:4px}
.idc-sig small{display:block;margin-top:7px;font:500 10px/1.4 var(--font-mono);color:var(--mute);overflow-wrap:anywhere}
.idc-hint{position:absolute;left:0;right:0;bottom:-34px;text-align:center;font:500 11px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}

@media (max-width:1179px){
  .ab-grid{grid-template-columns:minmax(0,1fr) 320px}
  .ab-right{grid-column:1 / -1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end}
}
@media (max-width:759px){
  .ab-grid{grid-template-columns:minmax(0,1fr)}
  .ab-mid{margin-top:0;min-height:590px}
  .lan-strap{height:72px}
  .ab-right{grid-template-columns:minmax(0,1fr)}
}
`;

function Barcode({ seed }: { seed: string }) {
  // deterministic bars from the name — purely decorative
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 46 && x < 130; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = (c % 3) + 1;
    if (i % 2 === 0) bars.push({ x, w });
    x += w + ((c >> 2) % 2) + 1;
  }
  return (
    <svg width="132" height="30" viewBox="0 0 132 30" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="24" fill="#2b2b2b" />
      ))}
      <text x="0" y="30" fontSize="6" fontFamily="var(--font-mono)" fill="#77756f" letterSpacing="1.4">
        {PROFILE.card.id}
      </text>
    </svg>
  );
}

export default function About() {
  const [secRef, inView] = useInView<HTMLElement>({ threshold: 0, rootMargin: "100px" });
  const swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const kick = useRef(0);
  const edu = EDUCATION[0];

  // Damped pendulum: pointer velocity → angular impulse; idle sway when calm.
  useEffect(() => {
    const el = swing.current;
    if (!el || !inView || prefersReducedMotion()) return;
    let theta = 0;
    let omega = 0;
    let idle = 1;
    let last = performance.now();
    let lastX: number | null = null;
    let lastT = 0;
    let raf = 0;
    const K = 34; // stiffness
    const C = 2.6; // damping

    const onMove = (e: globalThis.PointerEvent) => {
      const t = performance.now();
      if (lastX !== null && t - lastT < 80) {
        const vx = (e.clientX - lastX) / Math.max(8, t - lastT); // px / ms
        omega += Math.max(-2.5, Math.min(2.5, vx * 0.9)) * 3.2;
      }
      lastX = e.clientX;
      lastT = t;
    };
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      if (kick.current) {
        omega += kick.current;
        kick.current = 0;
      }
      omega += (-K * theta - C * omega) * dt;
      theta += omega * dt;
      theta = Math.max(-14, Math.min(14, theta));
      const calm = Math.abs(omega) < 4 && Math.abs(theta) < 2;
      idle += ((calm ? 1 : 0) - idle) * Math.min(1, dt * 1.5);
      const sway = Math.sin(t / 1300) * 1.6 * idle;
      el.style.transform = `rotate(${(theta + sway).toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [inView]);

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") {
      setFlipped((f) => !f);
      kick.current += 22;
    }
  };
  // Enter / Space on the native button arrive as a click with detail === 0
  const onKeyClick = (e: MouseEvent) => {
    if (e.detail === 0) {
      setFlipped((f) => !f);
      kick.current += 16;
    }
  };

  const strap = `${PROFILE.name} · ${PROFILE.role} · `;
  const backLines = [
    `${PROFILE.current.title} — ${PROFILE.current.org}, client ${PROFILE.current.client}`,
    `${edu.degree} · GPA 17.28/20 · 100% merit scholarship`,
    "Product Owner, from MVP to production-ready AI solutions",
    [PROJECTS[0], PROJECTS[2], PROJECTS[3]].map((p) => p.title).join(" · "),
    "1st in class · Thesis Honorable Mention · 2nd, JOBarcelona",
  ];

  return (
    <section id="about" ref={secRef} className="section about" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap ab-grid">
        <div className="ab-col ab-left">
          <SectionHead id="about" label="About" lead="Hi, I'm" accent={`${PROFILE.firstName}.`} />
          <p className="lede rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.resumeSummary}
          </p>
          <p className="ab-line rv" style={{ ["--i" as string]: 2 }}>
            {PROFILE.aboutLine}
          </p>
          <div className="ab-btns rv" style={{ ["--i" as string]: 3 }}>
            <a className="btn btn-primary" href={PROFILE.resume} download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            {PROFILE.github && (
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                GitHub <span className="arr" aria-hidden="true">↗</span>
              </a>
            )}
            {PROFILE.linkedin && (
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span className="arr" aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        <div className="ab-col ab-mid">
          <div ref={swing} className="lan">
            <div className="lan-strap" aria-hidden="true">
              <div className="lan-text">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i}>{strap}</span>
                ))}
              </div>
            </div>
            <div className="lan-clip" aria-hidden="true" />
            <div
              className={`idc${flipped ? " is-flipped" : ""}`}
              onMouseEnter={() => setFlipped(true)}
              onMouseLeave={() => setFlipped(false)}
            >
              <button
                type="button"
                className="idc-hit"
                aria-pressed={flipped}
                onPointerUp={onPointerUp}
                onClick={onKeyClick}
              >
                <span className="sr-only">Flip the ID card</span>
              </button>
              <div className="idc-in">
                <div className="idc-face idc-front">
                  <span className="idc-slot" aria-hidden="true" />
                  <div className="idc-band">
                    DEVELOPER ID <small>{PROFILE.initials}</small>
                  </div>
                  <div className="idc-body">
                    <div className="idc-photo">
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} loading="lazy" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="idc-otw" src="/opentowork.webp" alt="#OpenToWork" width={360} height={360} loading="lazy" />
                      </div>
                    </div>
                    <p className="idc-name">{PROFILE.name}</p>
                    <p className="idc-role">{PROFILE.role}</p>
                    <dl className="idc-rows">
                      <div>
                        <dt>ID No.</dt>
                        <dd>{PROFILE.card.id}</dd>
                      </div>
                      <div>
                        <dt>Dept.</dt>
                        <dd>{PROFILE.card.dept}</dd>
                      </div>
                      <div>
                        <dt>Experience</dt>
                        <dd>{PROFILE.card.validTill}</dd>
                      </div>
                    </dl>
                    <div className="idc-foot">
                      <Barcode seed={PROFILE.name} />
                      <span className="idc-holo" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="idc-face idc-back">
                  <span className="idc-slot" aria-hidden="true" />
                  <div className="idc-band">
                    WHAT I AM <small>{PROFILE.initials}</small>
                  </div>
                  <div className="idc-body">
                    <h3>
                      In <em>short.</em>
                    </h3>
                    <ul>
                      {backLines.map((l, i) => (
                        <li key={i}>
                          <span>0{i + 1}</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                    <div className="idc-sig">
                      <b>{PROFILE.name.split(" ").slice(0, 2).join(" ")}</b>
                      <small>If found, say hello · {PROFILE.email}</small>
                    </div>
                  </div>
                </div>
              </div>
              <span className="idc-hint" aria-hidden="true">
                Hover · tap · Enter to flip
              </span>
            </div>
          </div>
        </div>

        <div className="ab-col ab-right">
          <div className="card facts rv" style={{ ["--i" as string]: 2 }}>
            <h3>Quick facts</h3>
            <dl>
              <div>
                <dt>Location</dt>
                <dd>{PROFILE.location}</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>
                  {edu.degree} · {edu.school}, {edu.place}
                </dd>
              </div>
              <div>
                <dt>Current</dt>
                <dd>
                  {PROFILE.current.title} · {PROFILE.current.org} (client: {PROFILE.current.client})
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
                </dd>
              </div>
            </dl>
          </div>
          <blockquote className="quote rv" style={{ ["--i" as string]: 3 }}>
            <p>{PROFILE.quote}</p>
            <footer>— from my profile</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
