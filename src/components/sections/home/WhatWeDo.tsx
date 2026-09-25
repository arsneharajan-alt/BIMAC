import Container from "@/components/ui/Container";
import StackedHeading from "@/components/ui/StackedHeading";
import ProcessFilm from "./ProcessFilm";

/**
 * What we build — the idea behind the catalogue, straight after the software strip.
 *
 * The same heading as every other section, then the copy: two plain paragraphs at the same size,
 * centred across the width of the page. Nothing pulled out, nothing beside
 * it — the words carry the section on their own.
 */
export function WhatWeDo() {
  return (
    <section className="border-b border-ink-200 bg-white py-14 sm:py-20">
      <Container>
        <StackedHeading
          eyebrow="What we build"
          title="Turning Complex AEC Workflows"
          accent="Into Simple Actions"
          className="max-w-4xl"
        />

        <div data-reveal="" className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mt-8 space-y-5 text-pretty text-[1.0625rem] leading-relaxed text-ink-600 sm:text-[1.1875rem]">
            <p>
              AEC work shouldn’t mean repeating the same tasks hundreds of times. We have 300+ plugins
              that turn complex workflows into simple, repeatable actions across Architecture, Structure, and
              MEP.
            </p>
            <p>
              From early design through as-built documentation, our plugins simplify the processes that take up
              valuable time. Built to work with the AEC software you already use, they help teams automate more,
              work smarter, and deliver with greater consistency.
            </p>
          </div>
        </div>

        {/* The same story, played: the pile of tasks, the one plugin, the
            grid of deliverables across the disciplines and stages, and
            what it buys. */}
        <div className="mt-12 sm:mt-14">
          <ProcessFilm />
        </div>
      </Container>
    </section>
  );
}

export default WhatWeDo;
