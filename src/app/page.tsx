import Hero from "@/components/sections/Hero";
import Container from "@/components/ui/Container";
import SoftwareMarquee from "@/components/sections/SoftwareMarquee";
import ProjectImpact from "@/components/sections/ProjectImpact";
import WhatWeAutomated from "@/components/sections/home/WhatWeAutomated";
import HowItWorks from "@/components/sections/home/HowItWorks";
import SelectedProjects from "@/components/sections/home/SelectedProjects";
import WhyBimac from "@/components/sections/home/WhyBimac";
import AutomateCta from "@/components/sections/home/AutomateCta";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The stack, on white — out of the blue so the headline owns it. */}
      <SoftwareMarquee />

      {/* Delivery record, straight under the hero — the first trust signal. */}
      <section className="border-b border-ink-200 bg-white py-12 sm:py-14">
        <Container>
          <ProjectImpact />
        </Container>
      </section>

      {/* From here down the page answers four questions in order, and asks for
          the meeting: what is automated, how it runs, where it has run, and
          why it is worth it. Nothing below repeats product content — the three
          discipline cards are doors to the catalogue, not copies of it. */}
      <WhatWeAutomated />
      <HowItWorks />
      <SelectedProjects />
      <WhyBimac />
      <AutomateCta />
    </>
  );
}
