import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import LogoTile from "@/components/common/LogoTile";
import { softwareMenuColumns, softwareMenuHref } from "@/data/software-menu";
import type { SoftwareMenuItem } from "@/data/software-menu";
import { cn } from "@/lib/utils";

/**
 * The stack we automate inside, on its own band under the hero.
 *
 * It used to sit inside the blue, competing with the headline for the same
 * screen. Here it gets the full width of a white band of its own: two rows of
 * ten pulling in opposite directions, so the whole stack passes by without
 * asking for twenty columns of space. Rendering is left out — it is a look,
 * not an application, and its mark is a photograph rather than a logo.
 */

const MARQUEE = softwareMenuColumns
  .flatMap((column) => column.items)
  .filter((item) => item.id !== "render");

const ROW_ONE = MARQUEE.slice(0, 10);
const ROW_TWO = MARQUEE.slice(10, 20);

/**
 * One running row. Two identical halves of the list sit side by side and the
 * track scrolls exactly one half-width, so the loop closes with no seam and no
 * jump. Masked at both edges so logos fade out rather than being cut off, and
 * it parks while the pointer is over it.
 */
function SoftwareRow({ items, reverse }: { items: SoftwareMenuItem[]; reverse?: boolean }) {
  return (
    <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <ul
        className={cn(
          "flex w-max items-center gap-4 pr-4 sm:gap-5 sm:pr-5",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none",
        )}
      >
        {[...items, ...items].map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <Link
              href={softwareMenuHref(item)}
              title={`${item.name} — ${item.role}`}
              aria-hidden={index >= items.length}
              tabIndex={index >= items.length ? -1 : undefined}
              className="group/item flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-5 py-3.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-azure-300 hover:shadow-lift"
            >
              <LogoTile platform={item} size="md" className="border-ink-100" />
              <span className="whitespace-nowrap text-[0.9375rem] font-medium leading-tight text-ink-800 transition-colors group-hover/item:text-azure-700">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SoftwareMarquee() {
  return (
    <section className="border-b border-ink-200 bg-white py-7 sm:py-8">
      <Container>
        {/* One small line and straight into the rows: they have to be in the
            first screen, running, under the hero. */}
        <p className="flex items-center justify-center gap-3 text-center text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#073157]">
          <span className="h-[3px] w-6 rounded-full bg-brand-500" />
          Automates inside the software you already run
          <span className="h-[3px] w-6 rounded-full bg-brand-500" />
        </p>

        {/* Held inside the page gutter, so the rows start and stop level with
            the heading above them and the cards below. */}
        <div className="mt-5 space-y-3">
          <SoftwareRow items={ROW_ONE} />
          <SoftwareRow items={ROW_TWO} reverse />
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/software"
            className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-ink-700 transition-colors hover:text-brand-600"
          >
            All software
            <Icon
              name="arrow-right"
              className="text-sm text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default SoftwareMarquee;
