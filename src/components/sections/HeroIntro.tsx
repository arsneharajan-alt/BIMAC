"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";
import { FADE_MS, INTRO_FAILSAFE_MS, VAPORIZE_S } from "@/lib/hero-timing";

/**
 * The opening, in two movements on black.
 *
 * First `intro.mp4` plays: the mark drafts itself, the letters land, the
 * tagline wipes in. Then the picture it leaves on the screen comes apart into
 * its own pixels and clears the panel, the way the drawing goes in
 * `hero section animation.mp4`.
 *
 * What is served at /intro.mp4 is not the file in the project root. The root
 * copy is the original; the served one has had the generator watermark painted
 * out of its bottom right corner and the four dead seconds of held logo cut
 * off the end, so the vanish follows the animation straight on.
 *
 * The two are handed over, not swapped, and the trick that makes it seamless
 * is that the vaporiser is given the video's own last frame rather than a logo
 * file. The frame is grabbed to a canvas the moment the video ends and passed
 * straight in, drawn back at exactly the size the video was displayed at — so
 * the particles start life on the very pixels that were already lit. There is
 * no cross-fade to tune and no chance of the mark jumping as one hands to the
 * other. Only the bright pixels become particles (see the luminance test in
 * the vaporiser), so the black ground the frame carries is simply dropped.
 *
 * The video stays up underneath until the canvas reports its first painted
 * frame, because building the particle field means sampling every pixel and
 * that takes long enough to see. On that signal the video goes and the hold is
 * released in the same commit, and the vanish begins.
 *
 * It is an overlay, not the page: the real hero is in the markup from the first
 * byte, so a visitor whose JavaScript never arrives sees it as it should be,
 * just without the opening. Reduced motion skips it entirely.
 *
 * The panel also holds the gate on everything behind it — the white plane and
 * the hero copy are paused while data-hero-intro is set, and released the
 * instant the panel is gone. That way the plane starts shrinking exactly as the
 * black clears, rather than on a delay counted from a different clock.
 *
 * And it plays once a visit. Someone who reads the hero, goes to look at custom
 * automation and comes back should land on the page itself, not sit through the
 * opening again — so the fact that it has run is kept for the session, and on
 * the way back the panel and the plane are skipped entirely.
 */

const INTRO_SRC = "/intro.mp4";

/** Used only if the video never produces a frame we can read. */
const FALLBACK_LOGO = "/logos/bimac-logo.png";

/**
 * The ground the opening is played on: white.
 *
 * intro.mp4 does not carry a white ground — it is about #f3f3f3 across the
 * middle and falls to #dcdcdc in the corners. On a white panel that reads as a
 * grey rectangle, which is the card this was asked to lose. So the picture is
 * lifted the last few levels to meet the panel rather than the panel being
 * dropped to meet the picture.
 *
 * LIFT takes the video's ground to white with enough headroom to carry its
 * vignette with it (#e8e8e8 x 1.12 clips to white). The mark itself barely
 * moves: the navy goes up three levels and the orange's red channel was
 * already at the ceiling. The darkest corners are still short of white, and
 * that is what the feather below is for.
 *
 * The lift is CSS on the element, so the frame the vaporiser is handed — read
 * off the video itself into a canvas — is the untouched original.
 */
const PLATE = "#ffffff";

const LIFT = "brightness(1.12)";

/**
 * The edge of the picture, dissolved.
 *
 * Flattening the ground got rid of the card, but the video's own vignette is
 * still a hair off the tone it sits on, and at this size a hair is a visible
 * rectangle. So the outer 64px of the picture fades out instead of stopping.
 * Nothing is cropped: the mark is well inside, and the band this eats is the
 * empty ground the animation never draws on.
 *
 * Two gradients intersected rather than one radial, so the fade is even along
 * every edge instead of pulling in at the corners. Where the intersection is
 * not supported the layers simply add, which leaves the picture whole — the
 * safe way to be wrong.
 */
const FEATHER = 64;

const EDGE_MASK = {
  maskImage: `linear-gradient(to right, transparent 0, #000 ${FEATHER}px, #000 calc(100% - ${FEATHER}px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 ${FEATHER}px, #000 calc(100% - ${FEATHER}px), transparent 100%)`,
  maskComposite: "intersect",
  WebkitMaskImage: `linear-gradient(to right, transparent 0, #000 ${FEATHER}px, #000 calc(100% - ${FEATHER}px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 ${FEATHER}px, #000 calc(100% - ${FEATHER}px), transparent 100%)`,
  WebkitMaskComposite: "source-in",
  filter: LIFT,
} as const;

const ASSUMED_RATIO = 9 / 16;

/**
 * How much of the panel the video is allowed to take.
 *
 * The vaporiser clamps a picture to 90% of its canvas height and 92% of its
 * width. Keeping the video inside that means the frame it is handed is drawn
 * back at exactly the size it was played at, with no rescale between the last
 * lit frame and the first particle.
 */
const FIT = 0.84;

/**
 * That the opening has played, remembered for this visit only.
 *
 * sessionStorage rather than localStorage on purpose: coming back to the site
 * another day should feel like arriving, and it is only navigating around
 * inside one visit that should not replay it. Reading it can throw outright
 * where site data is blocked, and then the opening simply plays.
 */
const PLAYED_KEY = "bimac:intro-played";

function hasPlayed() {
  try {
    return window.sessionStorage.getItem(PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberPlayed() {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Nothing to do: the opening will play again, which is the safe way to be wrong.
  }
}

function skipped() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || hasPlayed();
}

/** Layout effects do not exist on the server; this keeps the console quiet. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Stands the gate down without ever opening it, for a visitor who is not being
 * shown the opening: the copy is simply in place and the plane never runs.
 */
function closeGateForGood() {
  const gate = document.querySelector("[data-hero-intro='running']");
  gate?.setAttribute("data-hero-intro", "skip");
}

/** Releases the plane and the hero copy — see the gate on Hero's <section>. */
function openGate() {
  document.querySelector("[data-hero-intro]")?.removeAttribute("data-hero-intro");
}

/**
 * The frame currently on the video, as an image the vaporiser can sample.
 *
 * Same-origin, so the canvas is never tainted. Returns null rather than
 * throwing if the video has not decoded anything — the caller falls back to
 * the logo file.
 */
function captureFrame(video: HTMLVideoElement): string | null {
  try {
    const { videoWidth: w, videoHeight: h } = video;
    if (!w || !h) return null;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export function HeroIntro() {
  const [phase, setPhase] = useState<"playing" | "vaporizing" | "leaving" | "gone">("playing");
  /** True once the canvas is holding the frame and the video can go. */
  const [handedOver, setHandedOver] = useState(false);
  /** The video's last frame, as a data URL. Null until it ends. */
  const [frame, setFrame] = useState<string | null>(null);
  /** The box the video is played in, which the frame is redrawn at. */
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Before the browser paints, so a visitor coming back to the page never sees
  // a frame of the black panel they have already sat through.
  useBeforePaint(() => {
    if (!skipped()) return;
    closeGateForGood();
    setPhase("gone");
  }, []);

  /**
   * Fit the video inside the panel, and remember the size it landed at.
   *
   * Measured from the video's own intrinsic size once it has metadata, so the
   * file can be replaced without touching this.
   */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { width: sw, height: sh } = stage.getBoundingClientRect();
    if (!sw || !sh) return;
    const video = videoRef.current;
    const ratio =
      video && video.videoWidth && video.videoHeight
        ? video.videoHeight / video.videoWidth
        : ASSUMED_RATIO;
    const width = Math.min(sw * FIT, (sh * FIT) / ratio);
    setBox({ width: Math.round(width), height: Math.round(width * ratio) });
  }, []);

  useEffect(() => {
    if (skipped()) return undefined;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /**
   * The video has said what it has to say — take the frame and burn it.
   *
   * Guarded by a ref rather than by the phase, because three things race to
   * call it: the video ending, the video failing, and the failsafe.
   */
  const handedRef = useRef(false);
  const toDust = useCallback(() => {
    if (handedRef.current) return;
    handedRef.current = true;
    const video = videoRef.current;
    setFrame(video ? captureFrame(video) : null);
    setPhase("vaporizing");
  }, []);

  useEffect(() => {
    if (skipped()) return undefined;
    const video = videoRef.current;
    // Autoplay is allowed for a muted video, but a refusal must not strand the
    // visitor on a black panel — take the frame there is and move on.
    video?.play?.().catch(() => toDust());
    const failsafe = window.setTimeout(toDust, INTRO_FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, [toDust]);

  useEffect(() => {
    if (phase !== "leaving") return undefined;
    const id = window.setTimeout(() => {
      openGate();
      setPhase("gone");
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Remember it has run, but only once it has actually finished: reloading
  // halfway through should still give the whole thing.
  useEffect(() => {
    if (phase === "gone") rememberPlayed();
  }, [phase]);

  if (phase === "gone") return null;

  const playing = phase === "playing";
  // The video stays up until the canvas has something to show. While it is
  // still playing it stays up regardless.
  const showVideo = playing || !handedOver;
  const logo = frame ?? FALLBACK_LOGO;

  return (
    <div
      aria-hidden="true"
      className={[
        "absolute inset-0 z-20 grid place-items-center",
        "transition-opacity ease-out",
        phase === "leaving" ? "opacity-0" : "opacity-100",
      ].join(" ")}
      style={{ background: PLATE, transitionDuration: `${FADE_MS}ms` }}
    >
      {/* One stage, one centre: the video and the canvas sit on top of each
          other so the change of hands is invisible. */}
      <div ref={stageRef} className="relative h-full w-full">
        {!playing && box ? (
          <div className={["absolute inset-0", handedOver ? "visible" : "invisible"].join(" ")}>
            <VaporizeTextCycle
              texts={["BIMAC"]}
              font={{ fontFamily: "sans-serif", fontSize: "120px", fontWeight: 600 }}
              color="rgb(255, 255, 255)"
              spread={4}
              density={6}
              animation={{ vaporizeDuration: VAPORIZE_S, fadeInDuration: 0.4, waitDuration: 0 }}
              direction="left-to-right"
              alignment="center"
              tag={Tag.P}
              // A dark mark on a light plate: the sampler has to keep the
              // dark pixels and drop the ground, not the other way round.
              image={{ src: logo, height: box.height, onLight: true }}
              once
              hold={!handedOver}
              onFirstPaint={() => setHandedOver(true)}
              onVaporized={() => setPhase("leaving")}
            />
          </div>
        ) : null}

        {showVideo ? (
          <div className="absolute inset-0 grid place-items-center">
            <video
              ref={videoRef}
              src={INTRO_SRC}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={measure}
              onEnded={toDust}
              onError={toDust}
              style={box ? { ...EDGE_MASK, width: box.width, height: box.height } : EDGE_MASK}
              className={box ? undefined : "max-h-[84%] max-w-[84%]"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HeroIntro;
