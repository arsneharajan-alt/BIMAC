import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

/** Feature list — plain strings, so adding a tool stays cheap. */
export function ToolFeatures({ features }: { features: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <li
          key={feature}
          className="group flex gap-3.5 rounded-xl border border-ink-200 bg-white p-5 transition-colors hover:border-brand-300"
        >
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
            <Icon name="check" className="text-[0.7rem]" strokeWidth={3} />
          </span>
          <span className="text-card-body text-ink-700">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/** Inputs on the left, outputs on the right — what goes in, what comes out. */
export function ToolIO({ inputs, outputs }: { inputs: string[]; outputs: string[] }) {
  const columns = [
    {
      title: "What it needs",
      glyph: "download" as const,
      items: inputs,
      tone: "neutral" as const,
    },
    {
      title: "What you get",
      glyph: "package" as const,
      items: outputs,
      tone: "brand" as const,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {columns.map((column) => (
        <div
          key={column.title}
          className={cn(
            "rounded-2xl border p-7",
            column.tone === "brand"
              ? "border-brand-200 bg-brand-50/50"
              : "border-ink-200 bg-ink-50/60",
          )}
        >
          <p
            className={cn(
              "mb-5 flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.14em]",
              column.tone === "brand" ? "text-brand-700" : "text-ink-500",
            )}
          >
            <Icon name={column.glyph} className="text-[0.95rem]" />
            {column.title}
          </p>
          <ul className="space-y-3">
            {column.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className={cn(
                    "mt-[0.55rem] h-1 w-1 shrink-0 rounded-full",
                    column.tone === "brand" ? "bg-brand-500" : "bg-ink-400",
                  )}
                />
                <span className="text-card-body text-ink-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * A four-step process derived from the tool itself, so every tool page has a
 * "how it works" section without needing bespoke copy for all 73 of them.
 */
export function ToolProcess({ tool }: { tool: Tool }) {
  const steps = [
    {
      title: "Prepare the inputs",
      description: `Point ${tool.name} at ${tool.inputs[0]?.toLowerCase() ?? "your source data"} and confirm the mapping to your project standard.`,
    },
    {
      title: "Configure once, reuse",
      description:
        "Settings are saved with the project or the office template, so the next run — and the next project — starts configured.",
    },
    {
      title: "Review before it writes",
      description:
        "The proposed changes are shown as a reviewable set. Nothing is written to the model until you approve it.",
    },
    {
      title: "Take the output forward",
      description: `You get ${tool.outputs[0]?.toLowerCase() ?? "the result"}, plus a report of anything that needed manual attention.`,
    },
  ];

  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy font-mono text-[0.8125rem] font-semibold text-white">
              {index + 1}
            </span>
            {index < steps.length - 1 ? (
              <span className="hidden h-px flex-1 bg-gradient-to-r from-ink-200 to-transparent sm:block" />
            ) : null}
          </div>
          <h3 className="mt-4 text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
            {step.title}
          </h3>
          <p className="mt-1.5 text-card-body text-ink-600">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
