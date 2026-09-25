import Container from "@/components/ui/Container";
import StackedHeading from "@/components/ui/StackedHeading";
import ExampleDemos from "./ExampleDemos";

/**
 * Example automations — the plugins, shown working.
 *
 * Three stories of rising scope: one task (exporting a sheet set), one
 * translation between platforms (AutoCAD to Revit), then a whole chain of
 * steps run end to end. The demos are client components; this band is not.
 */
export function ExampleAutomations() {
  return (
    <section className="border-b border-ink-200 bg-white py-14 sm:py-20">
      <Container>
        <StackedHeading
          eyebrow="Examples"
          title="From Repetitive Tasks"
          accent="to Automated Workflows."
          className="max-w-4xl"
          lede="Three real workflows, from a single task to a whole chain of them. Click any step to jump to it."
        />
        <ExampleDemos />
      </Container>
    </section>
  );
}

export default ExampleAutomations;
