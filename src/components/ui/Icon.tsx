import type { ReactNode } from "react";
import type { GlyphId } from "@/types";
import { cn } from "@/lib/utils";

/**
 * A small, original icon set drawn on a 24×24 grid.
 *
 * Everything is stroked with `currentColor` at a consistent weight so icons sit
 * correctly next to text at any size. Brand marks are filled instead.
 */

const filled = { fill: "currentColor", stroke: "none" } as const;

const glyphs: Record<GlyphId, ReactNode> = {
  "arrow-right": (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  "bar-chart": (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6.5M12 20V6.5M17 20v-9.5" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v18H6.5A1.5 1.5 0 0 1 5 19.5z" />
      <path d="M9 3v18" />
      <path d="M12.5 8h3.5" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 21 7.5v9L12 21l-9-4.5v-9z" />
      <path d="M3 7.5 12 12l9-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M14 9h4a2 2 0 0 1 2 2v10" />
      <path d="M7.5 8h3M7.5 12h3M7.5 16h3" />
      <path d="M2.5 21h19" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7" />
      <path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.4 10.9 15.3 16 9.5" />
    </>
  ),
  "chevron-down": <path d="M6 9.5 12 15.5 18 9.5" />,
  "chevron-right": <path d="M9.5 6 15.5 12 9.5 18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.6 2.1" />
    </>
  ),
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  code: (
    <>
      <path d="M9 8.5 4.5 12 9 15.5" />
      <path d="M15 8.5 19.5 12 15 15.5" />
      <path d="M13 5.5 11 18.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.6 8.4 13.4 13.4 8.4 15.6 10.6 10.6z" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3 21 7.5v9L12 21l-9-4.5v-9z" />
      <path d="M3 7.5 12 12l9-4.5" />
      <path d="M12 12v9" />
      <path d="M7.5 5.25 16.5 9.75" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="M7.5 10 12 14.5 16.5 10" />
      <path d="M4 19.5h16" />
    </>
  ),
  droplet: (
    <path d="M12 3.2c0 0 6 6.3 6 10.3a6 6 0 0 1-12 0c0-4 6-10.3 6-10.3z" />
  ),
  flame: (
    <>
      <path d="M12 3c.5 2.6 1.8 3.9 3.1 5.2 1.4 1.4 2.4 3 2.4 5.3a5.5 5.5 0 0 1-11 0c0-1.7.6-3 1.6-4 .3.9.8 1.5 1.5 1.8C9.7 8.8 10.4 5.9 12 3z" />
    </>
  ),
  frame: (
    <>
      <path d="M3 4.5h18M3 19.5h18" />
      <path d="M6.5 4.5v15M17.5 4.5v15" />
      <path d="M6.5 12h11" />
    </>
  ),
  gantt: (
    <>
      <path d="M4 4v16h16" />
      <path d="M7 7.5h8M9.5 12h8M7 16.5h5.5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.4 12 3.6l8.5 6.8V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M9.5 21v-6.5h5V21" />
    </>
  ),
  "message-circle": (
    <>
      <path d="M20.5 11.6a8 8 0 0 1-11.6 7.2L3.5 20.5l1.7-5.4a8 8 0 1 1 15.3-3.5z" />
      <path d="M8.8 11.6h.01M12 11.6h.01M15.2 11.6h.01" />
    </>
  ),
  whatsapp: (
    <>
      <path
        {...filled}
        d="M12.04 2.2c-5.42 0-9.82 4.4-9.82 9.82 0 1.73.45 3.42 1.32 4.91L2.2 21.8l4.99-1.31a9.78 9.78 0 0 0 4.85 1.24h.004c5.41 0 9.81-4.4 9.81-9.82a9.76 9.76 0 0 0-2.87-6.94 9.75 9.75 0 0 0-6.94-2.88zm0 17.9h-.003a8.15 8.15 0 0 1-4.15-1.14l-.3-.18-3.09.81.82-3.01-.19-.31a8.13 8.13 0 0 1-1.25-4.35c0-4.5 3.67-8.16 8.17-8.16a8.11 8.11 0 0 1 5.77 2.4 8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.17-8.16 8.17z"
      />
      <path
        {...filled}
        d="M16.52 14.34c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.97-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.97-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.43.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"
      />
    </>
  ),
  wind: (
    <>
      <path d="M3 8.5h9.5a2.6 2.6 0 1 0-2.6-2.6" />
      <path d="M3 12.5h13a2.6 2.6 0 1 1-2.6 2.6" />
      <path d="M3 16.5h7" />
    </>
  ),
  "file-text": (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12.5h6M9 16.5h6" />
    </>
  ),
  filter: <path d="M3.5 5h17l-6.6 7.6V19l-3.8 2v-8.4z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.7 3.7 5.7 3.7 9S14.4 18.3 12 21c-2.4-2.7-3.7-5.7-3.7-9S9.6 5.7 12 3z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 21 7.5 12 12 3 7.5z" />
      <path d="M3 12.2 12 16.7 21 12.2" />
      <path d="M3 16.7 12 21.2 21 16.7" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M13 6.8 14.6 5.2a3.9 3.9 0 0 1 5.5 5.5L18.5 12.3" />
      <path d="M11 17.2 9.4 18.8a3.9 3.9 0 0 1-5.5-5.5L5.5 11.7" />
    </>
  ),
  linkedin: (
    <>
      <path {...filled} d="M4.5 9h3.1v10.5H4.5z" />
      <circle {...filled} cx="6.05" cy="5.6" r="1.85" />
      <path
        {...filled}
        d="M10.2 9h3v1.5c.6-1.05 1.75-1.8 3.4-1.8 2.6 0 4.4 1.75 4.4 4.9v5.9h-3.1v-5.3c0-1.6-.65-2.6-2.05-2.6-1.2 0-1.85.8-2.15 1.6-.1.28-.1.66-.1 1.05v5.25h-3.1z"
      />
    </>
  ),
  list: (
    <>
      <path d="M8.5 6h11.5M8.5 12h11.5M8.5 18h11.5" />
      <path d="M4.2 6h.01M4.2 12h.01M4.2 18h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.6 7 12 12.8 20.4 7" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21.2s7-6.3 7-11.2a7 7 0 1 0-14 0c0 4.9 7 11.2 7 11.2z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  minus: <path d="M5.5 12h13" />,
  package: (
    <>
      <path d="M12 3 21 7.5v9L12 21l-9-4.5v-9z" />
      <path d="M3 7.5 12 12l9-4.5" />
      <path d="M12 12v9" />
      <path d="M7.5 5.25 16.5 9.75" />
      <path d="M16.5 9.75v4" />
    </>
  ),
  phone: (
    <path d="M6.2 3.5h2.9l1.9 4.7-2.1 1.4a12.4 12.4 0 0 0 5.5 5.5l1.4-2.1 4.7 1.9v2.9a2 2 0 0 1-2.2 2C10.3 18.9 5.1 13.7 4.2 5.7a2 2 0 0 1 2-2.2z" />
  ),
  play: <path d="M8.2 5.4 18.6 12 8.2 18.6z" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  quote: (
    <>
      <path d="M9.4 5.6C6.2 7.3 4.6 9.9 4.6 13.4V18.4h6.2v-6.4H7.3c.1-2.1 1-3.6 2.8-4.6z" />
      <path d="M19.4 5.6c-3.2 1.7-4.8 4.3-4.8 7.8V18.4h6.2v-6.4h-3.5c.1-2.1 1-3.6 2.8-4.6z" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.8c3 2.2 4.8 5.6 4.8 9.6L14.2 15.6H9.8L7.2 12.4c0-4 1.8-7.4 4.8-9.6z" />
      <circle cx="12" cy="9.8" r="1.9" />
      <path d="M9.6 16.6 7 21.2l4.2-1.9M14.4 16.6 17 21.2l-4.2-1.9" />
    </>
  ),
  ruler: (
    <>
      <path d="M3 15.2 15.2 3l5.8 5.8L8.8 21z" />
      <path d="M6.8 11.4 9 13.6M9.9 8.3l2.2 2.2M13 5.2l2.2 2.2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.6" />
      <path d="M15.6 15.6 20.5 20.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.6v2.6M12 18.8v2.6M4.5 6.9l2.3 1.3M17.2 15.8l2.3 1.3M4.5 17.1l2.3-1.3M17.2 8.2l2.3-1.3" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3 19.2 5.9v6.2c0 4.4-2.9 7.7-7.2 9.2-4.3-1.5-7.2-4.8-7.2-9.2V5.9z" />
      <path d="M9.1 12.2 11.2 14.4 15.2 10" />
    </>
  ),
  sitemap: (
    <>
      <rect x="9.2" y="2.8" width="5.6" height="4.4" rx="1" />
      <rect x="2.8" y="16.8" width="5.6" height="4.4" rx="1" />
      <rect x="15.6" y="16.8" width="5.6" height="4.4" rx="1" />
      <path d="M12 7.2v3.4" />
      <path d="M5.6 16.8v-3.2h12.8v3.2" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8.2h8M17.2 8.2H20M4 15.8h4.8M13.8 15.8H20" />
      <circle cx="14.6" cy="8.2" r="2.3" />
      <circle cx="11.2" cy="15.8" r="2.3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3.2 12.6 7.7 17.1 9.3 12.6 10.9 11 15.4 9.4 10.9 4.9 9.3 9.4 7.7z" />
      <path d="M17.8 14.4 18.7 16.9 21.2 17.8 18.7 18.7 17.8 21.2 16.9 18.7 14.4 17.8 16.9 16.9z" />
    </>
  ),
  star: (
    <path d="M12 3.4 14.7 8.9 20.8 9.8 16.4 14.1 17.4 20.1 12 17.3 6.6 20.1 7.6 14.1 3.2 9.8 9.3 8.9z" />
  ),
  tag: (
    <>
      <path d="M3.2 11.4V3.6h7.8l9.4 9.4-7.8 7.8z" />
      <circle cx="7.3" cy="7.7" r="1.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9.2" cy="8.2" r="3.5" />
      <path d="M2.8 20c0-3.4 2.9-5.7 6.4-5.7s6.4 2.3 6.4 5.7" />
      <path d="M16.4 5.2a3.5 3.5 0 0 1 0 6.6" />
      <path d="M17.6 14.7c2.2.7 3.6 2.6 3.6 5.3" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12.5" height="12" rx="2" />
      <path d="M15.5 10.2 21 7v10l-5.5-3.2z" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="3.6" width="6.4" height="5.2" rx="1" />
      <rect x="14.6" y="15.2" width="6.4" height="5.2" rx="1" />
      <path d="M9.4 6.2h4.2a2 2 0 0 1 2 2v7" />
      <path d="M13.4 12.6 15.6 15.2 17.8 12.6" />
    </>
  ),
  "x-social": (
    <path
      {...filled}
      d="M4 4h4.35l4.02 5.52L17.1 4h2.98l-6.14 7.06L20.6 20h-4.35l-4.3-5.9L6.7 20H3.7l6.55-7.53z"
    />
  ),
  youtube: (
    <>
      <path
        {...filled}
        d="M21.6 7.4a2.55 2.55 0 0 0-1.8-1.8C18.2 5.15 12 5.15 12 5.15s-6.2 0-7.8.45a2.55 2.55 0 0 0-1.8 1.8A26.6 26.6 0 0 0 2 12.3a26.6 26.6 0 0 0 .4 4.9 2.55 2.55 0 0 0 1.8 1.8c1.6.45 7.8.45 7.8.45s6.2 0 7.8-.45a2.55 2.55 0 0 0 1.8-1.8 26.6 26.6 0 0 0 .4-4.9 26.6 26.6 0 0 0-.4-4.9z"
      />
      <path d="M10.2 15.3V9.3l5.2 3z" fill="#fff" stroke="none" />
    </>
  ),
  zap: <path d="M13.4 2.5 5.6 13.6h5.4L10.6 21.5 18.4 10.4H13z" />,
};

export interface IconProps {
  name: GlyphId;
  className?: string;
  /** Stroke weight — lighten it for large decorative icons. */
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}

export function Icon({ name, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("h-[1em] w-[1em] shrink-0", className)}
    >
      {glyphs[name]}
    </svg>
  );
}

export default Icon;
