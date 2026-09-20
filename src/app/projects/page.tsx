import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/sections/home/ProjectCard";
import { ContactBand } from "@/components/common/ContactActions";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects delivered with BIMAC automation — residential, mixed-use, hospitality and cultural work across architecture, structure and MEP.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-white py-12 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ label: "Projects" }]} />
          <SectionHeading
            className="mt-6"
            as="h1"
            eyebrow="Projects"
            title="Work delivered with BIMAC automation"
            lede="Live projects, run with the same tools the catalogue sells — not demos built to show them off."
          />
        </Container>
      </section>

      <section className="bg-ink-50/60 py-14 sm:py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} delay={index * 70} />
            ))}
          </div>
        </Container>
      </section>

      <ContactBand
        title="Working on something similar?"
        lede="Tell us what the job is and which parts of it eat the week. If something in the catalogue already handles it, we will say so."
      />
    </>
  );
}
