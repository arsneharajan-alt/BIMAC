import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";
import CountUp from "@/components/common/CountUp";
import { cn } from "@/lib/utils";
import { impact } from "@/lib/site";
import { tools } from "@/data/tools";
import type { GlyphId } from "@/types";

/**
 * The dashboard band: delivery record on top, catalogue roadmap beneath.
 *
 * Delivery figures come from `impact` in src/lib/site.ts — anything left
 * `null` there is not rendered. The roadmap counts are derived from the real
 * catalogue, so the dashboard and the filter sidebar can never disagree.
 * To change them, move tool ids between the status sets in src/data/tools.ts.
 */
export function ProjectImpact({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const stats: { value: string; label: string; note?: string; glyph: GlyphId }[] = [
    {
      value: String(impact.projectsCompleted),
      label: "Projects delivered",
      note: "Live projects run using BIMAC automation",
      glyph: "building",
    },
  ];

  if (impact.averageTimeReduction !== null) {
    stats.push({
      value: impact.averageTimeReduction,
      label: "Time saved vs manual",
      note: "Typical, on the tasks that get automated",
      glyph: "zap",
    });
  }

  if (impact.representativeTurnaround !== null) {
    stats.push({
      value: impact.representativeTurnaround,
      label: "Typical turnaround",
      note: "Work that took a week, delivered in a day",
      glyph: "clock",
    });
  }

  if (impact.hoursSaved !== null) {
    stats.push({
      value: `${impact.hoursSaved.toLocaleString("en-GB")}+`,
      label: "Production hours recovered",
      note: "Across those projects",
      glyph: "workflow",
    });
  }

  const countByStatus = (status: string) =>
    tools.filter((tool) => tool.status === status).length;

  const roadmap: { value: number; label: string; dot: string }[] = [
    { value: countByStatus("available"), label: "Available", dot: "bg-emerald-500" },
    { value: countByStatus("in-development"), label: "In Development", dot: "bg-amber-500" },
    { value: countByStatus("planned"), label: "Planned", dot: "bg-ink-400" },
  ];

  const total = tools.length;

  return (
    <div className={className}>
      {/* delivery record */}
      <div
        className={cn(
          "grid gap-px overflow-hidden rounded-t-xl border border-b-0 sm:grid-cols-2",
          stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          onDark ? "border-white/10 bg-white/10" : "border-ink-200 bg-ink-200",
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            data-reveal=""
            style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
            className={cn(
              "group flex flex-col p-6 transition-colors",
              onDark ? "bg-ink-950 hover:bg-ink-900" : "bg-white hover:bg-ink-50/60",
            )}
          >
            <Icon
              name={stat.glyph}
              className="text-xl text-brand-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
            />
            {/* Values are different sizes — "1 week → 1 day" has to step down to
                stay on one line — so the row is given a fixed height and the
                value sits on its floor. Without it the labels below never line
                up across the three cards. */}
            <div className="mt-4 flex h-10 items-end">
              <p
                className={cn(
                  "font-display font-semibold leading-none tracking-tightest",
                  stat.value.length > 6 ? "text-2xl" : "text-[2.25rem]",
                  onDark ? "text-white" : "text-ink-950",
                )}
              >
                {stat.value}
              </p>
            </div>
            <p
              className={cn(
                "mt-2.5 text-[0.9375rem] font-medium tracking-tight",
                onDark ? "text-ink-200" : "text-ink-900",
              )}
            >
              {stat.label}
            </p>
            {stat.note ? (
              <p className="mt-1 text-pretty text-[0.8125rem] leading-snug text-ink-500">
                {stat.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* catalogue roadmap */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-8 gap-y-4 rounded-b-xl border px-6 py-5",
          onDark ? "border-white/10 bg-white/[0.03]" : "border-ink-200 bg-ink-50/70",
        )}
      >
        <p
          className={cn(
            "text-2xs font-semibold uppercase tracking-[0.14em]",
            onDark ? "text-ink-400" : "text-ink-500",
          )}
        >
          {total} tools across the programme
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {roadmap.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", row.dot)} />
              <span
                className={cn(
                  "font-display text-xl font-semibold leading-none tracking-tight tabular-nums",
                  onDark ? "text-white" : "text-ink-950",
                )}
              >
                <CountUp value={row.value} />
              </span>
              <span
                className={cn(
                  "text-[0.875rem] leading-none",
                  onDark ? "text-ink-400" : "text-ink-600",
                )}
              >
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectImpact;
