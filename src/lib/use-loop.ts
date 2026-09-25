"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One looping clock for a drawn demo.
 *
 * The hero's software window and the three example automations each play a
 * short story on repeat, and every moving part of a story is read off one
 * number — `p`, from 0 to 1 — so nothing inside a demo can drift out of step
 * with anything else in it.
 *
 * It only runs while the demo is on screen. Off screen the loop is parked, and
 * picks up where it left off when it comes back. Anyone who has asked their
 * system for less motion gets the finished frame, held still — which is also
 * what the server renders, so the picture is whole before any script arrives.
 *
 * `seek` jumps the clock, for step lists a visitor can click.
 */
export function useLoop(loopMs: number, still = 0.9) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(still);
  const elapsed = useRef(still * loopMs);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    // Start from the top of the story, not from the held frame.
    elapsed.current = 0;
    setP(0);

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      // Capped, so a tab that was in the background does not jump a whole scene.
      elapsed.current += Math.min(now - last, 64);
      last = now;
      setP((elapsed.current % loopMs) / loopMs);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (!entry.isIntersecting) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [loopMs]);

  const seek = useCallback(
    (to: number) => {
      elapsed.current = to * loopMs;
      setP(to);
    },
    [loopMs],
  );

  return { ref, p, seek };
}

/** 0 before `a`, 1 after `b`, linear between. */
export function ramp(p: number, a: number, b: number) {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

/** Ease-out cubic, for things that arrive. */
export function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * The fade that closes every loop, so the jump back to the first frame is
 * never seen. 1 for most of the story, falling to 0 over its last few percent.
 */
export function loopFade(p: number, from = 0.93) {
  return 1 - ramp(p, from, 0.995);
}
