import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "outline" | "solid" | "dark" | "success" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200/70",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  outline: "bg-white text-ink-600 ring-1 ring-inset ring-ink-200",
  solid: "bg-brand-500 text-white",
  dark: "bg-navy text-white",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  muted: "bg-white/10 text-white ring-1 ring-inset ring-white/15",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-2xs font-medium leading-5 tracking-tight whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
