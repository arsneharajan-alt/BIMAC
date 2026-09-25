import type { CSSProperties } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import StackedHeading from "@/components/ui/StackedHeading";
import type { GlyphId } from "@/types";

/**
 * Custom automation — for the workflow no catalogue covers.
 *
 * One picture in three columns: what a team already has on the left, the
 * automation written around it in the middle, the result they wanted on the
 * right. Data runs along the two connectors, and the inputs light one after
 * another as it is fed in. CSS only — nothing here needs a clock.
 *
 * On the navy of the BIMAC mark, so the page turns a corner here:
 * from what we have built to what we could build for you.
 */

const INPUTS: { label: string; glyph: GlyphId }[] = [
  { label: "Existing software", glyph: "grid" },
  { label: "Company standards", glyph: "ruler" },
  { label: "Templates", glyph: "layers" },
  { label: "Project requirements", glyph: "list" },
  { label: "Repetitive internal workflows", glyph: "workflow" },
  { label: "Specific data & processes", glyph: "database" },
];

const RESULTS = ["Your deliverables, your format", "Your standards, applied every time", "Hours of manual work, gone"];

/** A connector with data running along it. Horizontal from lg, vertical below. */
function Connector() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-10 w-px lg:h-px lg:w-full">
      <span className="absolute inset-0 bg-white/15" />
      <span className="absolute inset-0 overflow-hidden motion-reduce:hidden">
        <span className="absolute left-0 top-0 h-1/3 w-full animate-flow-y bg-gradient-to-b from-transparent via-brand-400 to-transparent lg:hidden" />
        <span className="absolute left-0 top-0 hidden h-full w-1/3 animate-flow-x bg-gradient-to-r from-transparent via-brand-400 to-transparent lg:block" />
      </span>
    </div>
  );
}

export function CustomAutomation() {
  return (
    // Flat navy, taken from the BIMAC mark itself (#073157) — no grid, no glow.
    <section className="relative overflow-hidden bg-navy py-14 sm:py-20">
      <Container className="relative">
        <StackedHeading
          onDark
          eyebrow="Custom automation"
          title="Your Workflow."
          accent="Automated Your Way."
          lede="Our 300+ plugins cover a wide range of workflows. When yours is unique, we build the automation around the way your team already works."
        />

        <div
          data-reveal=""
          className="mt-10 grid items-center gap-4 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,17rem)_5rem_minmax(0,1fr)] lg:gap-0"
        >
          {/* Your workflow */}
          <div>
            <p className="mb-4 text-center text-[0.75rem] font-bold uppercase tracking-[0.18em] text-ink-400 lg:text-left">
              Your workflow
            </p>
            <ul className="grid grid-cols-2 gap-2.5">
              {INPUTS.map((input, index) => (
                <li
                  key={input.label}
                  style={{ animationDelay: `${index * 0.5}s` } as CSSProperties}
                  className="flex animate-feed items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.8125rem] font-medium leading-snug text-ink-200 motion-reduce:animate-none"
                >
                  <Icon name={input.glyph} className="shrink-0 text-sm text-brand-400" />
                  {input.label}
                </li>
              ))}
            </ul>
          </div>

          <Connector />

          {/* Custom automation */}
          <div className="relative mx-auto w-full max-w-[17rem] rounded-2xl border border-brand-500/50 bg-[linear-gradient(160deg,rgba(245,95,22,0.22),rgba(245,95,22,0.06))] px-6 py-7 text-center shadow-[0_0_60px_-10px_rgba(245,95,22,0.45)]">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-brand-400/60 bg-ink-950/60 text-brand-300">
              <Icon name="cpu" className="text-2xl" />
            </span>
            <h3 className="mt-4 font-display text-card-title-lg font-semibold text-white">Custom automation</h3>
            <span aria-hidden="true" className="mx-auto mt-3 block h-[3px] w-7 rounded-full bg-brand-500" />
            <p className="mt-3 text-card-meta text-ink-300">Written for your software, your standards and your process.</p>
          </div>

          <Connector />

          {/* Your desired result */}
          <div>
            <p className="mb-4 text-center text-[0.75rem] font-bold uppercase tracking-[0.18em] text-ink-400 lg:text-left">
              Your desired result
            </p>
            <ul className="space-y-2.5">
              {RESULTS.map((result) => (
                <li
                  key={result}
                  className="flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 text-[0.875rem] font-medium text-white"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Icon name="check" className="text-[0.625rem]" strokeWidth={3} />
                  </span>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal="" className="mt-10 flex justify-center">
          <Button href="/custom-automation" size="lg" icon="arrow-right">
            Explore Custom Automation
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default CustomAutomation;
