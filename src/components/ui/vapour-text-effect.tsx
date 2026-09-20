"use client";

import React, {
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Text that vaporises.
 *
 * The word is drawn to an offscreen canvas, sampled pixel by pixel into
 * particles, and then blown apart left to right — so the letters dissolve into
 * dust rather than simply fading. Adapted from the 21st.dev component: the
 * demo wrapper is dropped, the loose `any`s are typed, and an `onVaporized`
 * callback is added so a caller can hand over to whatever comes next.
 */

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

type VaporizeTextCycleProps = {
  texts: string[];
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  spread?: number;
  density?: number;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
  /**
   * Vaporise a picture rather than a word. The image is drawn to the canvas
   * and sampled the same way, so a logo comes apart exactly as letters do.
   *
   * `onLight` says which way round the picture is. The sampler keeps the
   * subject and drops the ground, and it cannot tell them apart by itself: a
   * white mark on black keeps the bright pixels, a dark mark on a light plate
   * keeps the dark ones. Get it wrong and the ground comes apart instead of
   * the logo.
   */
  image?: { src: string; height: number; onLight?: boolean };
  /** Run the cycle once and stop, rather than looping for ever. */
  once?: boolean;
  /**
   * Hold the subject still instead of blowing it away. The canvas is built and
   * painted as usual, so the work of loading and sampling can be done well
   * ahead of time; the moment this goes false the vaporise starts with nothing
   * to wait for.
   */
  hold?: boolean;
  /** Fires the moment the last particle of a pass has gone. */
  onVaporized?: () => void;
  /**
   * Fires once the canvas is actually holding a picture of its subject —
   * particles built and painted. Whatever was standing in for the subject
   * until then can be taken away on this signal with no blank frame between.
   */
  onFirstPaint?: () => void;
};

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  shouldFadeQuickly?: boolean;
};

type TextBoundaries = {
  left: number;
  right: number;
  width: number;
};

declare global {
  interface HTMLCanvasElement {
    textBoundaries?: TextBoundaries;
  }
}

/** Canvas 2D context plus the text-quality hints not in the DOM typings. */
type TextContext = CanvasRenderingContext2D & {
  fontKerning?: string;
  textRendering?: string;
};

export default function VaporizeTextCycle({
  texts = ["Next.js", "React"],
  font = {
    fontFamily: "sans-serif",
    fontSize: "50px",
    fontWeight: 400,
  },
  color = "rgb(255, 255, 255)",
  spread = 5,
  density = 5,
  animation = {
    vaporizeDuration: 2,
    fadeInDuration: 1,
    waitDuration: 0.5,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
  image,
  once = false,
  hold = false,
  onVaporized,
  onFirstPaint,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isInView = useIsInView(wrapperRef as React.RefObject<HTMLElement>);
  const lastFontRef = useRef<string | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const completedRef = useRef(false);
  const paintedRef = useRef(false);
  const onFirstPaintRef = useRef(onFirstPaint);
  onFirstPaintRef.current = onFirstPaint;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState<
    "static" | "vaporizing" | "fadingIn" | "waiting" | "done"
  >("static");
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!image?.src) {
      setLoadedImage(null);
      return undefined;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setLoadedImage(img);
    // A missing file is not fatal: the text is still there to vaporise.
    img.onerror = () => setLoadedImage(null);
    img.src = image.src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image?.src]);

  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.devicePixelRatio * 1.5 || 1;
    }
    return 1;
  }, []);

  const wrapperStyle = useMemo(
    () => ({ width: "100%", height: "100%", pointerEvents: "none" as const }),
    [],
  );

  const canvasStyle = useMemo(
    () => ({ minWidth: "30px", minHeight: "20px", pointerEvents: "none" as const }),
    [],
  );

  const animationDurations = useMemo(
    () => ({
      VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
      FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
      WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
    }),
    [animation.vaporizeDuration, animation.fadeInDuration, animation.waitDuration],
  );

  const fontConfig = useMemo(() => {
    const fontSize = parseInt(font.fontSize?.replace("px", "") || "50", 10);
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize);
    return {
      fontSize,
      VAPORIZE_SPREAD,
      MULTIPLIED_VAPORIZE_SPREAD: VAPORIZE_SPREAD * spread,
    };
  }, [font.fontSize, spread]);

  const memoizedUpdateParticles = useCallback(
    (particles: Particle[], vaporizeX: number, deltaTime: number) =>
      updateParticles(
        particles,
        vaporizeX,
        deltaTime,
        fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
        animationDurations.VAPORIZE_DURATION,
        direction,
        transformedDensity,
      ),
    [
      fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
      animationDurations.VAPORIZE_DURATION,
      direction,
      transformedDensity,
    ],
  );

  const memoizedRenderParticles = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      renderParticles(ctx, particles, globalDpr);
    },
    [globalDpr],
  );

  // Start the cycle once the block is on screen and nothing is holding it.
  useEffect(() => {
    if (completedRef.current) return;
    if (isInView && !hold) {
      const id = setTimeout(() => setAnimationState("vaporizing"), 0);
      return () => clearTimeout(id);
    }
    setAnimationState("static");
    return undefined;
  }, [isInView, hold]);

  useEffect(() => {
    if (!isInView || animationState === "done") return undefined;

    let lastTime = performance.now();
    let frameId = 0;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx || !particlesRef.current.length) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (animationState) {
        case "static": {
          memoizedRenderParticles(ctx, particlesRef.current);
          break;
        }
        case "vaporizing": {
          vaporizeProgressRef.current +=
            (deltaTime * 100) / (animationDurations.VAPORIZE_DURATION / 1000);

          const textBoundaries = canvas.textBoundaries;
          if (!textBoundaries) break;

          const progress = Math.min(100, vaporizeProgressRef.current);
          const vaporizeX =
            direction === "left-to-right"
              ? textBoundaries.left + (textBoundaries.width * progress) / 100
              : textBoundaries.right - (textBoundaries.width * progress) / 100;

          const allVaporized = memoizedUpdateParticles(
            particlesRef.current,
            vaporizeX,
            deltaTime,
          );
          memoizedRenderParticles(ctx, particlesRef.current);

          if (vaporizeProgressRef.current >= 100 && allVaporized) {
            onVaporized?.();
            if (once) {
              completedRef.current = true;
              setAnimationState("done");
              break;
            }
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            setAnimationState("fadingIn");
            fadeOpacityRef.current = 0;
          }
          break;
        }
        case "fadingIn": {
          fadeOpacityRef.current += (deltaTime * 1000) / animationDurations.FADE_IN_DURATION;

          ctx.save();
          ctx.scale(globalDpr, globalDpr);
          particlesRef.current.forEach((particle) => {
            particle.x = particle.originalX;
            particle.y = particle.originalY;
            const opacity = Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha;
            ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
          });
          ctx.restore();

          if (fadeOpacityRef.current >= 1) {
            setAnimationState("waiting");
            setTimeout(() => {
              setAnimationState("vaporizing");
              vaporizeProgressRef.current = 0;
              resetParticles(particlesRef.current);
            }, animationDurations.WAIT_DURATION);
          }
          break;
        }
        case "waiting": {
          memoizedRenderParticles(ctx, particlesRef.current);
          break;
        }
        default:
          break;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [
    animationState,
    isInView,
    texts.length,
    direction,
    globalDpr,
    once,
    onVaporized,
    memoizedUpdateParticles,
    memoizedRenderParticles,
    animationDurations.FADE_IN_DURATION,
    animationDurations.WAIT_DURATION,
    animationDurations.VAPORIZE_DURATION,
  ]);

  useEffect(() => {
    renderCanvas({
      framerProps: { texts, font, color, alignment },
      canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
      image: loadedImage
        ? { element: loadedImage, height: image?.height ?? 200, onLight: image?.onLight ?? false }
        : undefined,
    });

    // The particles exist, but nothing has been drawn with them yet: the loop
    // paints on the next frame. Wait for that frame before reporting in, or a
    // caller that drops its stand-in on this signal gets an empty frame where
    // the subject should be.
    let raf = 0;
    if (!paintedRef.current && particlesRef.current.length) {
      paintedRef.current = true;
      raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => onFirstPaintRef.current?.()),
      );
    }

    const currentFont = font.fontFamily || "sans-serif";
    const stopWatchingFont = handleFontChange({
      currentFont,
      lastFontRef,
      canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
      framerProps: { texts, font, color, alignment },
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      stopWatchingFont?.();
    };
  }, [
    texts,
    font,
    color,
    alignment,
    wrapperSize,
    currentTextIndex,
    globalDpr,
    loadedImage,
    image?.height,
    image?.onLight,
  ]);

  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return undefined;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWrapperSize({ width, height });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setWrapperSize({ width: rect.width, height: rect.height });
    }
  }, []);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <SeoElement tag={tag} texts={texts} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The text itself, for anything that cannot read a canvas             */
/* ------------------------------------------------------------------ */

const SeoElement = memo(function SeoElement({ tag = Tag.P, texts }: { tag: Tag; texts: string[] }) {
  const style = useMemo(
    () => ({
      position: "absolute" as const,
      width: "0",
      height: "0",
      overflow: "hidden",
      userSelect: "none" as const,
      pointerEvents: "none" as const,
    }),
    [],
  );

  const safeTag = Object.values(Tag).includes(tag) ? tag : Tag.P;
  return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});

/* ------------------------------------------------------------------ */
/* Fonts load late; the sampling has to be redone when they land       */
/* ------------------------------------------------------------------ */

const handleFontChange = ({
  currentFont,
  lastFontRef,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
  framerProps,
}: {
  currentFont: string;
  lastFontRef: React.MutableRefObject<string | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wrapperSize: { width: number; height: number };
  particlesRef: React.MutableRefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
  framerProps: VaporizeTextCycleProps;
}) => {
  if (currentFont !== lastFontRef.current) {
    lastFontRef.current = currentFont;

    const timeoutId = setTimeout(() => {
      cleanup({ canvasRef, particlesRef });
      renderCanvas({
        framerProps,
        canvasRef,
        wrapperSize,
        particlesRef,
        globalDpr,
        currentTextIndex,
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      cleanup({ canvasRef, particlesRef });
    };
  }

  return undefined;
};

const cleanup = ({
  canvasRef,
  particlesRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  particlesRef: React.MutableRefObject<Particle[]>;
}) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particlesRef.current) particlesRef.current = [];
};

/* ------------------------------------------------------------------ */
/* Draw the word, then take it apart into particles                    */
/* ------------------------------------------------------------------ */

const renderCanvas = ({
  framerProps,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
  image,
}: {
  framerProps: VaporizeTextCycleProps;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wrapperSize: { width: number; height: number };
  particlesRef: React.MutableRefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
  image?: { element: HTMLImageElement; height: number; onLight?: boolean };
}) => {
  const canvas = canvasRef.current;
  if (!canvas || !wrapperSize.width || !wrapperSize.height) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = wrapperSize;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * globalDpr);
  canvas.height = Math.floor(height * globalDpr);

  const fontSize = parseInt(framerProps.font?.fontSize?.replace("px", "") || "50", 10);
  const font = `${framerProps.font?.fontWeight ?? 400} ${fontSize * globalDpr}px ${
    framerProps.font?.fontFamily ?? "sans-serif"
  }`;
  const color = parseColor(framerProps.color ?? "rgb(153, 153, 153)");

  const textY = canvas.height / 2;
  const currentText = framerProps.texts[currentTextIndex] || "";

  let textX: number;
  if (framerProps.alignment === "center") {
    textX = canvas.width / 2;
  } else if (framerProps.alignment === "left") {
    textX = 0;
  } else {
    textX = canvas.width;
  }

  const { particles, textBoundaries } = createParticles(
    ctx,
    canvas,
    currentText,
    textX,
    textY,
    font,
    color,
    framerProps.alignment || "left",
    image
      ? { element: image.element, height: image.height * globalDpr, onLight: image.onLight }
      : undefined,
  );

  particlesRef.current = particles;
  canvas.textBoundaries = textBoundaries;
};

const createParticles = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  textX: number,
  textY: number,
  font: string,
  color: string,
  alignment: "left" | "center" | "right",
  image?: { element: HTMLImageElement; height: number; onLight?: boolean },
) => {
  const particles: Particle[] = [];
  const textCtx = ctx as TextContext;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = "middle";
  ctx.imageSmoothingQuality = "high";
  ctx.imageSmoothingEnabled = true;
  if ("fontKerning" in textCtx) textCtx.fontKerning = "normal";
  if ("textRendering" in textCtx) textCtx.textRendering = "geometricPrecision";

  // A picture takes the place of the word: centre it, scale it to the height
  // asked for, and let the sampler below treat its pixels exactly as it treats
  // the pixels of a letter.
  if (image) {
    const ratio = image.element.width / image.element.height || 1;
    const drawH = Math.min(image.height, canvas.height * 0.9);
    const drawW = Math.min(drawH * ratio, canvas.width * 0.92);
    const finalH = drawW / ratio;
    const left = (canvas.width - drawW) / 2;
    const top = (canvas.height - finalH) / 2;

    ctx.drawImage(image.element, left, top, drawW, finalH);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const currentDPR = canvas.width / parseInt(canvas.style.width, 10);
    const sampleRate = Math.max(1, Math.round(currentDPR / 3));

    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        // Drop the ground the logo is carrying with it — the near-black of a
        // dark plate, or the near-white of a light one.
        const luminance = (data[index] + data[index + 1] + data[index + 2]) / 3;
        const isSubject = image.onLight ? luminance < 206 : luminance > 24;
        if (alpha > 12 && isSubject) {
          const originalAlpha = (alpha / 255) * (sampleRate / currentDPR);
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
            opacity: originalAlpha,
            originalAlpha,
            velocityX: 0,
            velocityY: 0,
            angle: 0,
            speed: 0,
          });
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return {
      particles,
      textBoundaries: { left, right: left + drawW, width: drawW },
    };
  }

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;

  let textLeft: number;
  if (alignment === "center") {
    textLeft = textX - textWidth / 2;
  } else if (alignment === "left") {
    textLeft = textX;
  } else {
    textLeft = textX - textWidth;
  }

  const textBoundaries = { left: textLeft, right: textLeft + textWidth, width: textWidth };

  ctx.fillText(text, textX, textY);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const baseDPR = 3;
  const currentDPR = canvas.width / parseInt(canvas.style.width, 10);
  const sampleRate = Math.max(1, Math.round(Math.max(1, Math.round(currentDPR / baseDPR))));

  for (let y = 0; y < canvas.height; y += sampleRate) {
    for (let x = 0; x < canvas.width; x += sampleRate) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 0) {
        const originalAlpha = (alpha / 255) * (sampleRate / currentDPR);
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
          opacity: originalAlpha,
          originalAlpha,
          velocityX: 0,
          velocityY: 0,
          angle: 0,
          speed: 0,
        });
      }
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  return { particles, textBoundaries };
};

const updateParticles = (
  particles: Particle[],
  vaporizeX: number,
  deltaTime: number,
  MULTIPLIED_VAPORIZE_SPREAD: number,
  VAPORIZE_DURATION: number,
  direction: string,
  density: number,
) => {
  let allParticlesVaporized = true;

  particles.forEach((particle) => {
    const shouldVaporize =
      direction === "left-to-right"
        ? particle.originalX <= vaporizeX
        : particle.originalX >= vaporizeX;

    if (shouldVaporize) {
      if (particle.speed === 0) {
        particle.angle = Math.random() * Math.PI * 2;
        particle.speed = (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD;
        particle.velocityX = Math.cos(particle.angle) * particle.speed;
        particle.velocityY = Math.sin(particle.angle) * particle.speed;
        particle.shouldFadeQuickly = Math.random() > density;
      }

      // Both branches fade against the vaporise duration, so a short sweep
      // really is a short effect: at a fixed rate the dust outlasted it.
      const fadeRate = 2000 / VAPORIZE_DURATION;

      if (particle.shouldFadeQuickly) {
        particle.opacity = Math.max(0, particle.opacity - deltaTime * fadeRate * 1.6);
      } else {
        const dx = particle.originalX - particle.x;
        const dy = particle.originalY - particle.y;
        const distanceFromOrigin = Math.sqrt(dx * dx + dy * dy);
        const dampingFactor = Math.max(
          0.95,
          1 - distanceFromOrigin / (100 * MULTIPLIED_VAPORIZE_SPREAD),
        );

        const randomSpread = MULTIPLIED_VAPORIZE_SPREAD * 3;
        const spreadX = (Math.random() - 0.5) * randomSpread;
        const spreadY = (Math.random() - 0.5) * randomSpread;

        particle.velocityX = (particle.velocityX + spreadX + dx * 0.002) * dampingFactor;
        particle.velocityY = (particle.velocityY + spreadY + dy * 0.002) * dampingFactor;

        const maxVelocity = MULTIPLIED_VAPORIZE_SPREAD * 2;
        const currentVelocity = Math.sqrt(
          particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY,
        );
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity;
          particle.velocityX *= scale;
          particle.velocityY *= scale;
        }

        particle.x += particle.velocityX * deltaTime * 20;
        particle.y += particle.velocityY * deltaTime * 10;

        // The sweep across the subject is only half the effect; the dust that
        // follows it fades on its own clock, and at the rate this shipped with
        // it hung on screen for over a second after the sweep had finished,
        // which read as a slow vaporise however short the sweep was set to.
        const durationBasedFadeRate = 1.4 * fadeRate;
        particle.opacity = Math.max(0, particle.opacity - deltaTime * durationBasedFadeRate);
      }

      if (particle.opacity > 0.01) allParticlesVaporized = false;
    } else {
      allParticlesVaporized = false;
    }
  });

  return allParticlesVaporized;
};

const renderParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  globalDpr: number,
) => {
  ctx.save();
  ctx.scale(globalDpr, globalDpr);
  particles.forEach((particle) => {
    if (particle.opacity > 0) {
      ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`);
      ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
    }
  });
  ctx.restore();
};

const resetParticles = (particles: Particle[]) => {
  particles.forEach((particle) => {
    particle.x = particle.originalX;
    particle.y = particle.originalY;
    particle.opacity = particle.originalAlpha;
    particle.speed = 0;
    particle.velocityX = 0;
    particle.velocityY = 0;
  });
};

/** Bigger type throws its dust further. */
const calculateVaporizeSpread = (fontSize: number) => {
  const size = typeof fontSize === "string" ? parseInt(fontSize, 10) : fontSize;
  const points = [
    { size: 20, spread: 0.2 },
    { size: 50, spread: 0.5 },
    { size: 100, spread: 1.5 },
  ];

  if (size <= points[0].size) return points[0].spread;
  if (size >= points[points.length - 1].size) return points[points.length - 1].spread;

  let i = 0;
  while (i < points.length - 1 && points[i + 1].size < size) i += 1;

  const p1 = points[i];
  const p2 = points[i + 1];
  return p1.spread + ((size - p1.size) * (p2.spread - p1.spread)) / (p2.size - p1.size);
};

/** The canvas needs rgba(); anything else is a warning and a black fallback. */
const parseColor = (color: string) => {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);

  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  return "rgba(0, 0, 0, 1)";
};

function transformValue(input: number, inputRange: number[], outputRange: number[], clamp = false) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  const progress = (input - inputMin) / (inputMax - inputMin);
  let result = outputMin + progress * (outputMax - outputMin);

  if (clamp) {
    result =
      outputMax > outputMin
        ? Math.min(Math.max(result, outputMin), outputMax)
        : Math.min(Math.max(result, outputMax), outputMin);
  }

  return result;
}

function useIsInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "50px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}
