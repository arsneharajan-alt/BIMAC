import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { disciplineFamilies } from "@/data/disciplines";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/12 blur-[130px]"
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl py-24 text-center sm:py-32">
          <p className="font-mono text-2xs uppercase tracking-[0.18em] text-brand-400">
            Error 404
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-5xl">
            This page isn&apos;t in the model
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-300">
            The link may be out of date, or the tool may have moved to a different discipline.
            The catalogue is the fastest way back.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/tools" size="lg" icon="arrow-right">
              Browse all tools
            </Button>
            <Button href="/" size="lg" variant="onDarkGhost">
              Back to home
            </Button>
          </div>

          <div className="mt-12">
            <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-500">
              Jump to a discipline
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {disciplineFamilies.map((family) => (
                <Link
                  key={family.id}
                  href={`/tools/${family.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-3 py-2 text-[0.8125rem] text-ink-300 transition-colors hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white"
                >
                  <Icon name={family.glyph} className="text-sm text-brand-400" />
                  {family.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
