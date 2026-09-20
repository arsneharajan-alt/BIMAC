/**
 * The opening, on one clock.
 *
 * Three components have to agree about it — the intro panel, the white
 * plane behind it and the hero copy — and they used to each keep their own
 * numbers. They drifted, the plane ran its whole course while the panel was
 * still black, and the shrinking circle was never seen.
 *
 *   0ms ...... intro.mp4 plays on the light plate (HeroIntro)
 *   on end ... its last frame is handed to the vaporiser and blows away
 *   then ..... the panel fades over FADE_MS and releases the gate
 *   + 0ms .... the white plane starts to shrink, the headline arrives
 *   + PLANE_MS the plane is away and the blue is open
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
export const INTRO_FAILSAFE_MS = 10000;

/**
 * How long the dust takes to clear, in seconds — the vaporiser's own unit.
 *
 * Paced off `hero section animation.mp4`, and then slowed: the mark is the
 * thing a visitor came to look at, and blowing it away in a second reads as
 * losing it rather than as letting it go.
 */
export const VAPORIZE_S = 1.8;

/**
 * The panel's fade to the white plane, once there is nothing left on it.
 *
 * Short on purpose. Everything between the mark going and the headline
 * arriving is dead time, and a visitor reads dead time as the site thinking.
 */
export const FADE_MS = 300;

/**
 * The plane's own run — must match `hero-plane` in globals.css.
 *
 * The headline sits over the plane rather than under it, so the orange is
 * legible from the first frame. What this actually controls is how long the
 * rest of the hero stays hidden behind white, and nearly four seconds of that
 * was too long to wait after the opening had finished.
 */
export const PLANE_MS = 2000;
