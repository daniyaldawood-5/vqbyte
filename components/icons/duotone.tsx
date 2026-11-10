import type { ReactNode } from "react";

/**
 * VQBYTE duotone icon set — original artwork, 48×48 grid.
 * Stroke uses currentColor; the soft fill uses --icon-fill (defaults to brand tint).
 */
const F = "var(--icon-fill, #d6f0fb)";
const W = "var(--icon-paper, #ffffff)";

const paths: Record<string, ReactNode> = {
  LayoutDashboard: (
    <>
      <rect x="5" y="8" width="38" height="29" rx="4" fill={F} />
      <path d="M5 15h38" />
      <circle cx="9.5" cy="11.5" r=".8" fill="currentColor" />
      <circle cx="13" cy="11.5" r=".8" fill="currentColor" />
      <rect x="10" y="20" width="10" height="12" rx="2" fill={W} />
      <path d="M25 32v-5M30 32v-9M35 32v-6M40 32v-11" />
      <path d="M18 42h12M24 37v5" />
    </>
  ),
  Users: (
    <>
      <circle cx="17" cy="18" r="6" fill={F} />
      <path d="M6 39c0-6.5 5-11 11-11s11 4.5 11 11z" fill={F} />
      <path d="M30 7h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-5l-4 4v-4h-2a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z" fill={W} />
      <path d="M32.5 12h6.5M32.5 15.5h4" />
    </>
  ),
  GraduationCap: (
    <>
      <path d="M12 23v8c0 3.3 5.4 6 12 6s12-2.7 12-6v-8" fill={W} />
      <path d="M4 18 24 9l20 9-20 9z" fill={F} />
      <path d="M44 18v11" />
      <circle cx="44" cy="31" r="2" fill="currentColor" />
    </>
  ),
  Warehouse: (
    <>
      <path d="M4 18 24 7l20 11v24H4z" fill={F} />
      <path d="M11 42V24h26v18" fill={W} />
      <rect x="14" y="33" width="9" height="9" fill={F} />
      <rect x="25" y="33" width="9" height="9" fill={F} />
      <rect x="19.5" y="26" width="9" height="7" fill={F} />
    </>
  ),
  ScanBarcode: (
    <>
      <rect x="9" y="5" width="30" height="38" rx="4" fill={F} />
      <rect x="13" y="9" width="22" height="12" rx="2" fill={W} />
      <path d="M17 12.5v5M20 12.5v5M23.5 12.5v5M27 12.5v5M31 12.5v5" />
      {[17, 24, 31].flatMap((x) => [27, 32, 37].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" stroke="none" />))}
    </>
  ),
  Code2: (
    <>
      <rect x="4" y="8" width="40" height="32" rx="4" fill={F} />
      <path d="M4 15h40" />
      <path d="m18 22-5 5 5 5M30 22l5 5-5 5M26 20l-4 14" />
    </>
  ),
  AppWindow: (
    <>
      <rect x="4" y="7" width="40" height="34" rx="4" fill={W} />
      <path d="M4 14h40" />
      <circle cx="8.5" cy="10.5" r=".8" fill="currentColor" />
      <circle cx="12" cy="10.5" r=".8" fill="currentColor" />
      <rect x="9" y="19" width="12" height="17" rx="2" fill={F} />
      <path d="M26 20h13M26 25h13M26 30h8" />
    </>
  ),
  Smartphone: (
    <>
      <rect x="13" y="4" width="22" height="40" rx="5" fill={F} />
      <rect x="17" y="10" width="14" height="22" rx="2" fill={W} />
      <path d="M21 38h6" />
      <path d="m20 21.5 3 3 5-6" />
    </>
  ),
  Workflow: (
    <>
      <path d="m12 13 7 6M36 13l-7 6M12 35l7-6M36 35l-7-6" />
      <circle cx="24" cy="24" r="7" fill={F} />
      <circle cx="9" cy="10" r="4" fill={W} />
      <circle cx="39" cy="10" r="4" fill={W} />
      <circle cx="9" cy="38" r="4" fill={W} />
      <circle cx="39" cy="38" r="4" fill={W} />
    </>
  ),
  BarChart3: (
    <>
      <rect x="5" y="6" width="38" height="36" rx="4" fill={F} />
      <rect x="11" y="26" width="6" height="10" rx="1.5" fill={W} />
      <rect x="21" y="19" width="6" height="17" rx="1.5" fill={W} />
      <rect x="31" y="12" width="6" height="24" rx="1.5" fill={W} />
    </>
  ),
  Search: (
    <>
      <circle cx="20" cy="20" r="13" fill={F} />
      <path d="m30 30 12 12" strokeWidth="3.2" />
      <path d="m13.5 24 5-5 3.5 3 6-7" />
    </>
  ),
  Megaphone: (
    <>
      <path d="M14 29l3 11h5l-2-11" fill={W} />
      <path d="M8 18h7l17-9v29l-17-9H8a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z" fill={F} />
      <path d="M38 17.5c1.9 1.6 3 3.8 3 6.5s-1.1 4.9-3 6.5" />
    </>
  ),
  Globe: (
    <>
      <circle cx="24" cy="24" r="19" fill={F} />
      <ellipse cx="24" cy="24" rx="8" ry="19" fill={W} />
      <path d="M5 24h38M8.5 14h31M8.5 34h31" />
    </>
  ),
  Fuel: (
    <>
      <rect x="5" y="19" width="23" height="23" rx="3" fill={F} />
      <path d="M5 27h23M11 19v-4h11v4" />
      <path d="M28 35h7v7" />
      <path d="M36 5s-7 8.6-7 14a7 7 0 0 0 14 0c0-5.4-7-14-7-14z" fill={W} />
      <path d="M33 20a3 3 0 0 0 3 3" />
    </>
  ),
  Factory: (
    <>
      <path d="M4 42V22l10 6v-6l10 6v-6l10 6V8h8v34z" fill={F} />
      <rect x="9" y="33" width="5" height="5" rx="1" fill={W} />
      <rect x="19" y="33" width="5" height="5" rx="1" fill={W} />
      <rect x="29" y="33" width="5" height="5" rx="1" fill={W} />
      <path d="M36 4c1.5 1 1.5 2.2 0 3.2M40 3c1.5 1 1.5 2.2 0 3.2" />
    </>
  ),
  Truck: (
    <>
      <rect x="3" y="12" width="26" height="20" rx="2" fill={F} />
      <path d="M29 18h8l7 7v7H29z" fill={W} />
      <path d="M33 18v7h11" />
      <circle cx="12" cy="35" r="4" fill={W} />
      <circle cx="36" cy="35" r="4" fill={W} />
    </>
  ),
  ShoppingBag: (
    <>
      <path d="M9 15h30l-2 27H11z" fill={F} />
      <path d="M17 19v-6a7 7 0 0 1 14 0v6" />
      <path d="m18 30 4 4 8-8" />
    </>
  ),
  Building2: (
    <>
      <rect x="22" y="18" width="19" height="24" fill={F} />
      <path d="M26.5 24h3.5M33.5 24h3M26.5 30h3.5M33.5 30h3M26.5 36h3.5M33.5 36h3" />
      <path d="M10 42V6M3 9h31M28 9v6M6 42h8" />
      <path d="M10 14 16 9M10 14 4 9" />
      <path d="M28 15a2 2 0 1 0 2 2" />
    </>
  ),
  Wrench: (
    <g transform="scale(2)">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        fill={F}
        strokeWidth="1"
      />
    </g>
  ),
  /* Design · Build · Launch · Repeat */
  Design: (
    <>
      <path d="M24 5 34 23 24 41 14 23z" fill={F} />
      <circle cx="24" cy="23" r="3" fill={W} />
      <path d="M24 5v15M14 43h20" />
    </>
  ),
  Build: (
    <>
      <rect x="15" y="6" width="18" height="16" rx="2" fill={F} />
      <rect x="5" y="25" width="18" height="16" rx="2" fill={W} />
      <rect x="25" y="25" width="18" height="16" rx="2" fill={F} />
    </>
  ),
  Launch: (
    <>
      <path d="M15 30 9 36l7 1M33 30l6 6-7 1" />
      <path d="M24 4c8 6 11 15 9 26H15C13 19 16 10 24 4z" fill={F} />
      <circle cx="24" cy="17" r="4" fill={W} />
      <path d="m20 35 4 8 4-8" />
    </>
  ),
  Repeat: (
    <>
      <circle cx="24" cy="24" r="19" fill={F} stroke="none" />
      <path d="M36 17a14 14 0 0 0-25 1M12 31a14 14 0 0 0 25-1" />
      <path d="M37 9v9h-9M11 39v-9h9" />
    </>
  ),
};

export const duotoneNames = Object.keys(paths);

export function DuotoneIcon({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {content}
    </svg>
  );
}
