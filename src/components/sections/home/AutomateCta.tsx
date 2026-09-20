import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * The close.
 *
 * A headline and two buttons on the navy — the same navy as the hero, so the
 * page opens and shuts on the same colour. No supporting line: everything that
 * could be said has been said above it.
 */
export function AutomateCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-28">
      {/* A single soft light behind the headline, so the band is not a flat
          rectangle of navy. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(46,146,240,0.18),transparent)]"
      />

      <Container>
        <div data-reveal="" className="relative flex flex-col items-center text-center">
          <h2 className="max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tightest text-white sm:text-5xl">
            Automate Your BIM Workflow
          </h2>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" size="lg" icon="arrow-right">
              Book a Demo
            </Button>
            <Button href="/tools" size="lg" variant="onDarkGhost">
              Explore Products
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AutomateCta;
