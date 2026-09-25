import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import StackedHeading from "@/components/ui/StackedHeading";
import ProjectCard from "./ProjectCard";
import { featuredProjects } from "@/data/projects";

/**
 * Selected projects — three, one per discipline.
 *
 * Three rather than six: at this width three cards are large enough that the
 * drawings are worth looking at, and the row still ends in a way that makes
 * "View All Projects" the obvious next move.
 */
export function SelectedProjects() {
  return (
    <section className="border-b border-ink-200 bg-white py-14 sm:py-20">
      <Container>
        <StackedHeading eyebrow="Selected projects" title="Real Projects." accent="Measurable Results." />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 90} />
          ))}
        </div>

        <div data-reveal="" className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-ink-700 transition-colors hover:text-brand-600"
          >
            View All Projects
            <Icon
              name="arrow-right"
              className="text-[0.8rem] text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default SelectedProjects;
