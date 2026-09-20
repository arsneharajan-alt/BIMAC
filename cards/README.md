# BIMAC Tool Cards – complete website package

Self-contained animated cards (plain HTML + CSS + vanilla JS, no libraries), one file per tool, 1280 × 616.
Double-click any file to preview it in a browser.

```
BIMAC-Tool-Cards/
  Revit/
    Architecture/   25 cards   – Add-in for Autodesk® Revit®
    Structure/      18 cards
    MEP/            25 cards
  AutoCAD/
    Architecture/   12 cards   – Add-in for Autodesk® AutoCAD®
    Structure/      16 cards
    MEP/            16 cards
  _extra-unconfirmed/  massing card, not for the site yet
```

112 cards in total. Many tool names repeat across folders (e.g. PDF & DWG Exporter), so keep each folder
as its own section on the site.

## Prompt to give Claude Code

> Add the tool cards in the `BIMAC-Tool-Cards` folder to my website on [PAGE]. Create two groups, "Revit add-ins"
> (folder `Revit/`) and "AutoCAD add-ins" (folder `AutoCAD/`). Inside each group make three sections – Architecture,
> Structure and MEP – from the matching sub-folders. One card per file, in the numbered order; ignore the
> `_extra-unconfirmed` folder. Keep each card's markup, styles and script exactly as they are; only adapt them to my
> project's structure (e.g. a component per card if the site uses React/Next/Vue). Each card's `<script>` must stay
> directly after its own `<section class="bimac-card">`. Put the Google Fonts links in the site's head once.
> Point every "Book a demo" button to [YOUR CONTACT PAGE OR LINK].

## Before going live
- **Book a demo** links to `#demo` in every card – set your real link in the prompt above.
- **Revit placeholders:** `[AUTHORITY]` in Architecture Parking and Ramp & Staircase; `[STANDARD]` on MEP calculation cards.
- **AutoCAD placeholders:** `BX_` command names on the command line; `[STANDARD]` in the Structure cover note, the
  Bar Bending Schedule and the MEP general note. MEP Coordination assumes levels come from BOD / CL / TOT tags.
- **Demo values** throughout (sizes, quantities, loads, layer names, file names) are illustrative – check against real
  tool output before publishing, especially the MEP calculation cards.
- **Phones:** cards scale down; below ~700 px wide the text gets small.
