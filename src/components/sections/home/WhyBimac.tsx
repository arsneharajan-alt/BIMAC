import type { CSSProperties } from "react";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import { GLOSS, LIFT, Sheen } from "@/components/ui/Gloss";
import type { GlyphId } from "@/types";

/**
 * Why BIMAC — four points, small.
 *
 * One line each, and the line is the argument, not a summary of one. Four
 * compact slabs rather than four panels: this section supports the case, it
 * does not make it on its own.
 */
const POINTS: { title: string; line: string; glyph: GlyphId }[] = [
  { title: "Faster Delivery", line: "Weeks of production, done in days", glyph: "zap" },
  { title: "Less Manual Work", line: "The repeated tasks run themselves", glyph: "clock" },
  { title: "Standardized Workflows", line: "Your office standard, every time", glyph: "ruler" },
  { title: "Scalable Automation", line: "One tool or the whole catalogue", glyph: "layers" },
];

export function WhyBimac() {
  return (
    <section className="border-b border-ink-200 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <p
          data-reveal=""
          className="flex items-center gap-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.13em] text-brand-600"
        >
          <span className="h-px w-6 bg-brand-500" />
          Why BIMAC
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point, index) => (
            <div
              key={point.title}
              data-reveal=""
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              className={`group relative isolate overflow-hidden rounded-2xl border border-ink-200 bg-white px-5 py-5 ${GLOSS} ${LIFT} hover:border-brand-300`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-[linear-gradient(176deg,#FFFFFF_0%,#F2F6FA_100%)] text-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(6,20,34,0.06)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
                <Icon name={point.glyph} className="text-base" />
              </span>

              <h3 className="mt-4 font-display text-[0.9375rem] font-semibold tracking-tight text-ink-950">
                {point.title}
              </h3>
              <p className="mt-1 text-[0.8125rem] leading-snug text-ink-500">{point.line}</p>

              <Sheen />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WhyBimac;
