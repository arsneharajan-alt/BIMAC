import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import HeroBackdrop from "@/components/common/HeroBackdrop";
import { cn } from "@/lib/utils";

/**
 * The hero opens straight onto the page — there is no intro panel any more.
 *
 * The orange line and the button land first; the white half of the headline
 * and the promise follow a word at a time. Every delay is counted from page
 * load.
 */

/** How long after load the white half of the headline starts to arrive. */
const LEAD_MS = 250;

/** A delay, counted from page load. */
function enter(delayMs: number) {
  return { animationDelay: `${delayMs}ms` } as const;
}


/**
 * A line that arrives a word at a time.
 *
 * Each word is its own inline-block riding the shared fade-up keyframe on a
 * stagger, so the sentence assembles itself rather than appearing whole. Words
 * stay separate text nodes with real spaces between them, so the line still
 * wraps and still reads as one sentence to a screen reader.
 */
function Words({
  text,
  start = 0,
  step = 55,
  className,
}: {
  text: string;
  /** When the first word lands, in ms. */
  start?: number;
  /** Gap between one word and the next, in ms. */
  step?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className={cn("hero-staged inline-block animate-fade-up", className)}
            style={enter(start + index * step)}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function Hero({ className }: { className?: string }) {
  // Ocean blue ground: deep navy behind the copy, opening to a lighter azure
  // at the lower right where the massing rises.
  return (
    <section
      className={cn("relative flex flex-col overflow-hidden bg-navy text-white", className)}
    >
      {/* The towers, revealing themselves from the street up. */}
      <HeroBackdrop />

      <Container className="relative flex flex-1 flex-col justify-center">
        {/* One centred column: the headline, the promise and the one action,
            centred up and down in the navy. The home page lets the section
            grow to fill whatever the software strip leaves of the first
            screen — see the first-screen wrapper in app/page.tsx. */}
        <div className="flex flex-col py-12 sm:py-14">
          <div className="mx-auto max-w-5xl text-center">
            {/* Two lines, always: "Smart Automation for" / "Every Software You
                Use". The first is held on one line from lg up so the break
                never lands mid-phrase. Orange carries the two words that name
                what BIMAC sells; the rest of the sentence stays white. */}
            <h1 className="font-display font-semibold leading-[1.02] tracking-tightest text-white">
              {/* The name of the thing, and the only words the white plane
                  leaves standing. Everything else is sized against this. */}
              <span
                style={enter(90)}
                className="hero-staged block animate-fade-up font-bold text-brand-500 text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] [@media(max-height:820px)]:lg:text-[4.75rem]"
              >
                Smart Automation
              </span>
              {/* The rest of the sentence, arriving a word at a time once the
                  plane has actually gone — not just once it has started to
                  shrink. The two lines are a beat apart on purpose: the white
                  closes to a circle carrying only the orange, and the sentence
                  finishes itself on the blue behind it. */}
              <span className="mt-1 block text-[1.875rem] sm:text-[2.5rem] lg:text-[3.125rem] xl:text-[3.625rem] [@media(max-height:820px)]:lg:text-[2.75rem]">
                <Words text="for Every Software You Use" start={LEAD_MS} step={130} />
              </span>
            </h1>

            {/* The promise assembles a word at a time under the headline. */}
            <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-300 sm:text-[1.125rem] sm:leading-relaxed">
              <Words
                text="Purpose-built plugins that automate AEC workflows across Architecture, Structure and MEP — inside the software you already use."
                start={LEAD_MS + 400}
                step={46}
              />
            </p>

            {/*
              One call to action. Software is reachable from
              the header, and contact lives up there too, so the hero does not
              repeat them — it points at the catalogue and gets out of the way.
            */}
            {/* Up beside the headline rather than after the plane. These two —
                the name and the one action — are what the white is holding
                when it closes; everything else arrives on the blue. */}
            <div style={enter(220)} className="hero-staged mt-8 flex animate-fade-up justify-center">
              <Button
                href="/tools"
                size="lg"
                icon="arrow-right"
                className={[
                  // Scaled up to sit against the headline rather than under it.
                  "h-14 px-9 text-lg",
                  // A light sweeps across on hover; the whole button presses in
                  // on click, so the tap has something to answer it.
                  // The base already carries `transition-all`, so the press
                  // animates without a second transition class fighting it.
                  "overflow-hidden shadow-[0_10px_30px_-10px_rgba(245,95,22,0.55)]",
                  "active:scale-[0.97]",
                  "before:absolute before:inset-0 before:-translate-x-full before:content-['']",
                  "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
                  "before:transition-transform before:duration-700 hover:before:translate-x-full",
                ].join(" ")}
              >
                Explore Tools
              </Button>
            </div>

          </div>
        </div>

      </Container>
    </section>
  );
}

export default Hero;
