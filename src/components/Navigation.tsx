"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto;z-index:50;pointer-events:none}
.nav-progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;z-index:60;pointer-events:none}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;height:var(--nav-h)}
.nav-brand{pointer-events:auto;display:flex;align-items:center;gap:12px;min-width:0}
.nav-mark{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font:600 13px/1 var(--font-mono);letter-spacing:-.02em;box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink);background:transparent;transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:var(--paper)}
.nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;white-space:nowrap;transition:opacity .5s var(--ease),transform .6s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{pointer-events:auto;position:relative;display:flex;align-items:center;padding:5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease)}
.nav.is-scrolled .nav-pill,.nav-menu-btn{background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.3)}
.nav-ind{position:absolute;top:5px;left:0;height:calc(100% - 10px);border-radius:999px;background:var(--ink);opacity:0;transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
.nav-link{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);transition:color .4s var(--ease)}
.nav-link:hover{color:var(--ink)}
.nav-link[aria-current="true"]{color:#fff}
.nav-menu-btn{pointer-events:auto;display:none;height:44px;padding:0 18px;border-radius:999px;font-size:14px;font-weight:500;align-items:center;gap:10px}
.nav-menu-btn i{display:block;width:16px;height:1.5px;background:currentColor;position:relative}
.nav-menu-btn i::after{content:"";position:absolute;left:0;top:5px;width:10px;height:1.5px;background:currentColor}
.nav-short{display:none}
@media (max-width:899px){.nav-pill{display:none}.nav-menu-btn{display:inline-flex}}
@media (max-width:479px){.nav-full{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.nav-short{display:inline}}
.ov{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0% at calc(100% - 52px) 38px);transition:clip-path .8s var(--ease),visibility 0s .8s;visibility:hidden;display:flex;flex-direction:column}
.ov.is-open{clip-path:circle(150% at calc(100% - 52px) 38px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.ov-top{display:flex;justify-content:space-between;align-items:center;height:var(--nav-h)}
.ov-close{height:44px;padding:0 18px;border-radius:999px;font-size:14px;font-weight:500;background:var(--ink);color:#fff}
.ov-list{list-style:none;margin:auto 0;padding-block:0}
.ov-list li{overflow:hidden;border-top:1px solid var(--line)}
.ov-list li:last-child{border-bottom:1px solid var(--line)}
.ov-list a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(38px,11vw,72px);transform:translateY(105%);transition:transform .8s var(--ease)}
.ov-list a small{font:500 12px/1 var(--font-mono);letter-spacing:0;color:var(--mute)}
.ov.is-open .ov-list a{transform:none;transition-delay:calc(.18s + var(--i) * 60ms)}
.ov-foot{display:flex;flex-wrap:wrap;gap:8px 20px;padding-block:20px 28px;font-size:14px;color:var(--mute)}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  // active section tracking
  useEffect(() => {
    const ids = ["top", ...NAV.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // slide the ink indicator under the active link
  const placeIndicator = useCallback(() => {
    const p = pill.current;
    const i = ind.current;
    if (!p || !i) return;
    const link = active ? p.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      i.style.opacity = "0";
      return;
    }
    i.style.opacity = "1";
    i.style.width = `${link.offsetWidth}px`;
    i.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);
  useLayoutEffect(placeIndicator, [placeIndicator]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // mobile overlay: lock scroll, Esc to close, focus management
  useEffect(() => {
    if (!open) return;
    const btn = menuBtn.current;
    lockScroll(true);
    const t = setTimeout(() => firstLink.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // let the overlay release the scroll lock before scrolling
    if (wasOpen) requestAnimationFrame(() => scrollToTarget(`#${id}`));
    else scrollToTarget(`#${id}`);
  };

  return (
    <>
      <style>{css}</style>
      <div ref={bar} className="nav-progress" aria-hidden="true" />
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap nav-in">
          <a href="#top" className="nav-brand" onClick={(e) => go(e, "top")}>
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">
              <span className="nav-full">{PROFILE.name}</span>
              <span className="nav-short" aria-hidden="true">
                {PROFILE.name.split(" ").slice(0, 2).join(" ")}
              </span>
            </span>
            <span className="sr-only">, back to top</span>
          </a>
          <nav aria-label="Primary">
            <div ref={pill} className="nav-pill">
              <span ref={ind} className="nav-ind" aria-hidden="true" />
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  data-id={n.id}
                  className="nav-link"
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={(e) => go(e, n.id)}
                >
                  {n.label}
                </a>
              ))}
            </div>
            <button
              ref={menuBtn}
              type="button"
              className="nav-menu-btn"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen(true)}
            >
              Menu <i aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div
        id="menu-overlay"
        className={`ov${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="wrap ov-top">
          <span className="nav-mark" aria-hidden="true" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            {PROFILE.initials}
          </span>
          <button type="button" className="ov-close" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <ul className="wrap ov-list">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a
                ref={i === 0 ? firstLink : undefined}
                href={`#${n.id}`}
                style={{ ["--i" as string]: i }}
                onClick={(e) => go(e, n.id)}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="wrap ov-foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </>
  );
}
