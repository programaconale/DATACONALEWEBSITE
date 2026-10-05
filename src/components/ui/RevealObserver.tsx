"use client";

import { useEffect } from "react";

/** Adds .is-in to every .rv / .rv-mask the first time it scrolls into view. */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv, .rv-mask"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    // Anything already on screen when JS arms is marked in synchronously (no flash);
    // everything below the fold waits for scroll.
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) el.classList.add("is-in");
      else io.observe(el);
    }
    root.classList.add("rv-ready");
    return () => io.disconnect();
  }, []);
  return null;
}
