import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import WireframeSkyline from "@/components/common/WireframeSkyline";
import DotGrid from "@/components/common/DotGrid";
import ProductMark from "@/components/common/ProductMark";
import CountUp from "@/components/common/CountUp";
import { tools } from "@/data/tools";
import { disciplines } from "@/data/disciplines";
import { softwarePlatforms } from "@/data/software";
import { impact } from "@/lib/site";
import type { GlyphId } from "@/types";

/** The delivery record, counted from real data rather than typed in. */
const stats: { value: number; label: string; glyph: GlyphId }[] = [
  { value: impact.projectsCompleted, label: "Projects\nDelivered", glyph: "building" },
  { value: tools.length, label: "Tools\nAutomated", glyph: "package" },
  { value: disciplines.length, label: "Disciplines\nCovered", glyph: "layers" },
  { value: softwarePlatforms.length, label: "Platforms\nIntegrated", glyph: "box" },
];

/** Entrance stagger — each hero row lands a beat after the one above it. */
function enter(delayMs: number) {
  return { animationDelay: `${delayMs}ms` } as const;
}

export function Hero() {
  // Ocean blue ground: deep navy behind the copy, opening to a lighter azure
  // at the lower right where the massing rises.
  return (
    <section className="relative overflow-hidden bg-ink-950 bg-[linear-gradient(145deg,#061422_0%,#0B2440_28%,#123A66_55%,#17558F_78%,#1E6BB0_100%)] text-white">
      {/* Backdrop, back to front: a faint dot grid across the whole section,
          then the wireframe towers filling the empty right. */}
      <DotGrid className="opacity-[0.3]" />
      <WireframeSkyline className="bottom-0 right-0 top-0 hidden w-[36%] opacity-[0.42] lg:block xl:w-[32%]" />

      {/* Scrim: heaviest behind the copy at the top left, clearing toward the
          lower right where the towers rise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(6,20,34,0.86)_0%,rgba(6,20,34,0.54)_32%,rgba(6,20,34,0.12)_64%,rgba(6,20,34,0)_100%)]"
      />
      {/* The two accents, one at each corner — orange leads, azure answers.
          Both drift slowly and out of phase, so the backdrop is never static. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-14rem] top-[-12rem] h-[42rem] w-[42rem] animate-drift rounded-full bg-brand-500/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        style={{ animationDelay: "-9s" }}
        className="pointer-events-none absolute bottom-[-16rem] left-[-16rem] h-[38rem] w-[38rem] animate-drift rounded-full bg-azure-500/12 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent"
      />

      <Container className="relative">
        {/* One column now the diagram is gone, so the headline gets full width. */}
        <div className="pb-12 pt-16 lg:pb-14 lg:pt-24">
          <div className="max-w-6xl">
            <p
              style={enter(0)}
              className="mb-6 flex animate-fade-up items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-400"
            >
              <span className="h-px w-6 bg-brand-500" />
              CAD, BIM &amp; Engineering Automation Platform
            </p>

            {/*
              Two lines, always: "Powerful CAD & BIM Tools for" / "Smarter
              Workflows". The first line is held on one line from lg up, where
              the headline shares the row with the visual, so the size steps
              down there to fit the narrower column rather than wrapping.
            */}
            {/* Full width now, so the type can go back up a couple of steps. */}
            <h1 className="font-display text-[2.25rem] font-semibold leading-[1.06] tracking-tightest text-white sm:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem]">
              <span
                style={enter(90)}
                className="block animate-fade-up lg:whitespace-nowrap"
              >
                Powerful CAD &amp; BIM Tools for
              </span>
              <span style={enter(200)} className="relative mt-1 inline-block animate-fade-up">
                <span className="relative z-10 text-brand-500">Smarter Workflows</span>
                {/* The marker stroke wipes in after the words land. */}
                <span
                  aria-hidden="true"
                  style={{ animationDelay: "620ms" }}
                  className="absolute inset-x-0 bottom-1 z-0 h-2.5 origin-left animate-[fade-in_0.7s_cubic-bezier(0.22,1,0.36,1)_both] bg-brand-500/20"
                />
              </span>
            </h1>

            <p
              style={enter(310)}
              className="mt-6 max-w-xl animate-fade-up text-[1.0625rem] leading-relaxed text-ink-300 sm:text-lg"
            >
              A complete suite of automation tools for AEC and engineering teams — from design
              and documentation to coordination, construction, and project management.
            </p>

            {/*
              One call to action. Software and stages are both reachable from
              the header, and contact lives up there too, so the hero does not
              repeat them — it points at the catalogue and gets out of the way.
            */}
            <div style={enter(420)} className="mt-9 animate-fade-up">
              <Button
                href="/tools"
                size="lg"
                icon="arrow-right"
                className={[
                  // Scaled up to sit against the headline rather than under it.
                  "h-16 px-10 text-lg",
                  // A light sweeps across on hover; the whole button presses in
                  // on click, so the tap has something to answer it.
                  // The base already carries `transition-all`, so the press
                  // animates without a second transition class fighting it.
                  "overflow-hidden shadow-[0_10px_30px_-10px_rgba(245,95,22,0.55)]",
                  "active:scale-[0.97]",
                  "before:absolute before:inset-0 before:-translate-x-full before:content-['']",
                  "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
                  "before:transition-transform before:duration-700 hover:before:translate-x-full",
                ].join(" ")}
              >
                Explore Tools
              </Button>
            </div>

            {/* Four columns on one baseline — a wrapping flex row never lines up. */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  style={enter(520 + index * 80)}
                  className="group flex animate-fade-up items-start gap-3"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.05] text-brand-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-400/40 group-hover:bg-brand-500/15">
                    <Icon name={stat.glyph} className="text-base" />
                  </span>
                  <div className="min-w-0">
                    <dd className="font-display text-xl font-semibold leading-none tracking-tight text-white">
                      <CountUp value={stat.value} suffix="+" />
                    </dd>
                    <dt className="mt-1.5 whitespace-pre-line text-[0.8125rem] leading-tight text-ink-400">
                      {stat.label}
                    </dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* The visual now sits alone in its column, so it centres against
              the copy on the left instead of overshooting it. */}
        </div>

        {/* The software axis, one linear row across the foot of the hero. */}
        <div className="border-t border-white/10 pb-12 pt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-300">
              <span className="h-px w-4 bg-azure-400" />
              Automates inside
            </p>
            <Link
              href="/software"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold text-azure-300 transition-colors hover:text-azure-200"
            >
              All software
              <Icon
                name="arrow-right"
                className="text-[0.8rem] transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* All eight inside one rectangle. Eight explicit columns keep it to a
              single row on desktop rather than however many a wrapping flex
              happens to produce. */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.045] p-2 backdrop-blur">
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-8">
              {softwarePlatforms.map((platform, index) => (
                <li
                  key={platform.id}
                  data-reveal=""
                  style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                >
                  <Link
                    href={`/software/${platform.slug}`}
                    title={`${platform.name} — ${platform.role}`}
                    className="group flex h-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_8px_20px_-10px_rgba(46,146,240,0.65)] hover:ring-1 hover:ring-inset hover:ring-azure-400/40 active:scale-[0.97]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/95 transition-transform duration-200 group-hover:scale-110">
                      <ProductMark platform={platform} size="xs" />
                    </span>
                    <span className="truncate text-[0.75rem] font-medium leading-tight text-ink-200 transition-colors group-hover:text-white">
                      {platform.shortName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
