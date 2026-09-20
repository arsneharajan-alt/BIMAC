import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
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
    <section className="border-b border-ink-200 bg-white py-20 sm:py-28">
      <Container>
        <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.13em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              Selected projects
            </p>
            <h2 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tightest text-ink-950 sm:text-[2.6rem]">
              Real Projects. <span className="text-brand-500">Measurable Results.</span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 pb-1 text-[0.8125rem] font-medium text-ink-700 transition-colors hover:text-brand-600"
          >
            View All Projects
            <Icon
              name="arrow-right"
              className="text-[0.8rem] text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 90} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default SelectedProjects;
