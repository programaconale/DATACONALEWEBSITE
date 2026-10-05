"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive version of prefersReducedMotion (false during SSR). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

type InViewOpts = { threshold?: number | number[]; rootMargin?: string; once?: boolean };

/** IntersectionObserver as a hook. With `once`, it stays true after the first hit. */
export function useInView<T extends Element = HTMLElement>(
  { threshold = 0.15, rootMargin = "0px", once = false }: InViewOpts = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, rootMargin, JSON.stringify(threshold)]);
  return [ref, inView];
}

/**
 * Calls `onProgress(p)` (0 → 1) at most once per frame while scrolling.
 * - "center": how far the viewport centre has travelled through the element.
 * - "pinned": progress through a tall element whose child is position:sticky
 *   (0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom).
 * Writes go straight to the DOM in the callback, so nothing re-renders per frame.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  mode: "center" | "pinned" = "center",
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "pinned"
          ? -r.top / Math.max(1, r.height - vh)
          : (vh * 0.5 - r.top) / Math.max(1, r.height);
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, mode]);
}
