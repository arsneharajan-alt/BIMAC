"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({
  items,
  className,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  className?: string;
  /** Index to open initially; pass -1 for all closed. */
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className={cn("divide-y divide-ink-200/80 border-y border-ink-200/80", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              >
                <span className="text-[0.9375rem] font-medium leading-6 tracking-tight text-ink-900 group-hover:text-brand-600">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition-all duration-200",
                    isOpen && "rotate-45 border-brand-300 bg-brand-50 text-brand-600",
                  )}
                >
                  <Icon name="plus" className="text-[0.7rem]" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
