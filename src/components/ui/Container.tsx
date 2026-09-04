import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        // Tight gutters — the cap above does the work of keeping lines readable.
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        wide ? "max-w-[118rem]" : "max-w-container",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
