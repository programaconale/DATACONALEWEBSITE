"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Mounts Lenis smooth scrolling (skipped entirely under prefers-reduced-motion). */
export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      // native touch scrolling feels best on phones; Lenis only smooths wheel/trackpad
      syncTouch: false,
    });
    lenis = instance;
    let id = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      id = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(id);
      instance.destroy();
      lenis = null;
    };
  }, []);
  return <>{children}</>;
}

/** Smoothly scroll to "#id", an element, or a y offset — via Lenis when it's running. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const top = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (typeof target === "string" && target.startsWith("#")) {
    history.replaceState(null, "", target === "#top" ? location.pathname : target);
  }
}

/** Freeze page scroll (mobile menu). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
