import type { CSSProperties } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { GLOSS } from "@/components/ui/Gloss";
import type { GlyphId } from "@/types";

/**
 * How it works — the pitch on the left, the flow on the right.
 *
 * Four steps, and the connector between them does the explaining: a hairline
 * with a small orange arrow sitting on it, so the row reads as one movement
 * rather than four tiles that happen to be next to each other. Below the
 * breakpoint the flow stacks and the connectors go, because a horizontal
 * arrow pointing at a step underneath it is just wrong.
 */
const STEPS: { word: string; label: string; glyph: GlyphId }[] = [
  { word: "Input", label: "Model or drawing set", glyph: "file-text" },
  { word: "Automate", label: "The tool runs the task", glyph: "cpu" },
  { word: "Generate", label: "Sheets, schedules, models", glyph: "layers" },
  { word: "Deliver", label: "Checked and issued", glyph: "building" },
];

export function HowItWorks() {
  return (
    <section className="border-b border-ink-200 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          {/* The pitch. */}
          <div data-reveal="">
            <p className="flex items-center gap-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.13em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              How it works
            </p>

            <h2 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tightest text-ink-950 sm:text-[2.6rem]">
              From Design
              <br />
              <span className="text-brand-500">to Delivery.</span>
            </h2>

            <p className="mt-5 max-w-[26ch] text-[0.9375rem] leading-relaxed text-ink-500">
              A seamless workflow from your models to real-world impact.
            </p>

            <Button href="/custom-automation" variant="secondary" size="sm" icon="arrow-right" className="mt-7">
              Learn More
            </Button>
          </div>

          {/* The flow. */}
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:self-center">
            {STEPS.map((step, index) => (
              <li
                key={step.word}
                data-reveal=""
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                className="group relative lg:pr-7"
              >
                {/* The connector, drawn from this step toward the next. */}
                {index < STEPS.length - 1 ? (
                  <span aria-hidden="true" className="absolute left-14 right-0 top-7 hidden items-center lg:flex">
                    <span className="h-px flex-1 bg-ink-200" />
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                      <Icon name="chevron-right" className="text-[0.5rem]" />
                    </span>
                    <span className="h-px flex-1 bg-ink-200" />
                  </span>
                ) : null}

                <div className="relative inline-flex">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl border border-ink-200 bg-[linear-gradient(176deg,#FFFFFF_0%,#F3F7FA_100%)] text-brand-500 ${GLOSS} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1`}
                  >
                    <Icon name={step.glyph} className="text-xl" />
                  </span>
                  <span className="absolute -right-2 -top-2 grid h-[1.35rem] w-[1.35rem] place-items-center rounded-full bg-ink-950 font-mono text-[0.5625rem] font-semibold tabular-nums text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Sized off the card *body* step, not the title one, even
                    though this is the h3.

                    Four uppercase words tracked at 0.12em are an eyebrow in
                    everything but the tag name — they name the stages of a
                    sequence, they do not head four articles. Set at the title
                    size the strip stops being a strip and starts shouting
                    across the section, which is the opposite of what pulling
                    the card scale down was for. */}
                <h3 className="mt-5 font-display text-card-body font-semibold uppercase tracking-[0.12em] text-ink-950">
                  {step.word}
                </h3>
                <p className="mt-1.5 max-w-[18ch] text-pretty text-card-body text-ink-500">
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
