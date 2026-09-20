# Software product logos

The logos shown in the hero, on the homepage software section, in the Software
mega menu, and across `/software`.

`ProductMark` (`src/components/common/ProductMark.tsx`) renders the file named
by `logo` — on a platform in `src/data/software.ts`, or on a menu entry in
`src/data/software-menu.ts`. When neither names a file, it falls back to the
coloured `mark` tile — the product's initials in its own colour — so the site
works with any subset of these files present.

## Source

Every `.png` here comes from BIMAC's own logo set, `Desktop/BIMAC/software
logos/Tools picture`. Each was processed the same way: background knocked out
by flood fill from the edges (so white *inside* a mark — the R in Revit, the X
in Excel — survives), trimmed to the artwork, and resized to 128px on the long
edge, which covers the largest slot on the site at 2x.

Re-run that conversion from the scratchpad script if the source set changes; the
mapping from each source filename to its slug is recorded there.

| File               | Product      |
| ------------------ | ------------ |
| `revit.png`        | Autodesk Revit |
| `autocad.png`      | AutoCAD      |
| `navisworks.png`   | Navisworks   |
| `civil-3d.png`     | Civil 3D     |
| `3ds-max.png`      | 3ds Max      |
| `infraworks.png`   | Infraworks   |
| `sketchup.png`     | SketchUp     |
| `archicad.png`     | Archicad     |
| `tekla.png`        | Tekla Structures |
| `staad-pro.png`    | Staad.Pro    |
| `sap2000.png`      | Sap2000      |
| `etabs.png`        | ETABS        |
| `solibri.png`      | Solibri      |
| `synchro-4d.png`   | Synchro 4D   |
| `planswift.png`    | Planswift    |
| `primavera-p6.png` | Primavera P6 |
| `power-bi.png`     | Power BI     |
| `excel.png`        | Microsoft Excel |
| `word.png`         | Microsoft Word |
| `render.png`       | Rendering    |

`ms-project.svg` is the one file not in that set — the official Wikimedia icon,
kept because no MS Project logo was supplied. Drop `ms-project.png` in and
point `src/data/software.ts` at it to bring it in line with the rest.

## Wordmarks

ETABS and SAP2000 publish a wordmark, not a square icon — ETABS is over four
times wider than it is tall. Squeezed into a square slot it becomes a smudge,
so both carry `logoWide: true` and `ProductMark` gives them a wide slot at the
same height as everything else, left-aligned so labels stay in line. Tekla,
Archicad and Planswift are marked the same way.

## Before publishing

These are third-party trademarks. Using them to say "our tools automate inside
this software" is normally fine as nominative use, but Autodesk, Microsoft,
Oracle, Trimble, Bentley and CSI each publish trademark guidelines covering
minimum size, clear space, and what you must not do — recolour them, lock them
up with the BIMAC logo, or imply the vendor endorses BIMAC. Worth a read before
the site goes live.
