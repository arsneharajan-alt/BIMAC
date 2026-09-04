"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ContactActions from "@/components/common/ContactActions";
import ProductMark from "@/components/common/ProductMark";
import { disciplineFamilies, disciplineMap } from "@/data/disciplines";
import { stages } from "@/data/stages";
import { softwarePlatforms } from "@/data/software";
import { capabilityCount } from "@/lib/software";
import { familyCount } from "@/lib/tools";
import { cn } from "@/lib/utils";

/** The mega menu restructured as an accordion drawer, discipline first. */
export function MobileNav({
  open,
  onClose,
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}) {
  const [openSection, setOpenSection] = useState<string | null>("architecture");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 animate-fade-in"
      />
      <div className="absolute inset-y-0 right-0 flex w-[min(24rem,90%)] flex-col bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600 transition-colors hover:bg-ink-50"
          >
            <Icon name="close" className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-ink-200 p-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3 text-left text-sm text-ink-500 transition-colors hover:border-ink-300"
            >
              <Icon name="search" className="text-base text-ink-400" />
              Search tools...
            </button>
          </div>

          <nav className="p-3">
            <p className="px-2 pb-2 pt-1 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              What do you work with?
            </p>

            {disciplineFamilies.map((family) => {
              const isOpen = openSection === family.id;
              const children =
                family.id === "mepf"
                  ? family.members.map((id) => ({
                      label: disciplineMap[id].shortName,
                      href: `/tools/${disciplineMap[id].slug}`,
                    }))
                  : disciplineMap[family.members[0]].groups.map((group) => ({
                      label: group.name,
                      href: `/tools/${family.slug}#${group.id}`,
                    }));

              return (
                <div key={family.id} className="border-b border-ink-100 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? null : family.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-2.5 px-2 py-3.5 text-left"
                  >
                    <Icon name={family.glyph} className="text-base text-brand-500" />
                    <span className="text-[0.9375rem] font-medium text-ink-900">
                      {family.name}
                    </span>
                    <span className="ml-auto font-mono text-2xs text-ink-400">
                      {familyCount(family.id)}
                    </span>
                    <Icon
                      name="chevron-down"
                      className={cn(
                        "text-sm text-ink-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-brand-500",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="pb-3">
                        <li>
                          <Link
                            href={`/tools/${family.slug}`}
                            onClick={onClose}
                            className="block rounded-lg px-2 py-2 text-[0.875rem] font-medium text-brand-600 hover:bg-brand-50"
                          >
                            All {family.shortName} tools &rarr;
                          </Link>
                        </li>
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block rounded-lg px-2 py-2 text-[0.875rem] text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-600"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            <p className="px-2 pb-2 pt-4 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              Software
            </p>
            <ul className="pb-2">
              <li>
                <Link
                  href="/software"
                  onClick={onClose}
                  className="block rounded-lg px-2 py-2 text-[0.875rem] font-medium text-azure-600 hover:bg-azure-50"
                >
                  All software &rarr;
                </Link>
              </li>
              {softwarePlatforms.map((platform) => (
                <li key={platform.id}>
                  <Link
                    href={`/software/${platform.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[0.875rem] text-ink-600 transition-colors hover:bg-azure-50 hover:text-azure-700"
                  >
                    <ProductMark platform={platform} size="xs" />
                    {platform.shortName}
                    <span className="ml-auto font-mono text-2xs text-ink-400">
                      {capabilityCount(platform)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="px-2 pb-2 pt-4 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              Project stages
            </p>
            <ul className="pb-2">
              {stages.map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/stages/${stage.slug}`}
                    onClick={onClose}
                    className="block rounded-lg px-2 py-2 text-[0.875rem] text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-600"
                  >
                    {stage.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-2 border-t border-ink-100 pt-2">
              {[
                { label: "All tools", href: "/tools" },
                { label: "Custom Development", href: "/custom-development" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-lg px-2 py-3 text-[0.9375rem] font-medium text-ink-900 transition-colors hover:bg-ink-50 hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-ink-200 p-5">
          <ContactActions size="md" className="[&>a]:flex-1" />
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
