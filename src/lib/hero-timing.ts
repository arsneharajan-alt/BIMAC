/**
 * The opening, on one clock.
 *
 * Three components have to agree about it — the intro panel, the white
 * plane behind it and the hero copy — and they used to each keep their own
 * numbers. They drifted, the plane ran its whole course while the panel was
 * still black, and the shrinking circle was never seen.
 *
 *   0ms ...... intro.mp4 plays on the light plate at INTRO_RATE (HeroIntro)
 *   ~1700ms .. its last frame is handed to the vaporiser, which builds its
 *               particle field and blows the mark away
 *   ~3400ms .. the panel fades over FADE_MS and releases the gate
 *   ~3600ms .. the white plane starts to shrink, the headline arrives
 *   ~4200ms .. the plane is away and the blue is open
 *
 * Four seconds end to end, and the site is being read from about three.
 *
 * Only the failsafe is a timer. The handover is driven by the video's own
 * `ended` event, and everything after the panel is gated on the panel itself —
 * see `hero-staged` in globals.css — so nothing can drift out of step.
 */

/**
 * A backstop for the video.
 *
 * `ended` is what actually moves the opening on. If autoplay is refused, the
 * file never decodes, or the tab was backgrounded through the whole thing,
 * this fires instead and the opening carries on without it. It is comfortably
 * longer than intro.mp4, so in the normal case it is never reached.
 */
export const INTRO_FAILSAFE_MS = 4000;

/**
 * How fast intro.mp4 is played.
 *
 * The file runs 6.63s, which on its own is longer than the whole opening is
 * now allowed to take. At 3x it is about 2.2s — enough to read the mark
 * drafting itself, where 5x had it over before the eye had settled on it.
 *
 * The rate rather than a re-cut file, so the animation is the one that was
 * drawn — every frame still plays, just sooner.
 */
export const INTRO_RATE = 3;

/**
 * How long the dust takes to clear, in seconds — the vaporiser's own unit.
 *
 * It was paced at 1.8s, on the argument that the mark is what a visitor came
 * to look at. That is true of the first visit and wrong of every one after it:
 * the whole opening now has four seconds to play in, and the dust cannot have
 * half of them.
 */
export const VAPORIZE_S = 0.7;

/**
 * The dust's own fade-in, before it starts to blow away.
 *
 * The vaporiser fades its particle field up before running the vaporise, so
 * this is added to VAPORIZE_S rather than hidden inside it. At 0.4 it was
 * most of half a second spent showing a still image of what was already on
 * the screen.
 */
export const DUST_FADE_S = 0.1;

/**
 * The panel's fade to the white plane, once there is nothing left on it.
 *
 * Short on purpose. Everything between the mark going and the headline
 * arriving is dead time, and a visitor reads dead time as the site thinking.
 */
export const FADE_MS = 150;

/**
 * The plane's own run — must match `hero-plane` in globals.css.
 *
 * The headline sits over the plane rather than under it, so the orange is
 * legible from the first frame. What this actually controls is how long the
 * rest of the hero stays hidden behind white — which is dead time, so it is
 * the first thing to cut.
 */
export const PLANE_MS = 600;

/**
 * A backstop for the dust, and the last one on the way in.
 *
 * The video had a failsafe from the start; the stage after it did not, and
 * that asymmetry is what let the opening strand. The hand-off to the
 * vaporiser is a chain of conditions — the frame has to be readable, the
 * picture has to load, the sampler has to find pixels it believes are the
 * subject, and the field has to report its first paint before the video is
 * taken away. Any one of them failing left the panel up for good, with the
 * site behind it gated and unreachable. No amount of reloading helps either,
 * because the visit is only marked as played once the opening *finishes*.
 *
 * So the last stage gets what the first one had. The dust is DUST_FADE_S plus
 * VAPORIZE_S — 800ms — and this is three times that, which is slack enough
 * that a slow machine building a large particle field is never cut off, and
 * short enough that a visitor who hits the fault waits well under a second
 * longer than one who does not.
 *
 * Like INTRO_FAILSAFE_MS, in the normal case it is never reached.
 */
export const VAPORIZE_FAILSAFE_MS = 2500;

/**
 * The hard ceiling on how long the hero may stay gated. The last resort.
 *
 * Everything above is a backstop for one stage. This is the backstop for the
 * whole machine: from the moment the panel mounts it has at most this long on
 * screen, whatever state anything is in.
 *
 * It matters because the panel is an opaque white overlay sitting on z-20 over
 * the hero. The hero itself is no longer gated — it ships visible, see the
 * comment on Hero's <section> — so a stalled opening can only ever delay the
 * page now, not hide it. This is what bounds that delay.
 *
 * At 7s it is past the worst the normal chain can take — the video's 4s
 * failsafe, then the dust's 2.5s, then the fade — so it never fires on a
 * working opening. It is there so the failure mode is "the intro outstayed
 * its welcome" rather than "the site never appeared".
 */
export const GATE_MAX_MS = 7000;
