import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Catalogue from "@/components/marketplace/Catalogue";
import { ContactBand } from "@/components/common/ContactActions";
import { disciplines } from "@/data/disciplines";
import { tools } from "@/data/tools";
import { statusOrder } from "@/lib/tools";
import type { DisciplineId, ToolStatus } from "@/types";

export const metadata: Metadata = {
  title: "All BIM Automation Tools",
  description:
    "Browse every BIMAC tool for architecture, structure and MEPF — filter by discipline, software and availability.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ToolsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const disciplineParam = one(params.discipline) as DisciplineId | undefined;
  const statusParam = one(params.status) as ToolStatus | undefined;
  const queryParam = one(params.q) ?? "";

  const initialFilters = {
    query: queryParam,
    disciplines:
      disciplineParam && disciplines.some((d) => d.id === disciplineParam)
        ? [disciplineParam]
        : [],
    statuses: statusParam && statusOrder.includes(statusParam) ? [statusParam] : [],
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              Catalogue
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-ink-950 sm:text-5xl">
              BIM Automation Tools
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {tools.length} tools across architecture, structure, the seven MEPF services, and
              shared BIM automation — from site study to as-built handover. Filter by
              discipline or the software you already run.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <Container>
          <Catalogue tools={tools} initialFilters={initialFilters} columns={3} />
        </Container>
      </section>

      <ContactBand
        title="Can't find the tool you need?"
        lede="If the workflow is specific to your organisation, we build it. Send a description of the task and roughly how many hours it costs you."
      />
    </>
  );
}
