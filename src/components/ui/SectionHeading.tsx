import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The eyebrow/title/lede block used at the top of every major section.
 * The eyebrow carries a short brand-orange rule so sections read as a system.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  onDark = false,
  accent = "brand",
  className,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  /** `azure` marks a section on the software axis rather than the discipline one. */
  accent?: "brand" | "azure";
  className?: string;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  const isAzure = accent === "azure";
  return (
    <div
      // Every section heading on the site reveals on scroll from this one line.
      data-reveal=""
      className={cn(
        "flex w-full flex-col gap-5",
        align === "center" && "items-center text-center",
        action ? "sm:flex-row sm:items-end sm:justify-between" : null,
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <div
            className={cn(
              "mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em]",
              align === "center" && "justify-center",
              onDark
                ? isAzure
                  ? "text-azure-300"
                  : "text-brand-300"
                : isAzure
                  ? "text-azure-600"
                  : "text-brand-600",
            )}
          >
            <span className={cn("h-px w-6", isAzure ? "bg-azure-500" : "bg-brand-500")} />
            {eyebrow}
          </div>
        ) : null}
        <Tag
          className={cn(
            "font-display font-semibold tracking-tightest text-balance",
            Tag === "h1"
              ? "text-4xl leading-[1.06] sm:text-5xl lg:text-[3.4rem]"
              : "text-[1.75rem] leading-[1.15] sm:text-4xl",
            onDark ? "text-white" : "text-ink-950",
          )}
        >
          {title}
        </Tag>
        {lede ? (
          <p
            className={cn(
              "mt-4 text-[1.0625rem] leading-relaxed text-pretty",
              onDark ? "text-ink-300" : "text-ink-600",
            )}
          >
            {lede}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default SectionHeading;
