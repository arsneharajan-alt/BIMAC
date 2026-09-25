import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /**
         * BIMAC runs on two accents, and they mean different things:
         *
         *   brand (orange) — actions and the discipline axis. Buttons, primary
         *                    CTAs, the "what do you work with?" route in.
         *   azure  (ocean) — the software axis. Platforms, host applications,
         *                    and anything that answers "what do you already run?"
         *
         * Keeping the split honest is what stops the pair looking decorative.
         */
        brand: {
          50: "#FFF5ED",
          100: "#FFE8D5",
          200: "#FFCDAA",
          300: "#FDA974",
          400: "#FB7C3C",
          500: "#F55F16", // primary
          600: "#E24709",
          700: "#BB330A",
          800: "#952A10",
          900: "#7A2510",
          950: "#420F06",
        },
        /* Ocean / azure blue — the counterweight to the orange. */
        azure: {
          50: "#EFF7FF",
          100: "#DBEDFE",
          200: "#BFE0FE",
          300: "#93CDFD",
          400: "#5FB2FA",
          500: "#2E92F0", // primary
          600: "#1774D6",
          700: "#155DAD",
          800: "#164E8E",
          900: "#174275",
          950: "#0F2A4C",
        },
        /**
         * Ocean-tinted neutrals.
         *
         * Every border, rule, body copy and dark section on the site is drawn
         * from this ramp, so tinting it toward the blue is what makes the whole
         * product read as orange-and-ocean rather than orange-on-grey. The deep
         * end (900/950) is a true navy — that is the colour of the hero, the
         * footer, and every dark band between them.
         */
        ink: {
          50: "#F5F8FA",
          100: "#E9EFF4",
          200: "#D8E2EB",
          300: "#B7C6D5",
          400: "#889CB0",
          500: "#63788D",
          600: "#4C5F73",
          700: "#3B4D5F",
          800: "#22333F",
          900: "#0F2131",
          950: "#061422",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],

        /* ----------------------------------------------------------------
           The card type scale.

           Every card on the site sets its title and its copy from these two
           steps and nothing else. They are the sizes the back of a flip card
           was already using, which is the pairing that reads best at card
           size; the fronts, the catalogue cards, the feature cards and the
           rest were each carrying their own hand-typed pixel value, eight
           title sizes and four body sizes between them.

           Line height and tracking travel with the size deliberately. A
           title set at 24px with the body's leading is the other half of the
           same mistake, and leaving them separate is how the sizes drifted
           apart in the first place.
           ---------------------------------------------------------------- */
        "card-title": ["1.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "card-title-lg": ["1.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "card-body": ["0.875rem", { lineHeight: "1.625" }],
        /* Supporting copy inside a card — step lists, meta rows, captions. */
        "card-meta": ["0.8125rem", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        /* The page gutter — the single knob for how wide the whole site runs.
           At 100rem a 1920px monitor keeps only ~160px of margin a side. */
        container: "100rem",
      },
      /* Shadows carry the navy too — a grey shadow over a blue ground reads muddy. */
      boxShadow: {
        card: "0 1px 2px rgba(7,23,38,0.05), 0 1px 3px rgba(7,23,38,0.04)",
        lift: "0 12px 32px -12px rgba(7,23,38,0.20), 0 2px 6px rgba(7,23,38,0.06)",
        panel: "0 24px 60px -24px rgba(7,23,38,0.34)",
      },
      backgroundImage: {
        /* Blueprint grids — azure on light, azure-white on dark. */
        "grid-light":
          "linear-gradient(to right, rgba(23,93,173,0.075) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,93,173,0.075) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(147,205,253,0.075) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,205,253,0.075) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
        "grid-sm": "12px 12px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.985)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        /* Ambient motion — slow enough to feel like light, not animation. */
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(4%,-3%,0) scale(1.08)" },
        },
        "pulse-node": {
          "0%": { transform: "scale(1)", opacity: "0.85" },
          "70%": { transform: "scale(2.6)", opacity: "0" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        /* Marching-ants dash, for the leader line into the annotation. */
        dash: {
          to: { strokeDashoffset: "-24" },
        },
        /* One-time line draw as the model resolves on load. */
        draw: {
          from: { strokeDashoffset: "var(--draw-length, 900)" },
          to: { strokeDashoffset: "0" },
        },
        /* The skyline drawing itself in, the way a line drawing is built up:
           strokes run on, the drawing holds, then it fades and starts again.
           Paths carry pathLength=1 so one keyframe suits every path whatever
           its true length. The reset happens at zero opacity, so the jump back
           to a blank drawing is never seen. */
        "draw-loop": {
          "0%": { strokeDashoffset: "var(--draw-length, 1)", opacity: "0" },
          "4%": { strokeDashoffset: "var(--draw-length, 1)", opacity: "1" },
          "34%, 88%": { strokeDashoffset: "0", opacity: "1" },
          "99%, 100%": { strokeDashoffset: "0", opacity: "0" },
        },
        /* The hero backdrop revealing itself: a soft edge travels up the
           towers, so the wireframe arrives from the street up rather than
           simply fading on. The mask is 2.6x the height of the frame, so
           sliding its position is what moves the edge. */
        "hero-reveal": {
          from: { maskPosition: "0% 0%", WebkitMaskPosition: "0% 0%" },
          to: { maskPosition: "0% 100%", WebkitMaskPosition: "0% 100%" },
        },
        /* A very slow push in and across, so the still never sits dead. */
        "hero-drift": {
          "0%, 100%": { transform: "scale(1.06) translate3d(0, 0, 0)" },
          "50%": { transform: "scale(1.14) translate3d(-1.5%, -1%, 0)" },
        },
        /* The wireframe building itself outward from the vanishing point, the
           way the reference video draws a building: the mask is a disc that
           grows from the centre of the perspective, so edges arrive near-to-far
           rather than the whole picture fading up at once. */
        "lines-build": {
          from: { maskSize: "0% 0%", WebkitMaskSize: "0% 0%" },
          to: { maskSize: "320% 320%", WebkitMaskSize: "320% 320%" },
        },
        /* The solid massing settling in behind the lines, once they are drawn. */
        "plate-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        /* Exactly one tile, so the dot grid loops without a visible seam. */
        "grid-drift": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(44px,44px,0)" },
        },
        "grid-breathe": {
          "0%, 100%": { opacity: "0.25", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.12)" },
        },
        /* The software strip in the hero: one copy of the list scrolls out
           while its duplicate scrolls in, so the row never shows a seam. */
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-reverse": {
          from: { transform: "translate3d(-50%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        /* ---------------------------------------------------------------- */
        /* Tool card scenes. Every scene runs one 9s story and starts again,  */
        /* so a row of six cards stays in step instead of flickering against  */
        /* each other. Elements stagger with animation-delay.                 */
        /* ---------------------------------------------------------------- */
        "scene-in": {
          "0%, 6%": { opacity: "0", transform: "translateY(7px)" },
          "14%, 90%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(7px)" },
        },
        "scene-pop": {
          "0%, 6%": { opacity: "0", transform: "scale(0.4)" },
          "13%": { opacity: "1", transform: "scale(1.15)" },
          "18%, 90%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.4)" },
        },
        /* One of three options on screen at a time, on a shared 9s loop. */
        "scene-cycle": {
          "0%": { opacity: "0" },
          "3%, 30%": { opacity: "1" },
          "34%, 100%": { opacity: "0" },
        },
        "scene-bar": {
          "0%, 10%": { transform: "scaleX(0)" },
          "45%, 90%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
        "scene-flag": {
          "0%, 90%, 100%": { opacity: "0.9", transform: "translateY(0)" },
          "45%": { opacity: "1", transform: "translateY(-3px)" },
        },
        /* The logo rings behind the hero. One keyframe, per-ring duration and
           direction set inline, so three rings cost one rule. */
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        /* Depth of field for the hero orbits: an icon is sharp as it passes
           the top of its circle and softens as it travels down. Each icon runs
           this on the same period as its ring, phase-shifted by where it sits
           on the circle, so the focal zone stays put in the frame while the
           icons move through it. */
        "orbit-focus": {
          "0%, 100%": { filter: "blur(0px)", opacity: "1", transform: "scale(1.06)" },
          "28%": { filter: "blur(var(--focus-soft, 1.4px))", opacity: "0.86", transform: "scale(0.97)" },
          "50%": { filter: "blur(var(--focus-blur, 3px))", opacity: "0.66", transform: "scale(0.92)" },
          "72%": { filter: "blur(var(--focus-soft, 1.4px))", opacity: "0.86", transform: "scale(0.97)" },
        },
        /* Data running along a connector, left to right or top to bottom. The
           runner is a third of the track, so it starts and ends off it. */
        "flow-x": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(300%)" },
        },
        "flow-y": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(300%)" },
        },
        /* An input lighting up as it is fed to the automation, in turn. */
        feed: {
          "0%, 100%": { borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)" },
          "8%": { borderColor: "rgba(251,124,60,0.6)", backgroundColor: "rgba(245,95,22,0.12)" },
          "22%": { borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)" },
        },
        /* A pass of light that brightens the nodes as it crosses them. */
        "grid-scan": {
          "0%": { transform: "translateX(-45%)" },
          "100%": { transform: "translateX(245%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.35s ease-out both",
        "scale-in": "scale-in 0.16s cubic-bezier(0.22,1,0.36,1) both",
        sweep: "sweep 2.8s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        "pulse-node": "pulse-node 2.6s ease-out infinite",
        dash: "dash 1.2s linear infinite",
        draw: "draw 1.6s cubic-bezier(0.22,1,0.36,1) both",
        "draw-loop": "draw-loop 18s cubic-bezier(0.33,0.9,0.35,1) infinite",
        "grid-drift": "grid-drift 16s linear infinite",
        "grid-breathe": "grid-breathe 9s ease-in-out infinite",
        "grid-scan": "grid-scan 13s linear infinite",
        "hero-reveal": "hero-reveal 2.8s cubic-bezier(0.22,1,0.36,1) both",
        "hero-drift": "hero-drift 44s ease-in-out infinite",
        "lines-build": "lines-build 3.4s cubic-bezier(0.33,0.9,0.35,1) both",
        "plate-in": "plate-in 2.4s ease-out both",
        orbit: "orbit 90s linear infinite",
        "orbit-focus": "orbit-focus 90s linear infinite",
        "scene-in": "scene-in 9s cubic-bezier(0.22,1,0.36,1) infinite",
        "scene-pop": "scene-pop 9s cubic-bezier(0.22,1,0.36,1) infinite",
        "scene-cycle": "scene-cycle 9s ease-in-out infinite",
        "scene-bar": "scene-bar 9s cubic-bezier(0.22,1,0.36,1) infinite",
        "scene-flag": "scene-flag 2.4s ease-in-out infinite",
        "flow-x": "flow-x 2.2s cubic-bezier(0.45,0,0.55,1) infinite",
        "flow-y": "flow-y 2.2s cubic-bezier(0.45,0,0.55,1) infinite",
        feed: "feed 3s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
