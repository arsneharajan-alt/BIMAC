import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { emailLink, site, whatsappLink } from "@/lib/site";

/**
 * Every commercial action on the site routes here.
 *
 * There is no checkout at this stage, so "Buy Now" is replaced by a direct
 * line to BIMAC. The tool name is carried into both the WhatsApp message and
 * the email subject, so an enquiry arrives already saying which plugin it is
 * about.
 */
export function ContactActions({
  context,
  size = "md",
  variant = "light",
  className,
  showLabels = true,
}: {
  /** Tool or page name, carried into the message. */
  context?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
  showLabels?: boolean;
}) {
  const heights = {
    sm: "h-9 px-3.5 text-[0.8125rem]",
    md: "h-11 px-5 text-sm",
    lg: "h-[3.25rem] px-7 text-[0.9375rem]",
  } as const;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href={whatsappLink(context)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group/wa inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all duration-200",
          "bg-[#25D366] text-[#0B2E13] hover:bg-[#1FBB58]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-2",
          variant === "dark" ? "focus-visible:ring-offset-ink-950" : "focus-visible:ring-offset-white",
          heights[size],
        )}
      >
        <Icon name="whatsapp" className="text-[1.15em]" />
        {showLabels ? "Enquire on WhatsApp" : "WhatsApp"}
      </a>

      <a
        href={emailLink(context)}
        className={cn(
          "group/mail inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all duration-200",
          variant === "dark"
            ? "border border-white/20 text-white hover:border-white/40 hover:bg-white/5 focus-visible:ring-offset-ink-950"
            : "border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-offset-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60",
          heights[size],
        )}
      >
        <Icon name="mail" className="text-[1.1em]" />
        {showLabels ? "Email Us" : "Email"}
      </a>
    </div>
  );
}

/** Compact icon-only pair used inside tool cards. */
export function ContactActionsCompact({ context }: { context: string }) {
  return (
    <div className="relative z-10 ml-auto flex items-center gap-1.5">
      <a
        href={whatsappLink(context)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enquire about ${context} on WhatsApp`}
        title="Enquire on WhatsApp"
        className="grid h-8 w-8 place-items-center rounded-md border border-ink-200 bg-white text-[#128C4A] transition-all hover:border-[#25D366] hover:bg-[#25D366]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
      >
        <Icon name="whatsapp" className="text-sm" />
      </a>
      <a
        href={emailLink(context)}
        aria-label={`Email about ${context}`}
        title="Email us"
        className="grid h-8 w-8 place-items-center rounded-md border border-ink-200 bg-white text-ink-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      >
        <Icon name="mail" className="text-sm" />
      </a>
    </div>
  );
}

/** Full-width band used to close pages. */
export function ContactBand({
  title,
  lede,
  context,
}: {
  title: string;
  lede: string;
  context?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/15 blur-[130px]"
      />
      <div className="relative mx-auto w-full max-w-container px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tightest text-white sm:text-[2.75rem] sm:leading-[1.1]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
            {lede}
          </p>
          <ContactActions
            context={context}
            size="lg"
            variant="dark"
            className="mt-9 justify-center"
          />
          <p className="mt-6 font-mono text-2xs text-ink-500">
            {site.phoneDisplay} · {site.email}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ContactActions;
