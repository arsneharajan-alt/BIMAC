/**
 * The projects, with the client and what BIMAC did on each.
 *
 * `image` is a render or photograph in public/projects. Where there is none
 * yet, `art` names the drawn scene that stands in — a drawing is honest about
 * being a drawing, where a stock photo of somebody else's building is not.
 *
 * `featured` marks the three the homepage shows; the rest live on /projects.
 */
export interface Project {
  id: string;
  name: string;
  /** Who it was delivered for. */
  client: string;
  /** What BIMAC did — the chip over the image. */
  scope: string;
  /** Render or photograph, in public/projects. */
  image?: string;
  /** The drawn scene used when there is no image. */
  art: "residential" | "frame" | "services" | "towers" | "resort" | "civic";
  /** One of the three on the homepage. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "aqua-maya",
    name: "Aqua Maya",
    client: "BNW Developments",
    scope: "Schematic & Detail Design",
    image: "/projects/aqua-maya.png",
    art: "residential",
  },
  {
    id: "pelagia",
    name: "Pelagia",
    client: "BNW Developments",
    scope: "Detail Design",
    image: "/projects/pelagia.png",
    art: "residential",
    featured: true,
  },
  {
    id: "orvessa",
    name: "Orvessa",
    client: "BNW Developments",
    scope: "Detail Design",
    image: "/projects/orvessa.png",
    art: "towers",
  },
  {
    id: "reef-998",
    name: "REEF 998",
    client: "REEF Luxury Development",
    scope: "Schematic Design",
    image: "/projects/reef-998.webp",
    art: "towers",
    featured: true,
  },
  {
    id: "oman-cultural-complex",
    name: "Oman Cultural Complex",
    client: "Al Ansari Groups",
    scope: "Shop Drawings",
    image: "/projects/oman-cultural-complex.jpeg",
    art: "civic",
  },
  {
    id: "alba-residences",
    name: "Alba Residences",
    client: "Omniyat",
    scope: "Shop Drawings",
    image: "/projects/alba-residences.jpg",
    art: "residential",
    featured: true,
  },
];

/** The three the homepage shows. */
export const featuredProjects = projects.filter((project) => project.featured);
