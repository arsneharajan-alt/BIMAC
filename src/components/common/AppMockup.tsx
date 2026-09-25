import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import type { GlyphId, MockupLayout } from "@/types";

/**
 * Product UI mockups.
 *
 * Rather than shipping screenshot images we cannot verify or license, every
 * product "screenshot" is a drawn interface: real chrome, real-looking density,
 * brand-orange accents only where a real UI would put them. Five layouts cover
 * the whole catalogue.
 */

function Bar({
  w,
  tone = "muted",
  className,
}: {
  w: string;
  tone?: "muted" | "strong" | "brand" | "faint";
  className?: string;
}) {
  const tones = {
    faint: "bg-ink-200/70",
    muted: "bg-ink-300/80",
    strong: "bg-ink-500/80",
    brand: "bg-brand-400",
  } as const;
  return <span className={cn("block h-1.5 rounded-full", tones[tone], className)} style={{ width: w }} />;
}

function Pill({ label, tone = "ok" }: { label: string; tone?: "ok" | "warn" | "brand" }) {
  const tones = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-700 ring-amber-200",
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-px text-[0.5rem] font-medium leading-4 ring-1 ring-inset",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}

function Chrome({
  title,
  glyph,
  children,
  className,
}: {
  title: string;
  glyph: GlyphId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-ink-200/90 bg-white shadow-lift",
        className,
      )}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-ink-200/80 bg-ink-50/80 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
        </div>
        <div className="ml-1 flex items-center gap-1.5 text-[0.625rem] font-medium text-ink-600">
          <Icon name={glyph} className="text-[0.75rem] text-brand-500" />
          {title}
        </div>
      </div>
      {/* ribbon */}
      <div className="flex items-center gap-1 border-b border-ink-200/70 bg-white px-3 py-1.5">
        {["File", "Tools", "Data", "Report"].map((tab, index) => (
          <span
            key={tab}
            className={cn(
              "rounded px-1.5 py-0.5 text-[0.5625rem] font-medium",
              index === 1 ? "bg-brand-50 text-brand-700" : "text-ink-500",
            )}
          >
            {tab}
          </span>
        ))}
        <span className="ml-auto flex gap-1">
          <span className="h-3.5 w-3.5 rounded bg-ink-100" />
          <span className="h-3.5 w-3.5 rounded bg-ink-100" />
        </span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TableLayout() {
  const rows = [
    { w: "72%", pill: "ok" as const, label: "PASS" },
    { w: "58%", pill: "ok" as const, label: "PASS" },
    { w: "81%", pill: "warn" as const, label: "REVIEW" },
    { w: "64%", pill: "ok" as const, label: "PASS" },
    { w: "76%", pill: "brand" as const, label: "MAPPED" },
    { w: "52%", pill: "ok" as const, label: "PASS" },
    { w: "69%", pill: "warn" as const, label: "REVIEW" },
    { w: "60%", pill: "ok" as const, label: "PASS" },
  ];
  return (
    <div className="flex">
      <aside className="hidden w-28 shrink-0 space-y-2.5 border-r border-ink-200/70 bg-ink-50/50 p-3 sm:block">
        <Bar w="70%" tone="strong" />
        {["100%", "80%", "90%", "65%", "85%"].map((w, index) => (
          <Bar key={index} w={w} tone={index === 1 ? "brand" : "faint"} />
        ))}
        <div className="pt-2">
          <Bar w="60%" tone="strong" />
        </div>
        {["75%", "88%"].map((w, index) => (
          <Bar key={`b${index}`} w={w} tone="faint" />
        ))}
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 border-b border-ink-200/70 px-3 py-2">
          <span className="h-3 w-3 rounded-sm border border-ink-300" />
          <Bar w="18%" tone="strong" />
          <Bar w="12%" tone="strong" />
          <span className="ml-auto">
            <Bar w="40px" tone="strong" />
          </span>
        </div>
        <div className="divide-y divide-ink-100">
          {rows.map((row, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-[0.4375rem]">
              <span
                className={cn(
                  "grid h-3 w-3 place-items-center rounded-sm border",
                  index < 3 ? "border-brand-400 bg-brand-500" : "border-ink-300",
                )}
              >
                {index < 3 ? (
                  <Icon name="check" className="text-[0.4rem] text-white" strokeWidth={3.5} />
                ) : null}
              </span>
              <Bar w={row.w} tone={index % 3 === 0 ? "muted" : "faint"} className="max-w-[9rem]" />
              <span className="ml-auto">
                <Pill label={row.label} tone={row.pill} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PanelLayout() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 space-y-3 p-4">
        <Bar w="45%" tone="strong" />
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="space-y-1.5">
            <Bar w={`${28 + index * 6}%`} tone="faint" />
            <div className="h-6 rounded border border-ink-200 bg-ink-50/60" />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <span className="h-6 w-20 rounded bg-brand-500" />
          <span className="h-6 w-16 rounded border border-ink-200 bg-white" />
        </div>
      </div>
      <aside className="hidden w-40 shrink-0 space-y-2 border-l border-ink-200/70 bg-ink-50/50 p-3 sm:block">
        <Bar w="60%" tone="strong" />
        {[
          { w: "88%", brand: false },
          { w: "72%", brand: true },
          { w: "94%", brand: false },
          { w: "66%", brand: false },
          { w: "80%", brand: false },
          { w: "58%", brand: true },
        ].map((row, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-1.5 rounded px-1.5 py-1.5",
              row.brand ? "bg-brand-50" : "bg-white",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-sm",
                row.brand ? "bg-brand-500" : "bg-ink-300",
              )}
            />
            <Bar w={row.w} tone={row.brand ? "muted" : "faint"} />
          </div>
        ))}
      </aside>
    </div>
  );
}

function DashboardLayout() {
  const bars = [38, 62, 45, 78, 54, 88, 66, 72, 49, 84, 58, 70];
  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {[
          { value: "780", label: "issues" },
          { value: "94%", label: "closed" },
          { value: "12", label: "open" },
          { value: "4.2d", label: "avg age" },
        ].map((tile, index) => (
          <div
            key={tile.label}
            className={cn(
              "rounded-lg border p-2",
              index === 0 ? "border-brand-200 bg-brand-50/60" : "border-ink-200/80 bg-ink-50/40",
            )}
          >
            <div
              className={cn(
                "font-display text-sm font-semibold leading-none tracking-tight",
                index === 0 ? "text-brand-700" : "text-ink-800",
              )}
            >
              {tile.value}
            </div>
            <div className="mt-1 text-[0.5rem] uppercase tracking-wider text-ink-400">
              {tile.label}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-ink-200/80 p-3">
        <div className="mb-2 flex items-center justify-between">
          <Bar w="30%" tone="strong" />
          <Bar w="15%" tone="faint" />
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((height, index) => (
            <span
              key={index}
              className={cn(
                "flex-1 rounded-t-sm",
                index >= bars.length - 3 ? "bg-brand-500" : "bg-ink-200",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5 rounded-lg border border-ink-200/80 p-3">
        {["82%", "64%", "71%"].map((w, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            <Bar w={w} tone="faint" />
            <span className="ml-auto">
              <Bar w="24px" tone="muted" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewerLayout() {
  return (
    <div className="flex">
      <div className="relative min-h-[13rem] min-w-0 flex-1 bg-navy">
        <span className="absolute inset-0 bg-grid-dark bg-grid opacity-50" aria-hidden="true" />
        <svg viewBox="0 0 260 180" className="relative h-full w-full" aria-hidden="true">
          <g stroke="#98A1AC" strokeOpacity="0.55" strokeWidth="1" fill="none">
            <path d="M130 42 200 82 130 122 60 82z" />
            <path d="M130 66 200 106 130 146 60 106z" />
            <path d="M60 82v24M200 82v24M130 122v24M130 42v24" />
          </g>
          <path d="M104 76 130 91 156 76 130 61z" fill="#F55F16" fillOpacity="0.9" />
          <path d="M104 76v18l26 15V91z" fill="#BB330A" fillOpacity="0.9" />
          <path d="M156 76v18l-26 15V91z" fill="#E24709" fillOpacity="0.9" />
          <circle cx="130" cy="61" r="3" fill="#FFCDAA" />
          <path
            d="M130 61 130 30 178 30"
            stroke="#FB7C3C"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
          />
        </svg>
      </div>
      <aside className="w-40 shrink-0 space-y-2 border-l border-ink-200/70 bg-white p-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <Bar w="60%" tone="strong" />
        </div>
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="space-y-1 rounded border border-ink-200/70 p-1.5">
            <Bar w={index === 0 ? "80%" : "62%"} tone={index === 0 ? "muted" : "faint"} />
            <div className="flex items-center gap-1">
              <Pill label={index === 0 ? "OPEN" : "CLOSED"} tone={index === 0 ? "warn" : "ok"} />
              <Bar w="28px" tone="faint" />
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

function WizardLayout() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-1.5">
        {["1", "2", "3", "4"].map((step, index) => (
          <div key={step} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                "grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.5rem] font-semibold",
                index <= 1 ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-400",
              )}
            >
              {step}
            </span>
            {index < 3 ? (
              <span
                className={cn(
                  "h-px flex-1",
                  index === 0 ? "bg-brand-300" : "bg-ink-200",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Bar w="52%" tone="strong" />
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-1.5">
              <Bar w={`${30 + index * 8}%`} tone="faint" />
              <div
                className={cn(
                  "h-6 rounded border bg-white",
                  index === 0 ? "border-brand-300 ring-2 ring-brand-100" : "border-ink-200",
                )}
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <span className="h-3 w-3 rounded-sm border border-brand-400 bg-brand-500" />
            <Bar w="55%" tone="faint" />
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Icon name="grid" className="text-[0.7rem] text-ink-400" />
            <Bar w="40%" tone="faint" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "aspect-[4/3] rounded border",
                  index === 4
                    ? "border-brand-300 bg-brand-50"
                    : "border-ink-200 bg-white",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const layouts: Record<MockupLayout, ComponentType> = {
  table: TableLayout,
  panel: PanelLayout,
  dashboard: DashboardLayout,
  viewer: ViewerLayout,
  wizard: WizardLayout,
};

export function AppMockup({
  layout,
  title,
  glyph,
  className,
}: {
  layout: MockupLayout;
  title: string;
  glyph: GlyphId;
  className?: string;
}) {
  const Layout = layouts[layout];
  return (
    <Chrome title={title} glyph={glyph} className={className}>
      <Layout />
    </Chrome>
  );
}

export default AppMockup;
