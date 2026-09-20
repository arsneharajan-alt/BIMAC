"use client";

import { useEffect, useRef } from "react";
import DESIGNED_CARDS from "./cards";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A designed tool card, playing.
 *
 * Some tools ship a finished card rather than a picture: a fixed-size stage
 * carrying its own headline, its own step list and its own demo button, with
 * every moving part of it — the step that lights, the ribbon button that
 * lights with it, the geometry that appears, the number that counts up —
 * driven off one position in a single loop. The pitch and the artwork are one
 * animation, which is the whole reason they work.
 *
 * Neither half is rewritten here. `scripts/build-cards.mjs` lifts the markup
 * and the value function straight out of the design and emits them as a
 * module; this supplies the clock and does the four kinds of binding the
 * design asks for:
 *
 *   data-bind-css    a whole cssText string, by dotted name
 *   data-bind-style  a list of [property, value-name] pairs
 *   data-bind-text   the text content of one node
 *   data-bind-<attr> a template for any attribute — "[[name]]" segments are
 *                    substituted, so one attribute can splice several values
 *
 * It runs on one requestAnimationFrame loop, idles while the card is off
 * screen, and holds the finished frame with no motion at all for anyone who
 * has asked for reduced motion.
 */

export interface DesignedCard {
  id: string;
  title: string;
  width: number;
  height: number;
  loopMs: number;
  /** Attributes this card drives, e.g. ["d", "r"]. Usually none. */
  attrs: string[];
  stage: Record<string, string>;
  markup: string;
  /**
   * One frame of the card, as the design's own `renderVals` returns it —
   * wrapped in `{ v }`, which is why `frame` below unwraps it.
   */
  values: (p: number) => { v: Record<string, unknown> };
}

/**
 * The frame every card is held at.
 *
 * 88 of 100 is the design's own fallback — what its renderVals returns when
 * nothing is driving it — so it is the state the author chose to be seen in:
 * the run finished, the model built, the sheets out.
 */
const STILL_AT = 88;

/**
 * One frame's values.
 *
 * The design's `renderVals` returns `{ v: … }` and everything binds against
 * the inside of that. Reading the wrapper instead is a silent failure — every
 * lookup comes back undefined, every binding is set to "", and the card sits
 * there looking like a finished still. Which is exactly what it did.
 */
function frameValues(card: DesignedCard, p: number): Record<string, unknown> {
  const frame = card.values(p);
  return (frame?.v ?? frame) as Record<string, unknown>;
}

/**
 * An attribute template, filled.
 *
 * `"[[wx]]"` is the common case — one value, whole. But the form allows a
 * template, so `"M[[ax]] [[ay]]L0 0"` works too, which is why this splices
 * rather than just looking a name up.
 */
function fill(template: string, values: Record<string, unknown>): string {
  return template
    .split("[[")
    .map((part, index) => {
      if (index === 0) return part;
      const close = part.indexOf("]]");
      if (close < 0) return part;
      const value = pick(values, part.slice(0, close));
      return (value === null || value === undefined ? "" : String(value)) + part.slice(close + 2);
    })
    .join("");
}

/** `a.b` → that value, out of the frame's values. */
function pick(values: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value === null || value === undefined ? value : (value as Record<string, unknown>)[key],
      values,
    );
}

export function CardScene({ toolId, className }: { toolId: string; className?: string }) {
  // Looked up here rather than passed in: the card carries its own value
  // function, and a function cannot be handed from a server component to a
  // client one as a prop.
  const card = DESIGNED_CARDS[toolId];
  const hostRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // The design ships its demo button pointing at a bare #demo.
  const markup = !card
    ? ""
    : card.markup
    .split('href="#demo"')
    .join(
      `href="${whatsappLink(card.title, "demo")}" target="_blank" rel="noopener noreferrer"`,
    );

  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    if (!host || !stage || !card) return undefined;

    // The design is a fixed size; lay it across the card's full width and let
    // the card decide how much of its height to show.
    //
    // It used to be fitted whole, which was right while the card's box was cut
    // to the design's own 1280x616. The Lite cards pin their content to the
    // top of that box and leave the bottom third empty, so the card is now cut
    // to the content instead and the rest is cropped away. Fitting the whole
    // design into that shorter box would only shrink it and keep the gap, so
    // the scale is taken off the width alone and the design is hung from the
    // top edge.
    const fit = () => {
      const { width } = host.getBoundingClientRect();
      if (!width) return;
      stage.style.transform = `translate(-50%, 0) scale(${width / card.width})`;
    };

    // The design carries its own call to action, and the card it sits on lays
    // a link over the whole of itself. Lift the design's own links clear of
    // that, so they are the ones that take the click.
    for (const anchor of Array.from(stage.querySelectorAll("a"))) {
      anchor.style.position = "relative";
      anchor.style.zIndex = "20";
    }

    const cssBound = Array.from(stage.querySelectorAll<HTMLElement>("[data-bind-css]"));
    const textBound = Array.from(stage.querySelectorAll<HTMLElement>("[data-bind-text]"));

    // Any attribute the card says it drives, each holding a template.
    const attrBound: [Element, string, string][] = [];
    for (const attr of card.attrs ?? []) {
      for (const element of Array.from(stage.querySelectorAll(`[data-bind-${attr}]`))) {
        const template = element.getAttribute(`data-bind-${attr}`);
        if (template === null) continue;
        try {
          attrBound.push([element, attr, JSON.parse(template) as string]);
        } catch {
          // A template that will not parse is one node that stays as drawn,
          // not a card that fails to start.
        }
      }
    }
    const styleBound = Array.from(stage.querySelectorAll<HTMLElement>("[data-bind-style]")).map(
      (element) =>
        [
          element,
          JSON.parse(element.getAttribute("data-bind-style") ?? "[]") as [string, string][],
        ] as const,
    );

    const draw = (p: number) => {
      const values = frameValues(card, p);
      for (const element of cssBound) {
        element.style.cssText = String(
          pick(values, element.getAttribute("data-bind-css") ?? "") ?? "",
        );
      }
      for (const [element, properties] of styleBound) {
        for (const [property, path] of properties) {
          element.style.setProperty(property, String(pick(values, path) ?? ""));
        }
      }
      for (const [element, attr, template] of attrBound) {
        element.setAttribute(attr, fill(template, values));
      }
      for (const element of textBound) {
        element.textContent = String(
          pick(values, element.getAttribute("data-bind-text") ?? "") ?? "",
        );
      }
    };

    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(host);

    // One frame, and that is the card.
    //
    // These used to run their own loop off requestAnimationFrame, with an
    // IntersectionObserver to stop the ones nobody was looking at. A page of
    // thirty-odd cards all moving at once was more motion than it was worth,
    // so every card is now held at the frame the design itself falls back to
    // when it has no clock — the finished state, with the work done.
    //
    // The scene still has to be painted once: the markup ships with empty
    // values that only mean something after a frame has been applied.
    draw(STILL_AT);

    return () => resize.disconnect();
  }, [card]);

  if (!card) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden bg-white", className)}
    >
      <div
        ref={stageRef}
        className="absolute left-1/2 top-0 origin-top"
        style={{
          ...card.stage,
          width: card.width,
          height: card.height,
          transform: "translate(-50%, 0)",
        }}
        // Static, local markup, generated from a file in this repository —
        // nothing here comes from a user.
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  );
}

export default CardScene;
