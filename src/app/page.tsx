import Hero from "@/components/sections/Hero";
import SoftwareMarquee from "@/components/sections/SoftwareMarquee";
import WhatWeDo from "@/components/sections/home/WhatWeDo";
import ExampleAutomations from "@/components/sections/home/ExampleAutomations";
import WhatWeAutomated from "@/components/sections/home/WhatWeAutomated";
import CustomAutomation from "@/components/sections/home/CustomAutomation";
import SelectedProjects from "@/components/sections/home/SelectedProjects";
import WhyBimac from "@/components/sections/home/WhyBimac";

/**
 * The home page, in the order the story is told:
 *
 *   the headline on the navy, and nothing else on it;
 *   the software the plugins run inside, in the same first screen;
 *   what we do — the idea behind the 300+ plugins;
 *   three example automations, shown working;
 *   the three disciplines;
 *   custom automation, for the workflow no catalogue covers;
 *   the projects;
 *   why BIMAC.
 *
 * Custom automation is the close — it is the ask — so there is no separate
 * call-to-action band after it.
 */
export default function HomePage() {
  return (
    <>
      {/* The first screen, exactly: the hero and the software strip fill the
          viewport under the 4.5rem header between them, the hero taking
          whatever height the strip leaves. Nothing below is seen until the
          visitor scrolls. */}
      <div className="flex min-h-[calc(100svh-4.5rem)] flex-col">
        <Hero className="flex-1" />
        <SoftwareMarquee />
      </div>
      <WhatWeDo />
      <ExampleAutomations />
      <WhatWeAutomated />
      <CustomAutomation />
      <SelectedProjects />
      <WhyBimac />
    </>
  );
}
