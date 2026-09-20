# BIMAC Tool Cards – LITE version

Same 112 tool cards, stripped for public display: no Revit or AutoCAD window, no ribbon or tab names,
no project browser, no status or command line, and no step-by-step list. Each card shows only the tool
name, a one-line description, the animation, and the Add-in / Book a demo row.

Card size is 1280 × 616 and scales to its container, same as the full version.

```
BIMAC-Tool-Cards-Lite/
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

File names and numbering match the full version, so the two are interchangeable card for card.

## Prompt to give Claude Code

> Add the tool cards in the `BIMAC-Tool-Cards-Lite` folder to my website on [PAGE]. Create two groups,
> "Revit add-ins" (folder `Revit/`) and "AutoCAD add-ins" (folder `AutoCAD/`). Inside each group make three
> sections – Architecture, Structure and MEP – from the matching sub-folders. One card per file, in the numbered
> order; ignore the `_extra-unconfirmed` folder. Keep each card's markup, styles and script exactly as they are;
> only adapt them to my project's structure (e.g. a component per card if the site uses React/Next/Vue). Each
> card's `<script>` must stay directly after its own `<section class="bimac-card">`. Put the Google Fonts links in
> the site's head once. Point every "Book a demo" button to [YOUR CONTACT PAGE OR LINK].

## Notes
- **Fonts:** the cards use Archivo and IBM Plex Sans from Google Fonts. If those links don't reach the page's
  `<head>`, the headings fall back to a condensed system font; long names are sized to fit either way.
- **Book a demo** links to `#demo` – set your real link.
- **Demo values** in the animations (sizes, quantities, areas, file names) are illustrative.
- **Placeholders** left on purpose: `[AUTHORITY]` on Revit Architecture Parking and Ramp & Staircase,
  `[STANDARD]` on Revit MEP calculation cards, the AutoCAD Structure cover note, the Bar Bending Schedule
  and the AutoCAD MEP general note.
- **Phones:** cards scale down; below ~700 px wide the text inside the animation gets small.
