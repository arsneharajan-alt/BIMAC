import Container from "@/components/ui/Container";
import HeroIntro from "@/components/sections/HeroIntro";
import Button from "@/components/ui/Button";
import HeroBackdrop from "@/components/common/HeroBackdrop";
import { PLANE_MS } from "@/lib/hero-timing";
import { cn } from "@/lib/utils";

/**
 * The opening runs in three acts.
 *
 * First intro.mp4 plays on black — see `HeroIntro`. That panel then fades
 * into the white plane behind it, which is the same colour, so there is no
 * seam; the plane shrinks away to open the page.
 *
 * While the plane is still up, only what is orange can be seen against it: the
 * headline's first line and the button. Everything white is held back until the
 * plane has gone, so it arrives on the blue rather than appearing out of the
 * white.
 *
 * Every delay below is counted from the moment the panel leaves, not from page
 * load: the animations are marked `hero-staged` and held at their first frame
 * until then. See the gate in globals.css.
 */

/** A delay, counted from the moment the opening panel leaves. */
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

export function Hero() {
  // Ocean blue ground: deep navy behind the copy, opening to a lighter azure
  // at the lower right where the massing rises.
  return (
    // data-hero-intro is the gate: it ships closed in the markup, so nothing
    // has moved by the time the opening panel appears over it, and HeroIntro
    // opens it when the panel leaves.
    <section
      data-hero-intro="running"
      className="relative overflow-hidden bg-ink-950 text-white"
    >
      {/* The towers, revealing themselves from the street up. */}
      <HeroBackdrop />

      <HeroIntro />

      <Container className="relative">
        {/* One centred column: the headline, the promise and the one action
            stack on the same axis, with the record underneath. */}
        <div className="flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-20 lg:py-24">
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
                className="hero-staged block animate-fade-up font-bold text-brand-500 text-[3rem] sm:text-[4rem] lg:text-[5.25rem] xl:text-[6.25rem]"
              >
                Smart Automation
              </span>
              {/* The rest of the sentence, arriving a word at a time once the
                  plane has gone. */}
              <span className="mt-2 block text-[1.625rem] sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.25rem]">
                <Words text="for Every Software You Use" start={PLANE_MS - 150} step={130} />
              </span>
            </h1>

            {/* The promise assembles a word at a time under the headline. */}
            <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink-300 sm:text-[1.125rem] sm:leading-relaxed">
              <Words
                text="Automate BIM, AEC, and industry workflows across 20+ software platforms — with custom tools built around the way you work."
                start={PLANE_MS + 700}
                step={46}
              />
            </p>

            {/*
              One call to action. Software is reachable from
              the header, and contact lives up there too, so the hero does not
              repeat them — it points at the catalogue and gets out of the way.
            */}
            <div style={enter(760)} className="hero-staged mt-10 flex animate-fade-up justify-center">
              <Button
                href="/tools"
                size="lg"
                icon="arrow-right"
                className={[
                  // Scaled up to sit against the headline rather than under it.
                  "h-16 px-10 text-lg",
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
