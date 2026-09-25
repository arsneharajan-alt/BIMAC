import type { CSSProperties } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import CountUp from "@/components/common/CountUp";
/** The picture on the right of each card, cut from the approved design. */
type MetricVisualId = "sheets" | "dial" | "rising" | "layers";
import { GLOSS, LIFT, Sheen } from "@/components/ui/Gloss";
import { cn } from "@/lib/utils";
import { impact } from "@/lib/site";
import { tools } from "@/data/tools";
import { softwareMenuColumns } from "@/data/software-menu";
import type { GlyphId } from "@/types";

/**
 * The record, in four figures.
 *
 * Delivery numbers come from `impact` in src/lib/site.ts — anything left
 * `null` there is not rendered. The catalogue and software counts are derived
 * from the real data, so this band can never disagree with the pages behind
 * it. The status split (available / in development / planned) is deliberately
 * not here: a visitor reading the record does not need the roadmap, and it is
 * on the catalogue page where it can actually be filtered.
 *
 * Each card carries a translucent object on its right. They are set almost to
 * the background on purpose: the number has to be the loudest thing in the
 * card, and a graphic with real contrast takes that away from it.
 */

/** Everything we automate inside, minus rendering — a look, not an application. */
const softwareCount = softwareMenuColumns
  .flatMap((column) => column.items)
  .filter((item) => item.id !== "render").length;

/**
 * The icon tile alternates orange and violet, as in the approved design, rather than running
 * orange four times, which reads as a warning strip.
 */
const TINTS = [
  "bg-brand-100/70 text-brand-600 ring-brand-100",
  "bg-violet-100 text-violet-600 ring-violet-100",
] as const;

export function ProjectImpact({
  className,
  showCatalogue = true,
}: {
  className?: string;
  /** The slim "N tools across N software" bar under the cards. The home page leaves it off. */
  showCatalogue?: boolean;
}) {
  const stats: {
    value: string;
    /** Set when the number should count up rather than simply appear. */
    count?: number;
    suffix?: string;
    label: string;
    note?: string;
    glyph: GlyphId;
    visual: MetricVisualId;
  }[] = [
    {
      value: `${impact.projectsCompleted}+`,
      count: impact.projectsCompleted,
      suffix: "+",
      label: "Projects delivered",
      note: "Live projects running with BIMAC automation",
      glyph: "file-text",
      visual: "sheets",
    },
  ];

  if (impact.averageTimeReduction !== null) {
    stats.push({
      value: impact.averageTimeReduction,
      label: "Time saved vs manual",
      note: "Typical on the tasks that get automated",
      glyph: "zap",
      visual: "dial",
    });
  }

  if (impact.representativeTurnaround !== null) {
    stats.push({
      value: impact.representativeTurnaround,
      label: "Typical turnaround",
      note: "Work that took a week, delivered in a day",
      glyph: "clock",
      visual: "rising",
    });
  }

  stats.push({
    value: String(softwareCount),
    count: softwareCount,
    label: "Software automated",
    note: "Revit, AutoCAD, Navisworks, P6 and the rest of the stack",
    glyph: "settings",
    visual: "layers",
  });

  return (
    <div className={className}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            data-reveal=""
            style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
            className={cn(
              "group relative isolate overflow-hidden rounded-2xl border border-ink-200",
              "bg-[linear-gradient(168deg,#FFFFFF_0%,#F7FAFC_100%)] p-6",
              GLOSS,
              LIFT,
              "hover:border-brand-300",
            )}
          >
            {/* The picture from the approved design, on the right. Its own
                ground is feathered away at the edges so it sits in the card
                rather than on it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/home/metric-${stat.visual}.png`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-5 h-28 w-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [mask-image:radial-gradient(closest-side,#000_62%,transparent)] group-hover:scale-105"
            />

            <span
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset",
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5",
                TINTS[index % TINTS.length],
              )}
            >
              <Icon name={stat.glyph} className="text-lg" />
            </span>

            {/* Values are different shapes — "1 week → 1 day" has to step down
                to stay on one line — so the row is given a fixed height and
                every value sits on its floor. Without it the labels below
                never line up across the four cards. */}
            <div className="relative mt-7 flex h-11 items-end">
              <p
                className={cn(
                  "font-display font-semibold leading-none tracking-tightest tabular-nums text-ink-950",
                  stat.value.length > 6 ? "text-[1.75rem]" : "text-[2.5rem]",
                )}
              >
                {stat.count !== undefined ? (
                  <CountUp value={stat.count} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </p>
            </div>

            {/* The numeral above is this card's heading; the label is the
                caption under it. Giving the label the card-title size put 24px
                of it directly beneath a 40px figure, and the two then argued
                over which one the eye should read first. */}
            <p className="relative mt-3 text-card-body font-semibold text-ink-900">
              {stat.label}
            </p>
            {stat.note ? (
              <p className="relative mt-1 max-w-[24ch] text-pretty text-card-meta text-ink-500">
                {stat.note}
              </p>
            ) : null}

            <Sheen />
          </div>
        ))}
      </div>

      {/* One slim bar under the record: the size of the catalogue behind it. */}
      {showCatalogue ? (
      <Link
        href="/tools"
        className={cn(
          "group mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-ink-200",
          "bg-[linear-gradient(168deg,#FFFFFF_0%,#F7FAFC_100%)] px-6 py-4",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(6,20,34,0.04)]",
          "transition-colors duration-300 hover:border-ink-300",
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy text-white">
          <Icon name="grid" className="text-[0.8rem]" />
        </span>
        <span className="font-display text-xl font-semibold leading-none tracking-tight tabular-nums text-ink-950">
          <CountUp value={tools.length} />
        </span>
        <span className="text-[0.9375rem] text-ink-600">
          tools across <span className="font-medium text-ink-900">{softwareCount}</span> software
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-600">
          Browse the catalogue
          <Icon
            name="arrow-right"
            className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </Link>
      ) : null}
    </div>
  );
}

export default ProjectImpact;
