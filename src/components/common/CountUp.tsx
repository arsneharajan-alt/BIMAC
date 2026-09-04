"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up the first time it is scrolled into view.
 *
 * The final value is rendered on the server and is what sits in the DOM before
 * hydration, so the real figure is always present for search engines, for
 * readers with motion turned off, and if JavaScript never arrives.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let cancelled = false;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - start) / duration, 1);
        // Ease-out cubic: fast off the mark, gentle into the final number.
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * value));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setDisplay(0);
        run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">{display}</span>
      {suffix}
    </span>
  );
}

export default CountUp;
