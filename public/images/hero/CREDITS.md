# Hero imagery — provenance

Every image shipped from this folder has to be one we are allowed to ship. A
landing page is public, commercial and indexed, so "found it online" is not a
licence.

## bim-overlay.jpg — in use

Supplied by Sneha (1672x941 PNG, re-encoded to JPEG q86 at 290KB). Provenance
is whatever she has for it — worth confirming it is licensed for commercial use
before launch, since it looks like a generated stock render and nothing here
records where it came from.

It is used at 34% opacity on flat ink-950. That is not just dimming: at full
strength the render's brightness and busyness fight the headline, and the
orange in the copy has nothing to win against. Held back, it reads as texture.

## bim-city.jpg — available, not currently used

Not sourced. **Generated** by `scripts/generate-hero-city.mjs`, so there is no
licence question to answer: the artwork is ours.

It was drawn to a reference — an aerial of a city block with one building
wrapped in a white wireframe, washed deep blue. The reference is a render, and
the part of it that carries the meaning is geometry, which is cheaper to draw
than to find. Drawing it also means the image arrives at exactly the size the
hero wants, in the palette from `tailwind.config.ts`, and can be regenerated
when either changes.

It was the hero background until the render above replaced it. Kept rather
than deleted: the choice of hero background has changed more than once, and
switching back is a one-line edit in `HeroBackdrop` while regenerating from
scratch is not.

Regenerate with:

    node scripts/generate-hero-city.mjs

The generator is seeded, so the city comes out identical every run. Change the
seed in `rand` to get a different city; change `SCALE`, `HERO_AT` or `CX` to
re-frame it. The note above `HERO_AT` explains why those three are solved
together rather than nudged — getting that wrong puts the tower off the top of
the frame.

## Images that are no longer here

- `studio-workstation.jpg` — ArchiLabs' own asset, pulled from their CDN as a
  first pass. Removed: it is their copyright and they are in this market.
- `architect-desk.jpg` — rawpixel, "Free architecture working desk image", via
  Openverse, CC0 1.0. Legitimate to ship, and superseded by the generated
  artwork. Recoverable from Openverse if it is ever wanted back.

## If you replace the generated artwork

A photograph of BIMAC's own work would be a fair swap. Drop it in and point
`HeroBackdrop` at it. Two things to check: the hero copy is a centred column,
so the subject needs to sit off-centre or it fights the headline; and the wash
in `HeroBackdrop` is tuned against a dark image, so a light one will need it
re-weighted before white type is safe on it.

Do not source a replacement from Pinterest, a Google image search or a
competitor's site. Almost nothing there carries a licence we can rely on. Use
Unsplash, Pexels, or an Openverse search filtered to CC0 — and record it here.
