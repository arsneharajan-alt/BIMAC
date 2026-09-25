import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import ProductGlyph from "@/components/common/ProductGlyph";
import { ContactActionsCompact } from "@/components/common/ContactActions";
import { disciplineMap } from "@/data/disciplines";
import { softwareMap } from "@/data/stages";
import { toolHref } from "@/data/tools";
import { statusLabels } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { Tool, ToolStatus } from "@/types";

const statusDot: Record<ToolStatus, string> = {
  available: "bg-emerald-500",
  "in-development": "bg-amber-500",
  planned: "bg-ink-400",
};

function StatusPill({ status }: { status: ToolStatus }) {
  return (
    <Badge tone="outline" className="shrink-0">
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])} />
      {statusLabels[status]}
    </Badge>
  );
}

/**
 * The catalogue card.
 *
 * Discipline badges come first because that is what the visitor is scanning
 * for. Multi-discipline tools show every discipline they serve, which is how
 * CAD-to-Revit reads as one product rather than six.
 */
export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  const shownDisciplines = tool.disciplines.slice(0, 3);
  const extraCount = tool.disciplines.length - shownDisciplines.length;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white",
        "shadow-card transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift",
        "focus-within:border-brand-400 focus-within:shadow-lift",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3.5">
          <ProductGlyph glyph={tool.glyph} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="text-balance font-display text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
              {tool.name}
            </h3>
          </div>
          <StatusPill status={tool.status} />
        </div>

        <p className="mt-3.5 line-clamp-2 text-card-body text-ink-600">{tool.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {shownDisciplines.map((id) => (
            <Badge key={id} tone="brand">
              {disciplineMap[id].shortName}
            </Badge>
          ))}
          {extraCount > 0 ? <Badge tone="neutral">+{extraCount} more</Badge> : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
          {tool.software.slice(0, 3).map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 text-2xs text-ink-500"
              title={softwareMap[id].name}
            >
              <Icon name={softwareMap[id].glyph} className="text-[0.85em] text-ink-400" />
              {softwareMap[id].shortName}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-ink-100 bg-ink-50/50 px-5 py-3">
        <Link
          href={toolHref(tool)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded text-card-meta font-medium text-ink-900",
            "transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-brand-500/50 focus-visible:ring-offset-2",
            "after:absolute after:inset-0 after:content-['']",
          )}
        >
          View Tool
          <Icon
            name="arrow-right"
            className="text-[0.85rem] text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
        <ContactActionsCompact context={tool.name} />
      </div>
    </article>
  );
}

/** Compact horizontal variant for related lists and sidebars. */
export function ToolCardCompact({ tool }: { tool: Tool }) {
  return (
    <Link
      href={toolHref(tool)}
      className="group flex items-start gap-3.5 rounded-xl border border-ink-200 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
    >
      <ProductGlyph glyph={tool.glyph} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h4 className="text-card-title font-medium text-ink-950 group-hover:text-brand-600 lg:text-card-title-lg">
            {tool.name}
          </h4>
          <Icon
            name="arrow-right"
            className="ml-auto mt-0.5 shrink-0 text-sm text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500"
          />
        </div>
        <p className="mt-1 line-clamp-2 text-card-body text-ink-500">{tool.summary}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">{disciplineMap[tool.disciplines[0]].shortName}</Badge>
          <Badge tone="outline">
            <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[tool.status])} />
            {statusLabels[tool.status]}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;
