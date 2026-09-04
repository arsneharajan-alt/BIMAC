"use client";

import { useEffect } from "react";

/**
 * One observer for the whole site.
 *
 * Mounted once in the layout, it watches every `[data-reveal]` element and adds
 * `.is-revealed` as it enters the viewport. Doing it centrally means server
 * components stay server components — a section opts into the animation with a
 * single attribute instead of a client wrapper around every card.
 *
 * A MutationObserver picks up nodes added later, so client-rendered content
 * (filtered tool grids, the mobile drawer) reveals the same way.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Nothing to orchestrate when motion is off — the CSS never hides anything.
    if (reduced.matches) return;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      // Fire a little before the element's edge so it lands settled, not mid-flight.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observe = (root: ParentNode) => {
      for (const el of root.querySelectorAll("[data-reveal]")) {
        if (seen.has(el)) continue;
        seen.add(el);

        // Anything already on screen at mount reveals immediately rather than
        // waiting for a scroll that may never come on a short page.
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.classList.add("is-revealed");
          continue;
        }
        io.observe(el);
      }
    };

    observe(document);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as Element;
          if (el.matches("[data-reveal]") && !seen.has(el)) {
            seen.add(el);
            io.observe(el);
          }
          observe(el);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

export default ScrollReveal;
