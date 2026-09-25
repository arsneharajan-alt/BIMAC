"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { LogoMark, Wordmark } from "@/components/common/Logo";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The enquiry form.
 *
 * Where it goes, and why it goes there. BIMAC has no checkout and no server —
 * `ContactActions` already routes every commercial action on the site to
 * WhatsApp or email, and this form is the same road with the turning made
 * explicit. Submitting composes the enquiry and hands it to the visitor's mail
 * client addressed to BIMAC; WhatsApp sits beside it for anyone who would
 * rather not open mail at all.
 *
 * It is worth being plain about the alternative that was not built. A form
 * that POSTs somewhere looks more finished and, with no destination wired up,
 * quietly drops the enquiry — which for a form whose entire job is to deliver
 * a lead is the one failure that must not be silent. Handing off to mail means
 * the visitor can see their own message leave. When there is a backend, this
 * component is the only file that has to change.
 *
 * The fields are Kaydenz's: name, email, phone with a dialling code. `context`
 * carries the tool or page through into the subject, exactly as `emailLink`
 * does, so an enquiry arrives already saying what it is about.
 */

/**
 * Dialling codes, UAE first.
 *
 * A short list on purpose. The full ITU set is 200-odd entries, and a select
 * that long is worse to use than a text field; these are the markets BIMAC
 * actually sells into, and anything else can be typed into the number.
 */
const DIAL_CODES = [
  { code: "+971", label: "AE (+971)" },
  { code: "+966", label: "SA (+966)" },
  { code: "+974", label: "QA (+974)" },
  { code: "+968", label: "OM (+968)" },
  { code: "+973", label: "BH (+973)" },
  { code: "+965", label: "KW (+965)" },
  { code: "+91", label: "IN (+91)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US (+1)" },
  { code: "+61", label: "AU (+61)" },
] as const;

type Field = "name" | "email" | "phone";

/**
 * Validation, kept deliberately loose.
 *
 * The only job here is to catch the mistakes a visitor would want catching —
 * an empty field, a missing `@`. Anything stricter rejects real people: valid
 * addresses that a regex does not believe in, and phone numbers written with
 * spaces, dashes or brackets are all perfectly reachable.
 */
function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "That does not look like an email address.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (values.phone.replace(/\D/g, "").length < 6) errors.phone = "That number looks too short.";
  return errors;
}

export function EnquiryForm({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  /** Tool or page name, carried into the subject line. */
  context?: string;
}) {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", phone: "" });
  const [dial, setDial] = useState<string>(DIAL_CODES[0].code);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  /** Set once the mail client has been handed the enquiry. */
  const [sent, setSent] = useState(false);

  const firstRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const ids = useId();

  /* Focus the first field, close on Escape, and stop the page behind from
     scrolling — the same contract SearchOverlay keeps. */
  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => firstRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  /* A fresh form each time it opens. Someone who closed it half-filled and
     came back almost certainly wants to start again, and leaving the last
     enquiry sitting there is worse than an empty field. */
  useEffect(() => {
    if (open) return;
    setValues({ name: "", email: "", phone: "" });
    setErrors({});
    setSent(false);
  }, [open]);

  if (!open) return null;

  const set = (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    /* Clear this field's error as soon as it is touched. Holding an error on
       screen while someone is actively fixing it just reads as nagging. */
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const phone = `${dial} ${values.phone.trim()}`.trim();

  const message =
    `Name: ${values.name.trim()}\n` +
    `Email: ${values.email.trim()}\n` +
    `Phone: ${phone}\n\n` +
    (context
      ? `I'd like to know more about ${context}.`
      : "I'd like to know more about your BIM automation tools.");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      /* Send focus to the first thing that is wrong, so the error is not just
         announced but arrived at. */
      const first = (["name", "email", "phone"] as const).find((f) => found[f]);
      if (first) panelRef.current?.querySelector<HTMLInputElement>(`#${ids}-${first}`)?.focus();
      return;
    }

    const subject = context ? `Enquiry — ${context}` : "BIMAC enquiry";
    window.location.href =
      `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setSent(true);
  };

  const field =
    "h-12 w-full rounded-lg border bg-white px-3.5 text-[0.9375rem] text-ink-900 outline-none transition-colors " +
    "placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20";

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${ids}-title`}
    >
      <button
        type="button"
        aria-label="Close enquiry form"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default animate-fade-in bg-ink-950/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative mx-auto my-[6vh] w-[min(34rem,calc(100%-2rem))] animate-scale-in rounded-2xl border border-ink-200 bg-white p-7 shadow-panel sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
        >
          <Icon name="close" className="text-[1.05rem]" />
        </button>

        {/* The mark, not `Logo` — that one is a link home, and a logo that
            navigates out of the dialog it heads is a trap, not a masthead. */}
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <Wordmark className="text-[1.25rem]" />
        </div>

        {sent ? (
          /* The handover happened in the visitor's mail client, which this page
             cannot see the result of. So this does not claim the message was
             sent — it says what was done and leaves the other routes open. */
          <div className="mt-7">
            <h2 id={`${ids}-title`} className="font-display text-xl font-semibold text-ink-950">
              Your email is ready to send
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
              We have opened your mail app with the enquiry filled in. Send it and we will come
              back to you. If nothing opened, write to{" "}
              <a className="font-medium text-brand-600 underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              or message us below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(context)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-sm font-medium text-[#0B2E13] transition-colors hover:bg-[#1FBB58]"
              >
                <Icon name="whatsapp" className="text-[1.15em]" />
                WhatsApp instead
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center rounded-lg border border-ink-200 px-5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2
              id={`${ids}-title`}
              className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-ink-950"
            >
              Enquiry form
            </h2>
            {context ? (
              <p className="mt-1.5 text-[0.9375rem] text-ink-600">About {context}.</p>
            ) : null}

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div>
                <label htmlFor={`${ids}-name`} className="block text-sm font-medium text-ink-800">
                  Name
                </label>
                <input
                  ref={firstRef}
                  id={`${ids}-name`}
                  name="name"
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Enter name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${ids}-name-error` : undefined}
                  className={cn(field, "mt-1.5", errors.name ? "border-red-500" : "border-ink-200")}
                />
                {errors.name ? (
                  <p id={`${ids}-name-error`} className="mt-1.5 text-[0.8125rem] text-red-600">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor={`${ids}-email`} className="block text-sm font-medium text-ink-800">
                  Email
                </label>
                <input
                  id={`${ids}-email`}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={set("email")}
                  placeholder="Enter email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${ids}-email-error` : undefined}
                  className={cn(field, "mt-1.5", errors.email ? "border-red-500" : "border-ink-200")}
                />
                {errors.email ? (
                  <p id={`${ids}-email-error`} className="mt-1.5 text-[0.8125rem] text-red-600">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor={`${ids}-phone`} className="block text-sm font-medium text-ink-800">
                  Phone
                </label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    value={dial}
                    onChange={(event) => setDial(event.target.value)}
                    aria-label="Dialling code"
                    className="h-12 shrink-0 rounded-lg border border-ink-200 bg-white px-2.5 text-[0.9375rem] text-ink-900 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  >
                    {DIAL_CODES.map((entry) => (
                      <option key={entry.code} value={entry.code}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id={`${ids}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={set("phone")}
                    placeholder="Enter phone number"
                    autoComplete="tel-national"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? `${ids}-phone-error` : undefined}
                    className={cn(field, errors.phone ? "border-red-500" : "border-ink-200")}
                  />
                </div>
                {errors.phone ? (
                  <p id={`${ids}-phone-error`} className="mt-1.5 text-[0.8125rem] text-red-600">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="h-12 w-full rounded-lg bg-brand-500 text-[0.9375rem] font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.99]"
                >
                  Submit
                </button>
                <p className="mt-3 text-center text-[0.8125rem] text-ink-500">
                  Prefer to talk?{" "}
                  <a
                    href={whatsappLink(context)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-600 underline"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EnquiryForm;
