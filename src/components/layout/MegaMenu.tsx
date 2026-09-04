import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Container from "@/components/ui/Container";
import ProductMark from "@/components/common/ProductMark";
import { disciplineFamilies, disciplineMap } from "@/data/disciplines";
import { stages } from "@/data/stages";
import { softwarePlatforms } from "@/data/software";
import { capabilityCount } from "@/lib/software";
import { familyCount, groupCount, toolsForDiscipline } from "@/lib/tools";
import { cn } from "@/lib/utils";

/**
 * The Tools mega menu.
 *
 * Discipline first, then that discipline's lifecycle inside it — so an
 * architect sees "Architecture → Site, Concept, Schematic, Detailed,
 * Documentation, Coordination, Construction, As-Built" and never has to know
 * which host application a plugin loads into.
 *
 * Two secondary rails sit underneath: the software the work happens in, and the
 * project stage it happens at. Both are alternative ways into the same tools.
 */
export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="border-b border-ink-200 bg-white shadow-panel">
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {disciplineFamilies.map((family) => {
            const isMep = family.id === "mepf";
            return (
              <div key={family.id}>
                <Link
                  href={`/tools/${family.slug}`}
                  onClick={onNavigate}
                  className="group mb-4 flex items-center gap-2.5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50">
                    <Icon name={family.glyph} className="text-base" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-[0.9375rem] font-semibold tracking-tight text-ink-950 group-hover:text-brand-600">
                      {family.name}
                      <Icon
                        name="arrow-right"
                        className="text-[0.7rem] text-brand-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </span>
                    <span className="block font-mono text-2xs text-ink-400">
                      {familyCount(family.id)} tools
                    </span>
                  </span>
                </Link>

                {isMep ? (
                  /* MEPF lists its seven services, each linking to its own hub. */
                  <ul className="space-y-0.5">
                    {family.members.map((id) => {
                      const discipline = disciplineMap[id];
                      return (
                        <li key={id}>
                          <Link
                            href={`/tools/${discipline.slug}`}
                            onClick={onNavigate}
                            className="group flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-ink-50"
                          >
                            <Icon
                              name={discipline.glyph}
                              className="text-[0.9rem] text-ink-400 group-hover:text-brand-500"
                            />
                            <span className="text-[0.875rem] font-medium text-ink-800 group-hover:text-brand-600">
                              {discipline.shortName}
                            </span>
                            <span className="ml-auto font-mono text-2xs text-ink-400">
                              {toolsForDiscipline(id).length}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="space-y-0.5">
                    {disciplineMap[family.members[0]].groups.map((group) => (
                      <li key={group.id}>
                        <Link
                          href={`/tools/${family.slug}#${group.id}`}
                          onClick={onNavigate}
                          className="group flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-ink-50"
                        >
                          <span className="text-[0.875rem] text-ink-700 group-hover:text-brand-600">
                            {group.name}
                          </span>
                          <span className="ml-auto font-mono text-2xs text-ink-400">
                            {groupCount(family.members[0], group.id)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* software rail */}
        <div className="mt-8 border-t border-ink-200 pt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              <span className="h-px w-4 bg-azure-500" />
              Or browse by software
            </p>
            <Link
              href="/software"
              onClick={onNavigate}
              className="inline-flex items-center gap-1 text-2xs font-medium text-azure-600 hover:text-azure-700"
            >
              All software
              <Icon name="arrow-right" className="text-[0.7rem]" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {softwarePlatforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/software/${platform.slug}`}
                onClick={onNavigate}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2",
                  "text-[0.8125rem] text-ink-700 transition-all",
                  "hover:border-azure-300 hover:bg-azure-50 hover:text-azure-700",
                )}
              >
                <ProductMark platform={platform} size="xs" />
                {platform.shortName}
                <span className="font-mono text-2xs text-ink-400">
                  {capabilityCount(platform)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* project stages rail */}
        <div className="mt-6 border-t border-ink-200 pt-6">
          <p className="mb-3 flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            <span className="h-px w-4 bg-brand-500" />
            Or browse by project stage
          </p>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                href={`/stages/${stage.slug}`}
                onClick={onNavigate}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2",
                  "text-[0.8125rem] text-ink-700 transition-all",
                  "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                <Icon name={stage.glyph} className="text-[0.9rem] text-ink-400 group-hover:text-brand-500" />
                {stage.name}
                <span className="font-mono text-2xs text-ink-400">{stage.lod}</span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MegaMenu;
