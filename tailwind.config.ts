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
          950: "#071726",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
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
        /* Exactly one tile, so the dot grid loops without a visible seam. */
        "grid-drift": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(44px,44px,0)" },
        },
        "grid-breathe": {
          "0%, 100%": { opacity: "0.25", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.12)" },
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
        "grid-drift": "grid-drift 16s linear infinite",
        "grid-breathe": "grid-breathe 9s ease-in-out infinite",
        "grid-scan": "grid-scan 13s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
