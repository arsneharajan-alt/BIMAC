import Hero from "@/components/sections/Hero";
import Container from "@/components/ui/Container";
import ProjectImpact from "@/components/sections/ProjectImpact";
import {
  CustomDevelopmentBand,
  DisciplineChooser,
  FeaturedTools,
  MepBreakdown,
  SoftwareChooser,
  StageJourney,
} from "@/components/sections/HomeSections";
import { ContactBand } from "@/components/common/ContactActions";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Delivery record, straight under the hero — the first trust signal. */}
      <section className="border-b border-ink-200 bg-white py-12 sm:py-14">
        <Container>
          <ProjectImpact />
        </Container>
      </section>

      {/* Discipline first — the visitor identifies themselves before anything else. */}
      <DisciplineChooser />
      {/* Then the software axis — the other way people arrive. */}
      <SoftwareChooser />
      <FeaturedTools />
      <StageJourney />
      <MepBreakdown />
      <CustomDevelopmentBand />
      <ContactBand
        title="Tell us where your hours are going"
        lede="Message on WhatsApp or send an email describing the task that eats your week. If something in the catalogue already solves it, we will say so."
      />
    </>
  );
}
