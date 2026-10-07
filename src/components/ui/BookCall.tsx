"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { lockScroll } from "@/lib/scroll";

const css = `
.bc{position:relative;margin-top:clamp(64px,8vw,104px);padding:clamp(28px,4vw,52px);border-radius:32px;background:var(--ink);color:#fff;overflow:hidden;
  display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:end}
.bc::after{content:"";position:absolute;right:-120px;top:-120px;width:340px;height:340px;border-radius:50%;border:1px solid rgba(255,255,255,.12);
  box-shadow:0 0 0 60px rgba(255,255,255,.025),0 0 0 120px rgba(255,255,255,.02);pointer-events:none}
.bc-kick{margin:0;font:500 11.5px/1 var(--font-mono);text-transform:uppercase;color:rgba(255,255,255,.55)}
.bc h3{margin:16px 0 0;font-weight:700;font-size:clamp(30px,3.8vw,54px);letter-spacing:-.045em;line-height:1.02}
.bc h3 em{font-family:var(--font-serif);font-weight:400;color:rgba(255,255,255,.6)}
.bc-side{position:relative;z-index:1;display:flex;flex-direction:column;gap:14px}
.bc-mail{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-radius:18px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);
  font-size:15px;color:#fff;transition:background-color .4s var(--ease),box-shadow .4s var(--ease)}
.bc-mail:hover{background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}
.bc-mail small{display:block;margin-bottom:5px;font:500 10.5px/1 var(--font-mono);text-transform:uppercase;color:rgba(255,255,255,.5)}
.bc-mail span:first-child{min-width:0;overflow-wrap:anywhere}
.bc-or{margin:0;text-align:center;font:500 10.5px/1 var(--font-mono);text-transform:uppercase;color:rgba(255,255,255,.4)}
.bc-book{display:flex;align-items:center;justify-content:center;gap:10px;height:58px;border:0;border-radius:999px;background:#fff;color:var(--ink);
  font:600 16px/1 var(--font-sans);letter-spacing:-.01em;cursor:pointer;transition:transform .5s var(--ease)}
.bc-book:hover{transform:translateY(-2px)}
.bc-book svg{flex:none}
.bc-hours{margin:0;text-align:center;font:500 11px/1.4 var(--font-mono);text-transform:uppercase;color:rgba(255,255,255,.5)}
.bc-dlg{position:fixed;inset:0;margin:auto;width:min(980px,calc(100vw - 32px));height:min(780px,calc(100dvh - 32px));max-width:none;max-height:none;padding:0;border:0;border-radius:24px;
  background:var(--card);color:var(--ink);box-shadow:var(--lift);overflow:hidden}
.bc-dlg[open]{display:flex;flex-direction:column;animation:bc-in .5s var(--ease)}
.bc-dlg::backdrop{background:rgba(13,13,13,.55);backdrop-filter:blur(4px)}
@keyframes bc-in{from{opacity:0;transform:translateY(16px) scale(.98)}}
.bc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 14px 14px 22px;border-bottom:1px solid var(--line)}
.bc-head p{margin:0;font-weight:700;font-size:17px;letter-spacing:-.02em}
.bc-head p small{display:block;margin-top:4px;font:500 10.5px/1 var(--font-mono);font-weight:500;text-transform:uppercase;letter-spacing:0;color:var(--mute)}
.bc-x{flex:none;width:40px;height:40px;border:0;border-radius:50%;background:var(--paper);color:var(--ink);font-size:20px;line-height:1;cursor:pointer}
.bc-x:hover{background:var(--soft)}
.bc-dlg iframe{flex:1;width:100%;border:0;background:#fff}
@media (max-width:899px){.bc{grid-template-columns:minmax(0,1fr);align-items:stretch}}
`;

export default function BookCall() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const subject = encodeURIComponent("New website project");
  const mailto = `mailto:${PROFILE.email}?subject=${subject}`;

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => lockScroll(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    setOpened(true);
    dlg.current?.showModal();
    lockScroll(true);
  };

  return (
    <aside className="bc rv" aria-labelledby="bc-title">
      <style>{css}</style>
      <div>
        <p className="bc-kick">Websites for your business</p>
        <h3 id="bc-title">
          Want a site like this portfolio, or like the ones I&apos;m <em>building?</em>
        </h3>
      </div>
      <div className="bc-side">
        <a className="bc-mail" href={mailto}>
          <span>
            <small>Email me</small>
            {PROFILE.email}
          </span>
          <span aria-hidden="true">↗</span>
        </a>
        <p className="bc-or">or</p>
        {PROFILE.booking ? (
          <button type="button" className="bc-book" onClick={open} aria-haspopup="dialog">
            <CalendarIcon />
            Book a call
          </button>
        ) : (
          <a className="bc-book" href={mailto}>
            <CalendarIcon />
            Book a call
          </a>
        )}
        <p className="bc-hours">Mon – Fri · 4 – 6 pm (Madrid time)</p>
      </div>

      {PROFILE.booking && (
        <dialog
          ref={dlg}
          className="bc-dlg"
          aria-labelledby="bc-dlg-title"
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        >
          <div className="bc-head">
            <p id="bc-dlg-title">
              Book a call about your website
              <small>Mon – Fri · 4 – 6 pm (Madrid time)</small>
            </p>
            <button type="button" className="bc-x" onClick={() => dlg.current?.close()} aria-label="Close">
              ×
            </button>
          </div>
          {opened && <iframe src={PROFILE.booking} title="Book a call with Alejandro (Google Calendar)" />}
        </dialog>
      )}
    </aside>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3.5" width="14" height="12.5" rx="2.5" />
      <path d="M2 7.5h14M6 1.8v3.4M12 1.8v3.4" strokeLinecap="round" />
    </svg>
  );
}
