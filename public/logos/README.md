# Software product logos

The logos shown in the hero, on the homepage software section, in the Tools
mega menu, and across `/software`.

`ProductMark` (`src/components/common/ProductMark.tsx`) renders the file named
by `logo` on a platform in `src/data/software.ts`. When a platform has no
`logo`, it falls back to the coloured `mark` tile — the product's initials in
its own colour — so the site works with any subset of these files present.

## On file

| File             | Product           | Source                                       |
| ---------------- | ----------------- | -------------------------------------------- |
| `revit.svg`      | Autodesk Revit    | Simple Icons (CC0), tinted `#0696D7`          |
| `autocad.svg`    | AutoCAD           | Simple Icons (CC0), tinted `#D8261C`          |
| `excel.svg`      | Microsoft Excel   | Wikimedia Commons, official full-colour icon  |
| `power-bi.svg`   | Power BI          | Wikimedia Commons, official full-colour icon  |
| `ms-project.svg` | Microsoft Project | Wikimedia Commons, official full-colour icon  |

## Still needed

No square product icon could be sourced for these three, so they currently show
the coloured fallback tile. Drop a square SVG in under the filename below and
add the matching `logo` line in `src/data/software.ts`:

| File                | Product      | Where to look                                  |
| ------------------- | ------------ | ---------------------------------------------- |
| `navisworks.svg`    | Navisworks   | Autodesk Brand Center (login), or an Autodesk install's icon resources |
| `primavera-p6.svg`  | Primavera P6 | Oracle brand / trademark resources             |
| `etabs.svg`         | ETABS        | CSI America press resources                    |

Oracle's and CSI's public logos are wide wordmarks. They were downloaded and
discarded because a 5:1 wordmark is illegible in a 40px square tile — a square
product icon is what these slots need.

## Before publishing

These are third-party trademarks. Using them to say "our tools automate inside
this software" is normally fine as nominative use, but Autodesk, Microsoft and
Oracle each publish trademark guidelines covering minimum size, clear space,
and what you must not do — recolour them, lock them up with the BIMAC logo, or
imply the vendor endorses BIMAC. Worth a read before the site goes live.

Note the Revit and AutoCAD marks here are monochrome silhouettes tinted to the
product colour, which is exactly the kind of alteration those guidelines tend
to restrict. If that matters commercially, replace both with the official
full-colour badges from Autodesk Brand Center.
