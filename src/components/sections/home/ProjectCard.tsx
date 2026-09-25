import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { GLOSS, LIFT } from "@/components/ui/Gloss";
import ProjectArt from "./ProjectArt";
import type { Project } from "@/data/projects";

/**
 * One project.
 *
 * The image is the card; everything else sits on it. The name and the client
 * live inside it over a dark wash, because a white caption bar under the
 * picture halves how much of the picture you get to see.
 *
 * The wash is a real gradient rather than a flat tint — a flat one greys the
 * whole lower half of the image, and the point of the image is that somebody
 * looks at it.
 */
export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <article
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`group relative isolate overflow-hidden rounded-2xl border border-ink-200 bg-navy ${GLOSS} ${LIFT} hover:border-ink-300`}
    >
      <div className="relative aspect-[8/5]">
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name}, ${project.client}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <ProjectArt art={project.art} />
          )}
        </div>

        {/* A short wash at the top, so the chip reads on a pale render too. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(to_bottom,rgba(4,14,24,0.55)_0%,rgba(4,14,24,0.18)_55%,rgba(4,14,24,0)_100%)]"
        />

        {/* The wash the type sits on. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(4,14,24,0.94)_0%,rgba(4,14,24,0.58)_42%,rgba(4,14,24,0)_100%)]"
        />

        {/* What BIMAC did, top left. */}
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-ink-950/45 px-3 py-1 text-2xs font-medium tracking-wide text-white backdrop-blur-sm">
          {project.scope}
        </span>

        {/* The name and who it was for; the way in, bottom right. */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div className="min-w-0">
            <h3 className="font-display text-card-title font-semibold text-white lg:text-card-title-lg">
              {project.name}
            </h3>
            <p className="mt-1 font-mono text-2xs uppercase tracking-[0.12em] text-ink-300">
              {project.client}
            </p>
          </div>

          <Link
            href="/projects"
            aria-label={`View ${project.name}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 hover:border-brand-400 hover:bg-brand-500"
          >
            <Icon name="arrow-right" className="text-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
