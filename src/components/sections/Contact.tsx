"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { PROFILE, SECTION_INDEX } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { BookButton, CalendarIcon } from "../ui/BookCall";

const css = `
.ct{padding-bottom:0}
.ct-h{margin:28px 0 0;font-weight:700;letter-spacing:-.055em;line-height:.92;font-size:clamp(46px,9.4vw,156px)}
.ct-h .w{display:inline-block;white-space:nowrap}
.ct-h .ch{display:inline-block;will-change:transform}
.ct-h .ch.hop{animation:hop .62s var(--ease)}
.ct-h em{font-family:var(--font-serif);font-weight:400;font-style:italic;letter-spacing:-.025em;color:var(--mute)}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
.ct-book{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin-top:clamp(28px,4vw,44px)}
.ct-book .btn{height:58px;padding:0 28px;font-size:16px;gap:10px}
.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:clamp(48px,7vw,96px)}
.ct-label{margin:0 0 14px;font:500 11.5px/1 var(--font-mono);text-transform:uppercase;color:var(--mute)}
.ct-mail{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px}
.ct-mail a{font-weight:600;font-size:clamp(24px,3.6vw,52px);letter-spacing:-.04em;line-height:1.1;overflow-wrap:anywhere;
  background:linear-gradient(var(--ink),var(--ink)) 0 100%/100% 2px no-repeat;padding-bottom:4px;transition:background-size .6s var(--ease)}
.ct-mail a:hover{background-size:0 2px;background-position:100% 100%}
.copy{height:36px;padding:0 14px;border-radius:999px;font:500 12px/1 var(--font-mono);text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:background-color .4s var(--ease),color .4s var(--ease)}
.copy:hover,.copy.is-done{background:var(--ink);color:#fff}
.ct-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.badge{position:relative;display:grid;place-items:center;width:156px;height:156px;border-radius:50%;color:var(--ink);transition:transform .7s var(--ease)}
.badge:hover{transform:scale(1.05)}
.badge svg.badge-ring{position:absolute;inset:0;animation:spin 22s linear infinite}
.badge:hover svg.badge-ring{animation-duration:8s}
.badge-c{width:60px;height:60px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;transition:transform .6s var(--ease)}
.badge:hover .badge-c{transform:rotate(45deg)}
@keyframes spin{to{transform:rotate(360deg)}}
.ft{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px 28px;margin-top:clamp(72px,10vw,140px);padding:26px 0 30px;border-top:1px solid var(--line);font-size:13.5px;color:var(--mute)}
.ft a{color:var(--ink)}
.ft a:hover{text-decoration:underline;text-underline-offset:3px}
.ft-mono{font-family:var(--font-mono);font-size:12px;text-transform:uppercase}
@media (max-width:759px){.ct-grid{grid-template-columns:minmax(0,1fr)}.badge{width:128px;height:128px}}
`;

const LINES: { text: string; accent?: string }[] = [{ text: "Let's build" }, { text: "something", accent: "together." }];

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} className="w">
          {Array.from(word).map((c, ci) => (
            <span key={ci} className="ch">
              {c}
            </span>
          ))}
          {wi < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const hop = (e: PointerEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    if (t.classList.contains("ch") && !t.classList.contains("hop")) {
      t.classList.add("hop");
      t.addEventListener("animationend", () => t.classList.remove("hop"), { once: true });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#top");
  };

  const social = [
    PROFILE.github && { label: "GitHub", href: PROFILE.github },
    PROFILE.linkedin && { label: "LinkedIn", href: PROFILE.linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section id="contact" className="section ct" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv">
          <b>{SECTION_INDEX.contact}</b>
          <span>Contact</span>
        </p>
        <h2 id="contact-title" className="ct-h" onPointerOver={hop} aria-label="Let's build something together.">
          {LINES.map((l, i) => (
            <span key={i} className="rv-mask" style={{ ["--i" as string]: i }} aria-hidden="true">
              <span>
                <Letters text={l.text} />
                {l.accent && (
                  <>
                    {" "}
                    <em>
                      <Letters text={l.accent} />
                    </em>
                  </>
                )}
              </span>
            </span>
          ))}
        </h2>

        <div className="ct-book rv" style={{ ["--i" as string]: 2 }}>
          <BookButton className="btn btn-primary">
            <CalendarIcon />
            Book a call
          </BookButton>
        </div>

        <div className="ct-grid">
          <div>
            <p className="ct-label rv">Write to me</p>
            <div className="ct-mail rv" style={{ ["--i" as string]: 1 }}>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button type="button" className={`copy${copied ? " is-done" : ""}`} onClick={copy} aria-label="Copy email address">
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <div className="ct-links rv" style={{ ["--i" as string]: 2 }}>
              <a className="btn btn-ghost" href={PROFILE.phoneHref}>
                {PROFILE.phone}
              </a>
              {social.map((s) => (
                <a key={s.label} className="btn btn-ghost" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} <span className="arr" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <a className="badge rv" style={{ ["--i" as string]: 3 }} href={`mailto:${PROFILE.email}`} aria-label={`Say hello — email ${PROFILE.email}`}>
            <svg className="badge-ring" viewBox="0 0 156 156" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M78 78 m-60 0 a60 60 0 1 1 120 0 a60 60 0 1 1 -120 0" />
              </defs>
              <text fontFamily="var(--font-mono)" fontSize="11.5" letterSpacing="3.2" fill="currentColor">
                <textPath href="#badge-circle">SAY HELLO · SAY HELLO · SAY HELLO · </textPath>
              </text>
            </svg>
            <span className="badge-c" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <footer className="ft">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <span className="ft-mono">Built with Next.js</span>
          <a href="#top" onClick={toTop}>
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
