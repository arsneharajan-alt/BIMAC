import type { Tool } from "@/types";

/**
 * Shared plumbing for the catalogue.
 *
 * One file per discipline under `data/catalogue/` — architecture, structure
 * and mep — each generated from the cards in `cards/` and each exporting a
 * `ToolSeed[]`. `data/tools.ts` concatenates them and `t()` fills in the
 * defaults a seed may leave out.
 */

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/*                                                                     */
/* Every tool now states its own status, because the catalogue is       */
/* generated: scripts/build-catalogue.mjs stamps "planned" on the ids   */
/* listed in scripts/planned.json and "available" on the rest. The two  */
/* hand-kept sets that used to live here were keyed on ids the card     */
/* pipeline replaced, so they had stopped deciding anything.            */
/*                                                                     */
/* To mark a tool planned, put its id in scripts/planned.json and       */
/* re-run the generator — not here.                                     */
/* ------------------------------------------------------------------ */

export type ToolSeed = Omit<Tool, "status" | "video"> &
  Partial<Pick<Tool, "status" | "video">>;

export function t(seed: ToolSeed): Tool {
  return {
    ...seed,
    // Generated seeds always carry one; anything hand-written is on the roadmap.
    status: seed.status ?? "planned",
    // No demos recorded yet — the tool page falls back to the interface preview.
    video: seed.video ?? { kind: "none" },
  };
}
