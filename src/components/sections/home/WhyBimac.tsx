import Container from "@/components/ui/Container";
import StackedHeading from "@/components/ui/StackedHeading";
import ProjectImpact from "@/components/sections/ProjectImpact";

/**
 * Why BIMAC — the case, made with the record: projects delivered, time saved,
 * turnaround and software automated. The same four cards the About page uses,
 * without the catalogue bar underneath.
 */
export function WhyBimac() {
  return (
    <section className="border-b border-ink-200 bg-ink-50/60 py-14 sm:py-20">
      <Container>
        <StackedHeading eyebrow="Why BIMAC" />
        <ProjectImpact className="mt-10" showCatalogue={false} />
      </Container>
    </section>
  );
}

export default WhyBimac;
