// Generates the VQBYTE website illustration set as hand-authored SVG.
// Usage: node scripts/generate-illustrations.mjs
// Plain Node ESM, no dependencies. Output: public/images/*.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'images');

/* ------------------------------------------------------------------ */
/* Palette + basics                                                    */
/* ------------------------------------------------------------------ */
const C = {
  ink: '#0b172a', primary: '#0078a8', cyan: '#06a8e6', deep: '#005e86',
  bg: '#f5fafd', bg2: '#eaf6fc', border: '#d7e3ea', grey: '#667085',
  amber: '#f59e0b', green: '#16a34a', coral: '#ef6c57', violet: '#7c5cff',
  white: '#ffffff', line: '#e9f0f4', soft: '#f7fafc', slate: '#344054', mute: '#98a2b3',
};
const SKIN = ['#f1c9a5', '#d9a27a', '#a86b45', '#6b4430'];
const HAIR = ['#1f1a17', '#3b2a20', '#2b2f3a', '#5a3a22', '#141414'];
const FONT = 'Inter, Arial, sans-serif';

let P = 'x'; // current file prefix for ids
let uid = 0;
const id = (s) => `${P}-${s}`;
const url = (s) => `url(#${id(s)})`;
const nid = (s) => id(`${s}${++uid}`);
const r1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbToHex(r, g, b) { return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''); }
/** mix colour with white; a = amount of white (0..1) */
function tint(h, a) { const [r, g, b] = hexToRgb(h); return rgbToHex(r + (255 - r) * a, g + (255 - g) * a, b + (255 - b) * a); }
/** mix colour with black */
function shade(h, a) { const [r, g, b] = hexToRgb(h); return rgbToHex(r * (1 - a), g * (1 - a), b * (1 - a)); }

function attrs(o) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${typeof v === 'number' ? r1(v) : v}"`).join(' ');
}
const el = (tag, o, inner) => (inner === undefined ? `<${tag} ${attrs(o)}/>` : `<${tag} ${attrs(o)}>${inner}</${tag}>`);

const R = (x, y, w, h, fill, o = {}) => el('rect', {
  x, y, width: Math.max(0, w), height: Math.max(0, h), rx: o.r || undefined, fill: fill ?? 'none',
  stroke: o.stroke, 'stroke-width': o.sw ?? (o.stroke ? 1 : undefined), opacity: o.op,
  filter: o.sh ? url('sh') : undefined, transform: o.t, 'stroke-dasharray': o.dash,
});
const Ci = (cx, cy, r, fill, o = {}) => el('circle', {
  cx, cy, r, fill: fill ?? 'none', stroke: o.stroke, 'stroke-width': o.sw, opacity: o.op,
  filter: o.sh ? url('sh') : undefined, 'stroke-dasharray': o.dash, transform: o.t, pathLength: o.pl,
  'stroke-linecap': o.cap, 'stroke-dashoffset': o.off,
});
const El = (cx, cy, rx, ry, fill, o = {}) => el('ellipse', { cx, cy, rx, ry, fill, opacity: o.op, transform: o.t, stroke: o.stroke, 'stroke-width': o.sw });
const L = (x1, y1, x2, y2, stroke, sw = 1, o = {}) => el('line', {
  x1, y1, x2, y2, stroke, 'stroke-width': sw, 'stroke-dasharray': o.dash, 'stroke-linecap': o.cap ?? 'round', opacity: o.op,
});
const Pa = (d, fill, o = {}) => el('path', {
  d, fill: fill ?? 'none', stroke: o.stroke, 'stroke-width': o.sw, 'stroke-linecap': o.cap ?? (o.stroke ? 'round' : undefined),
  'stroke-linejoin': o.join ?? (o.stroke ? 'round' : undefined), opacity: o.op, 'stroke-dasharray': o.dash,
  filter: o.sh ? url('sh') : undefined, transform: o.t, id: o.id, pathLength: o.pl,
});
const G = (inner, o = {}) => el('g', {
  transform: o.t, opacity: o.op, filter: o.sh ? url('sh') : undefined, 'clip-path': o.clip ? `url(#${o.clip})` : undefined,
}, inner);
const T = (x, y, str, o = {}) => el('text', {
  x, y, 'font-size': o.s ?? 14, 'font-weight': o.w ?? undefined, fill: o.f ?? C.ink, 'text-anchor': o.a,
  opacity: o.op, 'letter-spacing': o.ls, transform: o.t,
}, esc(str));
const tw = (str, s = 12, k = 0.56) => String(str).length * s * k;

/** rounded-rect path with per-corner radii [tl,tr,br,bl] */
function rrPath(x, y, w, h, [tl, tr, br, bl]) {
  return `M${r1(x + tl)},${r1(y)}H${r1(x + w - tr)}${tr ? `Q${r1(x + w)},${r1(y)} ${r1(x + w)},${r1(y + tr)}` : ''}V${r1(y + h - br)}${br ? `Q${r1(x + w)},${r1(y + h)} ${r1(x + w - br)},${r1(y + h)}` : ''}H${r1(x + bl)}${bl ? `Q${r1(x)},${r1(y + h)} ${r1(x)},${r1(y + h - bl)}` : ''}V${r1(y + tl)}${tl ? `Q${r1(x)},${r1(y)} ${r1(x + tl)},${r1(y)}` : ''}Z`;
}
/** clip rect: returns [clipPathElement, clipId] */
function clipRect(x, y, w, h, r = 0) {
  const cid = nid('clip');
  return [el('clipPath', { id: cid }, R(x, y, w, h, '#fff', { r })), cid];
}

/** Catmull-Rom style smooth path through points */
function smooth(pts) {
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */
function defs(extra = '') {
  return `<defs>`
    + `<filter id="${id('sh')}" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1200" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${C.ink}" flood-opacity="0.13"/></filter>`
    + `<linearGradient id="${id('bg')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>`
    + `<linearGradient id="${id('brand')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.primary}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>`
    + `<linearGradient id="${id('deep')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.deep}"/></linearGradient>`
    + `<linearGradient id="${id('area')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0.28"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>`
    + `<linearGradient id="${id('sky')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset="1" stop-color="#f7fbfe"/></linearGradient>`
    + `<linearGradient id="${id('floor')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfeaf1"/><stop offset="1" stop-color="#edf4f8"/></linearGradient>`
    + `<pattern id="${id('dots')}" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${C.primary}" opacity="0.16"/></pattern>`
    + extra + `</defs>`;
}

function svgDoc(name, title, body, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-labelledby="${id('title')}" font-family="${FONT}">`
    + `<title id="${id('title')}">${esc(title)}</title>${defs(extraDefs)}${body}</svg>`;
}

/** soft gradient background with decorative shapes (for UI mockups) */
function uiBackdrop({ dots = [[960, 40, 200, 140], [40, 640, 180, 120]] } = {}) {
  let s = R(0, 0, 1200, 800, url('bg'));
  s += Ci(1060, 140, 260, '#ffffff', { op: 0.55 }) + Ci(120, 720, 220, C.bg2, { op: 0.9 });
  s += Ci(1120, 760, 160, tint(C.cyan, 0.85), { op: 0.6 });
  for (const [x, y, w, h] of dots) s += R(x, y, w, h, url('dots'));
  return s;
}

/* ------------------------------------------------------------------ */
/* Icons (16x16 line icons)                                            */
/* ------------------------------------------------------------------ */
const ICONS = {
  grid: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  chart: 'M3 14V8M8 14V3M13 14V6',
  box: 'M8 1.5 14 4.5v7L8 14.5 2 11.5v-7zM2 4.5l6 3 6-3M8 7.5v7',
  coin: 'M1.5 8a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0M10 5.5H7.2a1.4 1.4 0 0 0 0 2.8h1.6a1.4 1.4 0 0 1 0 2.8H6M8 4v1.5M8 11.1v1.4',
  users: 'M6 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.5 14c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M11 3a2.5 2.5 0 0 1 0 4.5M12.5 10c1.3.5 2 1.8 2 4',
  chat: 'M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6a1.5 1.5 0 0 1-1.5 1.5H7l-3.5 3v-3A1.5 1.5 0 0 1 2 9.5z',
  cart: 'M1.5 2h2l1.6 8h7.4l1.5-5.5H4.4M6 13.5h.01M12 13.5h.01',
  doc: 'M4 1.5h5.5l3 3v10h-8.5zM9.5 1.5v3h3M6 8h4.5M6 11h4.5',
  truck: 'M1.5 4h8v7h-8zM9.5 6.5h3l2 2.5v2h-5M4.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM11.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  cap: 'M8 2.5 15 6 8 9.5 1 6zM4 7.5v3.5c1 1 2.5 1.5 4 1.5s3-.5 4-1.5V7.5M15 6v4',
  home: 'M2 7.5 8 2.5l6 5M3.5 6.5v7.5h9V6.5',
  bell: 'M4 11V7a4 4 0 0 1 8 0v4l1.5 1.5h-11zM6.5 14h3',
  search: 'M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM14 14l-3.5-3.5',
  check: 'M3 8.5l3 3 7-7',
  pin: 'M8 14.5s5-4.6 5-8.5a5 5 0 0 0-10 0c0 3.9 5 8.5 5 8.5zM8 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  factory: 'M1.5 14V7l4 2.5V7l4 2.5V4h5v10z',
  calendar: 'M2 3.5h12v10.5H2zM2 6.5h12M5 1.5v3M11 1.5v3',
  mail: 'M2 3.5h12v9H2zM2 4l6 4.5L14 4',
  play: 'M5 3l8 5-8 5z',
  lock: 'M4 7.5h8v6.5H4zM5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5',
  card: 'M1.5 4h13v8.5h-13zM1.5 7h13M4 10h3',
  link: 'M7 9.5a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.8.8M9 6.5a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.8-.8',
  globe: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM1.5 8h13M8 1.5c2 2 2.5 4.5 2.5 6.5S10 12.5 8 14.5C6 12.5 5.5 10 5.5 8S6 3.5 8 1.5z',
  store: 'M2 6.5 3 2.5h10l1 4M2.5 6.5v7.5h11V6.5M2 6.5c0 1.5 1 2 2 2s2-.5 2-2c0 1.5 1 2 2 2s2-.5 2-2c0 1.5 1 2 2 2s2-.5 2-2M6.5 14v-3.5h3V14',
  code: 'M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5M9.5 2.5l-3 11',
  shield: 'M8 1.5 13.5 3.5V8c0 3.3-2.4 5.6-5.5 6.5C4.9 13.6 2.5 11.3 2.5 8V3.5zM5.5 8l2 2 3.5-3.5',
  megaphone: 'M2 6.5v3h2.5L11 13V3L4.5 6.5zM4.5 9.5l1 4h2l-1-4M13 6.5v3',
  mobile: 'M4.5 1.5h7v13h-7zM7 12.5h2',
  database: 'M2.5 3.5c0-1.1 2.5-2 5.5-2s5.5.9 5.5 2-2.5 2-5.5 2-5.5-.9-5.5-2zM2.5 3.5v9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-9M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2',
  server: 'M2 2h12v5H2zM2 9h12v5H2zM4.5 4.5h.01M4.5 11.5h.01',
  trend: 'M1.5 12 6 7.5l3 3 5.5-6M10.5 4.5h4v4',
  wrench: 'M10.5 2a3.5 3.5 0 0 0-3.2 4.8L2 12.1 3.9 14l5.3-5.3A3.5 3.5 0 0 0 14 5.5l-2.2 2.2-1.8-.5-.5-1.8 2.2-2.2A3.5 3.5 0 0 0 10.5 2z',
  plus: 'M8 3v10M3 8h10',
  send: 'M14 2 7 9M14 2l-4.5 12L7 9 2 6.5z',
  clock: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 4.5V8l2.5 1.5',
  heart: 'M8 13.5S2 10 2 5.8A3 3 0 0 1 8 4.6a3 3 0 0 1 6 1.2C14 10 8 13.5 8 13.5z',
  star: 'M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z',
  user: 'M8 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 14.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5',
  arrowUp: 'M8 13V3M4 7l4-4 4 4',
  arrowDown: 'M8 3v10M4 9l4 4 4-4',
  flow: 'M2 3h5v4H2zM9 9h5v4H9zM4.5 7v4h4.5',
};
function icon(k, x, y, c, s = 16, sw = 1.8) {
  const sc = s / 16;
  const t = `translate(${r1(x)},${r1(y)})${sc !== 1 ? ` scale(${r1(sc * 100) / 100})` : ''}`;
  if (k === 'gear') {
    return el('g', { transform: t, fill: 'none', stroke: c }, Ci(8, 8, 5.2, null, { sw: 2.6, dash: '2 1.6' }) + Ci(8, 8, 2.3, null, { sw: 1.8 }));
  }
  return el('g', { transform: t, fill: 'none', stroke: c, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, `<path d="${ICONS[k] || ICONS.grid}"/>`);
}
/** icon in a tinted rounded tile */
function iconTile(k, x, y, c, size = 32) {
  return R(x, y, size, size, tint(c, 0.86), { r: size * 0.3 }) + icon(k, x + size / 2 - size * 0.25, y + size / 2 - size * 0.25, c, size * 0.5);
}

/* ------------------------------------------------------------------ */
/* UI primitives                                                       */
/* ------------------------------------------------------------------ */
function pill(x, y, label, color, { s = 11, solid = false, h, a } = {}) {
  const w = tw(label, s, 0.6) + 18; const hh = h ?? s + 11;
  const xx = a === 'end' ? x - w : x;
  return R(xx, y, w, hh, solid ? color : tint(color, 0.86), { r: hh / 2 })
    + T(xx + w / 2, y + hh / 2 + s * 0.36, label, { s, w: 600, f: solid ? '#fff' : shade(color, 0.12), a: 'middle' });
}
const pillW = (label, s = 11) => tw(label, s, 0.6) + 18;

function button(x, y, w, h, label, { fill = url('brand'), color = '#fff', s = 13, r, stroke, ic } = {}) {
  let o = R(x, y, w, h, fill, { r: r ?? h / 2, stroke });
  if (ic) {
    const tx = x + w / 2 - (tw(label, s, 0.58) + 22) / 2;
    o += icon(ic, tx, y + h / 2 - 7, color, 14) + T(tx + 22, y + h / 2 + s * 0.36, label, { s, w: 600, f: color });
  } else o += T(x + w / 2, y + h / 2 + s * 0.36, label, { s, w: 600, f: color, a: 'middle' });
  return o;
}

/** text placeholder line */
const tline = (x, y, w, c = C.line, h = 8) => R(x, y, w, h, c, { r: h / 2 });

/** browser-like application window. Returns svg; content top = y+40 */
function windowChrome(x, y, w, h, { urlText = 'app.vqbyte.com', dark = false, sh = true } = {}) {
  const top = dark ? '#111f35' : C.soft;
  let s = R(x, y, w, h, dark ? '#0f1b2e' : '#fff', { r: 16, sh, stroke: dark ? '#1e2d45' : C.border });
  s += Pa(rrPath(x + 0.5, y + 0.5, w - 1, 40, [16, 16, 0, 0]), top);
  s += L(x, y + 40, x + w, y + 40, dark ? '#1e2d45' : C.border, 1, { cap: 'butt' });
  s += Ci(x + 22, y + 20, 5.5, C.coral) + Ci(x + 40, y + 20, 5.5, C.amber) + Ci(x + 58, y + 20, 5.5, C.green);
  if (urlText) {
    const uw = Math.min(w - 200, 340); const ux = x + w / 2 - uw / 2;
    s += R(ux, y + 10, uw, 20, dark ? '#1a2a42' : '#fff', { r: 10, stroke: dark ? null : C.border });
    s += icon('lock', ux + 10, y + 14, dark ? C.mute : C.grey, 12) + T(ux + 28, y + 24.5, urlText, { s: 11, f: dark ? C.mute : C.grey });
  }
  return s;
}

/** dark sidebar navigation */
function sidebar(x, y, w, h, items, active = 0, { brand = 'VQ ERP', rb = 16, icons = [] } = {}) {
  let s = Pa(rrPath(x, y, w, h, [0, 0, 0, rb]), C.ink);
  s += R(x + 18, y + 20, 30, 30, url('brand'), { r: 9 }) + T(x + 33, y + 40, 'VQ', { s: 12, w: 800, f: '#fff', a: 'middle' });
  s += T(x + 58, y + 40, brand, { s: 14, w: 700, f: '#fff' });
  const defIcons = ['grid', 'cart', 'box', 'coin', 'users', 'chat', 'chart', 'gear', 'doc', 'truck'];
  items.forEach((it, i) => {
    const iy = y + 76 + i * 40;
    const on = i === active;
    if (on) s += R(x + 12, iy - 4, w - 24, 34, C.primary, { r: 9 });
    s += icon(icons[i] || defIcons[i % defIcons.length], x + 26, iy + 5, on ? '#fff' : '#8fa3b8', 16);
    s += T(x + 52, iy + 18, it, { s: 13, w: on ? 600 : 500, f: on ? '#fff' : '#b6c4d3' });
  });
  return s;
}

function card(x, y, w, h, { title, sub, sh = false, r = 14, fill = '#fff', stroke = C.border, action } = {}) {
  let s = R(x, y, w, h, fill, { r, stroke, sh });
  if (title) s += T(x + 18, y + 28, title, { s: 14, w: 700 });
  if (sub) s += T(x + 18 + tw(title, 14, 0.6) + 10, y + 28, sub, { s: 11, f: C.grey });
  if (action) s += T(x + w - 18, y + 28, action, { s: 11, w: 600, f: C.primary, a: 'end' });
  return s;
}

function kpi(x, y, w, h, { label, value, delta, up = true, color = C.primary, ic = 'chart' }) {
  let s = R(x, y, w, h, '#fff', { r: 12, stroke: C.border });
  s += iconTile(ic, x + 14, y + 14, color, 30);
  if (delta) {
    const dc = up ? C.green : C.coral;
    s += pill(x + w - 12, y + 18, delta, dc, { s: 10, a: 'end' });
  }
  s += T(x + 14, y + h - 40, label, { s: 11, f: C.grey, w: 500 });
  s += T(x + 14, y + h - 16, value, { s: 20, w: 700 });
  return s;
}

function lineChart(x, y, w, h, series, { labels, max, min = 0, grid = 4, colors = [C.cyan, C.violet, C.amber], area = true, dots = true, sw = 3, dash2 = true, yLabels } = {}) {
  let s = '';
  const mx = max ?? Math.max(...series.flat()) * 1.12;
  for (let i = 0; grid && i <= grid; i++) {
    const yy = y + (h * i) / grid;
    s += L(x, yy, x + w, yy, C.line, 1, { dash: i === grid ? undefined : '4 5', cap: 'butt' });
    if (yLabels) s += T(x - 8, yy + 4, yLabels[i] ?? '', { s: 10, f: C.mute, a: 'end' });
  }
  series.forEach((ser, si) => {
    const pts = ser.map((v, i) => [x + (w * i) / (ser.length - 1), y + h - ((v - min) / (mx - min)) * h]);
    const d = smooth(pts);
    if (area && si === 0) s += Pa(`${d}L${r1(x + w)},${r1(y + h)}L${r1(x)},${r1(y + h)}Z`, typeof area === 'string' ? area : url('area'));
    s += Pa(d, null, { stroke: colors[si], sw: si === 0 ? sw : sw - 1, dash: si > 0 && dash2 ? '6 6' : undefined });
    if (dots && si === 0) {
      const lp = pts[pts.length - 1];
      const mp = pts[Math.floor(pts.length * 0.62)];
      s += L(mp[0], y, mp[0], y + h, colors[0], 1, { dash: '3 4', op: 0.5 });
      s += Ci(mp[0], mp[1], 6, '#fff', { stroke: colors[0], sw: 3 });
      s += Ci(lp[0], lp[1], 4.5, colors[0]);
    }
  });
  if (labels) labels.forEach((lb, i) => { s += T(x + (w * i) / (labels.length - 1), y + h + 18, lb, { s: 10, f: C.mute, a: 'middle' }); });
  return s;
}

function barChart(x, y, w, h, vals, { colors = [C.primary], labels, max, gap = 0.42, r = 4, highlight = -1, grid = 0, base = true } = {}) {
  // vals: number[] or number[][] (grouped)
  let s = '';
  const grouped = Array.isArray(vals[0]);
  const flat = grouped ? vals.flat() : vals;
  const mx = max ?? Math.max(...flat) * 1.1;
  for (let i = 0; i < grid; i++) { const yy = y + (h * i) / grid; s += L(x, yy, x + w, yy, C.line, 1, { dash: '4 5', cap: 'butt' }); }
  const n = vals.length; const slot = w / n; const bw = slot * (1 - gap);
  vals.forEach((v, i) => {
    const arr = grouped ? v : [v];
    const sub = bw / arr.length;
    arr.forEach((vv, j) => {
      const bh = (vv / mx) * h;
      let col = colors[grouped ? j : (highlight >= 0 ? (i === highlight ? 0 : 1) : i % colors.length)] ?? colors[0];
      if (!grouped && highlight >= 0) col = i === highlight ? colors[0] : (colors[1] ?? tint(colors[0], 0.6));
      s += Pa(rrPath(x + i * slot + (slot - bw) / 2 + j * sub + (grouped ? 1 : 0), y + h - bh, sub - (grouped ? 2 : 0), bh, [Math.min(r, bh / 2), Math.min(r, bh / 2), 0, 0]), col);
    });
    if (labels) s += T(x + i * slot + slot / 2, y + h + 17, labels[i], { s: 10, f: C.mute, a: 'middle' });
  });
  if (base) s += L(x, y + h, x + w, y + h, C.border, 1, { cap: 'butt' });
  return s;
}

/** donut chart; segs: [{v,color}] */
function donut(cx, cy, r, sw, segs, { gap = 1.2, track = C.line } = {}) {
  const tot = segs.reduce((a, b) => a + b.v, 0);
  let s = Ci(cx, cy, r, null, { stroke: track, sw });
  let acc = 0;
  for (const sg of segs) {
    const len = (sg.v / tot) * 100;
    s += Ci(cx, cy, r, null, { stroke: sg.color, sw, pl: 100, dash: `${r1(Math.max(0, len - gap))} ${r1(100 - len + gap)}`, off: r1(-acc), t: `rotate(-90 ${r1(cx)} ${r1(cy)})` });
    acc += len;
  }
  return s;
}
function ring(cx, cy, r, sw, pct, color, { track = C.line, label, sub, s = 20 } = {}) {
  let o = Ci(cx, cy, r, null, { stroke: track, sw });
  o += Ci(cx, cy, r, null, { stroke: color, sw, pl: 100, dash: `${pct} ${100 - pct}`, cap: 'round', t: `rotate(-90 ${r1(cx)} ${r1(cy)})` });
  if (label) o += T(cx, cy + (sub ? 2 : s * 0.36), label, { s, w: 700, a: 'middle' });
  if (sub) o += T(cx, cy + s * 0.36 + 12, sub, { s: 10, f: C.grey, a: 'middle' });
  return o;
}
/** semicircle gauge */
function gauge(cx, cy, r, sw, pct, color, { label, sub } = {}) {
  const d = `M${r1(cx - r)},${r1(cy)}A${r},${r} 0 0 1 ${r1(cx + r)},${r1(cy)}`;
  let o = Pa(d, null, { stroke: C.line, sw });
  o += Pa(d, null, { stroke: color, sw, pl: 100, dash: `${pct} 100` });
  const a = Math.PI * (1 - pct / 100);
  o += Ci(cx + r * Math.cos(a), cy - r * Math.sin(a), sw / 2 + 3, '#fff', { stroke: color, sw: 3 });
  if (label) o += T(cx, cy - 8, label, { s: 34, w: 800, a: 'middle' });
  if (sub) o += T(cx, cy + 14, sub, { s: 11, f: C.grey, a: 'middle' });
  return o;
}

function progress(x, y, w, pct, color = C.primary, { h = 6, track = C.line } = {}) {
  return R(x, y, w, h, track, { r: h / 2 }) + R(x, y, (w * pct) / 100, h, color, { r: h / 2 });
}

function sparkline(x, y, w, h, vals, color) {
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const pts = vals.map((v, i) => [x + (w * i) / (vals.length - 1), y + h - ((v - mn) / (mx - mn || 1)) * h]);
  return Pa(smooth(pts), null, { stroke: color, sw: 2 });
}

/** avatar bust inside circle */
function avatar(cx, cy, r, skin = SKIN[0], hair = HAIR[0], shirt = C.primary, { bg, style = 'short', noClip = false } = {}) {
  const [cp, cid] = clipRect(cx - r, cy - r, r * 2, r * 2, r);
  const k = r / 20;
  let inner = Ci(cx, cy, r, bg ?? tint(shirt, 0.82));
  if (style === 'long') inner += Pa(`M${r1(cx - 9.5 * k)},${r1(cy - 4 * k)}Q${r1(cx - 11 * k)},${r1(cy + 10 * k)} ${r1(cx - 8 * k)},${r1(cy + 12 * k)}L${r1(cx + 8 * k)},${r1(cy + 12 * k)}Q${r1(cx + 11 * k)},${r1(cy + 10 * k)} ${r1(cx + 9.5 * k)},${r1(cy - 4 * k)}Z`, hair);
  inner += El(cx, cy + 22 * k, 15 * k, 11 * k, shirt);
  inner += R(cx - 3 * k, cy + 2 * k, 6 * k, 8 * k, skin);
  inner += Ci(cx, cy - 3 * k, 8 * k, skin);
  if (style !== 'bald') inner += Pa(`M${r1(cx - 8.4 * k)},${r1(cy - 3 * k)}Q${r1(cx - 8.6 * k)},${r1(cy - 13 * k)} ${r1(cx)},${r1(cy - 12.6 * k)}Q${r1(cx + 8.6 * k)},${r1(cy - 13 * k)} ${r1(cx + 8.4 * k)},${r1(cy - 3 * k)}Q${r1(cx + 4 * k)},${r1(cy - 9 * k)} ${r1(cx - 8.4 * k)},${r1(cy - 3 * k)}Z`, hair);
  if (style === 'bun') inner += Ci(cx, cy - 13 * k, 3.6 * k, hair);
  if (noClip) return inner;
  return cp + G(inner, { clip: cid });
}

/** data table. cols: [{label,w(px),align}] ; cells string|{pill,color}|{dot,text}|{bar,color}|{av,text}|{text,color,w} */
function table(x, y, w, cols, rows, { rowH = 34, headH = 30, s = 12, head = true, zebra = false } = {}) {
  let o = '';
  let cy = y;
  if (head) {
    o += R(x, y, w, headH, C.soft, { r: 8 });
    let cx = x + 12;
    for (const c of cols) { o += T(c.align === 'end' ? cx + c.w - 12 : cx, y + headH / 2 + 4, c.label, { s: 10.5, w: 600, f: C.grey, a: c.align === 'end' ? 'end' : undefined, ls: 0.2 }); cx += c.w; }
    cy += headH;
  }
  rows.forEach((row, ri) => {
    if (zebra && ri % 2) o += R(x, cy, w, rowH, C.soft);
    let cx = x + 12;
    row.forEach((cell, ci) => {
      const c = cols[ci]; const ty = cy + rowH / 2 + s * 0.36;
      const endX = cx + c.w - 12;
      if (cell && typeof cell === 'object') {
        if (cell.pill) o += c.align === 'end' ? pill(endX, cy + rowH / 2 - 9, cell.pill, cell.color, { s: 10, h: 18, a: 'end' }) : pill(cx, cy + rowH / 2 - 9, cell.pill, cell.color, { s: 10, h: 18 });
        else if (cell.bar !== undefined) o += progress(cx, cy + rowH / 2 - 3, c.w - 24, cell.bar, cell.color ?? C.primary);
        else if (cell.av) o += avatar(cx + 11, cy + rowH / 2, 11, cell.av[0], cell.av[1], cell.av[2]) + T(cx + 28, ty, cell.text, { s, w: 500 });
        else if (cell.dot) o += Ci(cx + 4, cy + rowH / 2, 4, cell.dot) + T(cx + 14, ty, cell.text, { s, f: C.slate });
        else if (cell.arrow) {
          const upA = cell.arrow === 'up'; const col = upA ? C.green : C.coral;
          o += icon(upA ? 'arrowUp' : 'arrowDown', (c.align === 'end' ? endX - tw(cell.text, s) - 14 : cx), cy + rowH / 2 - 6, col, 12, 2.2)
            + T(c.align === 'end' ? endX : cx + 16, ty, cell.text, { s, w: 600, f: col, a: c.align === 'end' ? 'end' : undefined });
        } else o += T(c.align === 'end' ? endX : cx, ty, cell.text, { s, w: cell.w ?? 400, f: cell.color ?? C.slate, a: c.align === 'end' ? 'end' : undefined });
      } else {
        o += T(c.align === 'end' ? endX : cx, ty, cell, { s, w: ci === 0 ? 600 : 400, f: ci === 0 ? C.ink : C.slate, a: c.align === 'end' ? 'end' : undefined });
      }
      cx += c.w;
    });
    cy += rowH;
    if (ri < rows.length - 1) o += L(x + 8, cy, x + w - 8, cy, C.line, 1, { cap: 'butt' });
  });
  return o;
}

function chatBubble(x, y, w, lines, { me = false, s = 12, time } = {}) {
  const h = lines.length * (s + 6) + 16;
  const fill = me ? C.primary : '#fff';
  let o = Pa(rrPath(x, y, w, h, me ? [14, 14, 4, 14] : [14, 14, 14, 4]), fill, { stroke: me ? undefined : C.border, sw: me ? undefined : 1 });
  lines.forEach((ln, i) => { o += T(x + 12, y + 8 + (i + 1) * (s + 6) - 4, ln, { s, f: me ? '#fff' : C.slate }); });
  if (time) o += T(me ? x + w : x, y + h + 14, time, { s: 9.5, f: C.mute, a: me ? 'end' : undefined });
  return { svg: o, h };
}

/** phone frame. returns {svg, sx, sy, sw, sh} screen box; content should be drawn inside */
function phone(x, y, w, h, { sh = true, color = C.ink } = {}) {
  let s = R(x, y, w, h, color, { r: w * 0.16, sh });
  s += R(x + 2, y + 2, w - 4, h - 4, null, { r: w * 0.155, stroke: '#2a3a52', sw: 1.5 });
  const b = Math.max(8, w * 0.04);
  s += R(x + b, y + b, w - b * 2, h - b * 2, '#fff', { r: w * 0.12 });
  return { svg: s, sx: x + b, sy: y + b, sw: w - b * 2, sh: h - b * 2, notch: R(x + w / 2 - w * 0.14, y + b + 8, w * 0.28, 16, color, { r: 8 }) };
}
function tabletFrame(x, y, w, h, { sh = true, color = C.ink, bezel = 16 } = {}) {
  let s = R(x, y, w, h, color, { r: 26, sh });
  s += R(x + bezel, y + bezel, w - bezel * 2, h - bezel * 2, '#fff', { r: 12 });
  s += Ci(x + w / 2, y + bezel / 2, 2.5, '#2a3a52');
  return { svg: s, sx: x + bezel, sy: y + bezel, sw: w - bezel * 2, sh: h - bezel * 2 };
}
/** monitor on stand: returns screen box */
function monitor(x, y, w, h, { stand = 60, sh = false } = {}) {
  let s = R(x + w / 2 - 10, y + h - 4, 20, stand, '#9fb3c2') + R(x + w / 2 - 46, y + h + stand - 8, 92, 9, '#8da2b3', { r: 4.5 });
  s += R(x, y, w, h, C.ink, { r: 10, sh });
  s += R(x + 7, y + 7, w - 14, h - 14, '#fff', { r: 5 });
  return { svg: s, sx: x + 7, sy: y + 7, sw: w - 14, sh: h - 14 };
}
function laptop(x, y, w, h, { sh = false, back = false } = {}) {
  // x,y = top-left of lid; base below
  let s = '';
  if (back) {
    s += R(x, y, w, h, '#cdd9e2', { r: 10, sh }) + R(x, y, w, h, null, { r: 10, stroke: '#b9c8d3', sw: 1.5 });
    s += Ci(x + w / 2, y + h / 2, Math.min(w, h) * 0.09, '#fff', { op: 0.8 });
    s += Pa(`M${x - w * 0.08},${y + h}H${x + w * 1.08}l-8,9H${x - w * 0.08 + 8}Z`, '#b9c8d3');
    return { svg: s };
  }
  s += R(x, y, w, h, C.ink, { r: 10, sh });
  s += R(x + 8, y + 8, w - 16, h - 14, '#fff', { r: 4 });
  s += Pa(`M${r1(x - w * 0.09)},${r1(y + h)}H${r1(x + w * 1.09)}l-10,12H${r1(x - w * 0.09 + 10)}Z`, '#c5d3dd');
  s += R(x + w / 2 - w * 0.09, y + h, w * 0.18, 4, '#aebfcc', { r: 2 });
  return { svg: s, sx: x + 8, sy: y + 8, sw: w - 16, sh: h - 14 };
}

/** mini dashboard content for small screens (monitors in scenes) */
function miniDash(sx, sy, sw, sh, { variant = 0 } = {}) {
  let s = R(sx, sy, sw * 0.18, sh, C.ink);
  for (let i = 0; i < 5; i++) s += R(sx + sw * 0.04, sy + 14 + i * (sh * 0.13), sw * 0.1, 4, i === 0 ? C.cyan : '#4a5d77', { r: 2 });
  const cx = sx + sw * 0.22, cw = sw * 0.74;
  const kw = (cw - 12) / 3;
  for (let i = 0; i < 3; i++) {
    s += R(cx + i * (kw + 6), sy + 8, kw, sh * 0.2, C.soft, { r: 4, stroke: C.line });
    s += R(cx + i * (kw + 6) + 6, sy + 14, kw * 0.4, 4, C.border, { r: 2 });
    s += R(cx + i * (kw + 6) + 6, sy + 22, kw * 0.6, 6, [C.primary, C.green, C.amber][i], { r: 3 });
  }
  const chY = sy + sh * 0.2 + 16, chH = sh - (sh * 0.2 + 24);
  if (variant === 0) {
    s += R(cx, chY, cw * 0.62, chH, '#fff', { r: 4, stroke: C.line });
    s += lineChart(cx + 8, chY + 10, cw * 0.62 - 16, chH - 18, [[4, 6, 5, 8, 7, 10, 12]], { grid: 2, dots: false, sw: 2 });
    s += R(cx + cw * 0.62 + 6, chY, cw * 0.38 - 6, chH, '#fff', { r: 4, stroke: C.line });
    s += donut(cx + cw * 0.81 + 3, chY + chH / 2, Math.min(chH, cw * 0.3) * 0.3, 6, [{ v: 5, color: C.primary }, { v: 3, color: C.cyan }, { v: 2, color: C.amber }]);
  } else {
    s += R(cx, chY, cw, chH, '#fff', { r: 4, stroke: C.line });
    s += barChart(cx + 10, chY + 10, cw - 20, chH - 18, [5, 8, 6, 9, 7, 11, 10, 12], { colors: [C.primary, C.cyan], gap: 0.35, r: 2, base: false });
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */
/**
 * Standing person, front view. Origin (x,y) = point between feet on the floor.
 * Local figure is ~300 units tall at s=1.
 */
function person(x, y, o = {}) {
  const {
    s = 1, skin = SKIN[0], hair = HAIR[0], hairStyle = 'short', shirt = C.primary, pants = C.ink,
    shoes = '#1d2939', pose = 'down', vest = false, hat = false, flip = false, skirt = false,
    jacket = null, prop = null, propColor = C.ink,
  } = o;
  let b = '';
  // long hair behind
  if (hairStyle === 'long') b += Pa('M-24,-270Q-30,-236 -23,-214L23,-214Q30,-236 24,-270Z', hair);
  // legs
  if (skirt) {
    b += R(-17, -120, 13, 112, skin, { r: 6 }) + R(4, -120, 13, 112, skin, { r: 6 });
    b += Pa('M-28,-140L28,-140L38,-82Q0,-74 -38,-82Z', pants);
  } else {
    b += R(-24, -134, 21, 126, pants, { r: 8 }) + R(3, -134, 21, 126, pants, { r: 8 });
    b += L(-13.5, -120, -13.5, -12, shade(pants, 0.18), 1.2, { op: 0.6 }) ;
  }
  b += Pa('M-27,-12Q-27,-20 -18,-20H-4V0H-25Q-28,0 -27,-4Z', shoes) + Pa('M27,-12Q27,-20 18,-20H4V0H25Q28,0 27,-4Z', shoes);
  // neck
  b += R(-7.5, -250, 15, 20, shade(skin, 0.08), { r: 4 });
  // arms behind torso? (none) -> torso
  const torso = 'M-33,-224Q-34,-234 -22,-236L22,-236Q34,-234 33,-224L31,-128Q31,-122 25,-122L-25,-122Q-31,-122 -31,-128Z';
  b += Pa(torso, shirt);
  if (jacket) {
    b += Pa('M-33,-224Q-34,-234 -22,-236L-9,-236L-3,-122L-25,-122Q-31,-122 -31,-128Z', jacket);
    b += Pa('M33,-224Q34,-234 22,-236L9,-236L3,-122L25,-122Q31,-122 31,-128Z', jacket);
    b += Pa('M-9,-236L-3,-205L-14,-214Z', shade(jacket, 0.15)) + Pa('M9,-236L3,-205L14,-214Z', shade(jacket, 0.15));
  }
  // collar V
  b += Pa('M-9,-236L0,-224L9,-236Z', skin);
  if (vest) {
    const vc = typeof vest === 'string' ? vest : C.amber;
    b += Pa('M-33,-224Q-34,-234 -22,-236L-11,-236L-6,-122L-25,-122Q-31,-122 -31,-128Z', vc);
    b += Pa('M33,-224Q34,-234 22,-236L11,-236L6,-122L25,-122Q31,-122 31,-128Z', vc);
    b += R(-32, -166, 27, 6, '#fff', { op: 0.9 }) + R(5, -166, 27, 6, '#fff', { op: 0.9 });
    b += R(-32, -146, 27, 6, '#fff', { op: 0.9 }) + R(5, -146, 27, 6, '#fff', { op: 0.9 });
  }
  // belt line
  if (!skirt) b += R(-31, -130, 62, 5, shade(pants, 0.25), { op: 0.5 });
  // head
  b += Ci(0, -268, 22, skin);
  b += Ci(-21.5, -266, 4, shade(skin, 0.06)) + Ci(21.5, -266, 4, shade(skin, 0.06));
  // face
  b += Ci(-7.5, -267, 2, C.ink, { op: 0.75 }) + Ci(7.5, -267, 2, C.ink, { op: 0.75 });
  b += Pa('M-6,-257Q0,-252.5 6,-257', null, { stroke: shade(skin, 0.35), sw: 1.8 });
  // hair
  if (hat) {
    const hc = typeof hat === 'string' ? hat : C.amber;
    b += Pa('M-24,-274Q-24,-302 0,-302Q24,-302 24,-274Z', hc) + R(-30, -278, 60, 8, shade(hc, 0.08), { r: 4 });
    b += R(-3, -301, 6, 24, shade(hc, 0.12), { r: 3 });
  } else if (hairStyle !== 'bald') {
    b += Pa('M-23,-266Q-25,-294 0,-293Q25,-294 23,-266Q20,-280 6,-282Q-12,-284 -23,-266Z', hair);
    if (hairStyle === 'bun') b += Ci(0, -296, 9, hair);
    if (hairStyle === 'curly') { for (const [cx, cy] of [[-18, -284], [-8, -292], [5, -293], [16, -286], [21, -276], [-22, -274]]) b += Ci(cx, cy, 8, hair); }
    if (hairStyle === 'long') b += Pa('M-23,-266Q-26,-250 -24,-232L-18,-232Q-21,-252 -17,-270Z', hair) + Pa('M23,-266Q26,-250 24,-232L18,-232Q21,-252 17,-270Z', hair);
  }
  // arms
  const sl = { stroke: jacket || (vest ? shirt : shirt), sw: 15 };
  const hand = (hx, hy) => Ci(hx, hy, 7.5, skin);
  const armL = (d, hx, hy) => Pa(d, null, sl) + hand(hx, hy);
  let propSvg = '';
  if (pose === 'down') {
    b += armL('M-30,-224Q-42,-190 -40,-148', -40, -142) + armL('M30,-224Q42,-190 40,-148', 40, -142);
  } else if (pose === 'hold') {
    b += Pa('M-30,-224Q-44,-192 -36,-174L-16,-178', null, sl) + Pa('M30,-224Q44,-192 36,-174L16,-178', null, sl);
    if (prop === 'tablet') propSvg = G(R(-30, -206, 60, 42, propColor, { r: 5 }) + Ci(0, -185, 4, '#fff', { op: 0.35 }), { t: 'rotate(-6 0 -185)' });
    else if (prop === 'laptop') propSvg = R(-34, -196, 68, 40, '#cdd9e2', { r: 4 }) + Ci(0, -176, 4, '#fff');
    else if (prop === 'clipboard') propSvg = R(-22, -214, 44, 56, '#c79363', { r: 4 }) + R(-18, -208, 36, 48, '#fff', { r: 2 }) + R(-8, -217, 16, 7, C.slate, { r: 2 });
    else if (prop === 'box') propSvg = box(-30, -214, 60, 46, { flat: true });
    else if (prop === 'cup') propSvg = R(-6, -192, 14, 18, '#fff', { r: 3 }) + R(-6, -186, 14, 6, C.amber);
    b += propSvg + hand(-16, -180) + hand(16, -180);
    return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${flip ? -s : s},${s})` });
  } else if (pose === 'point') {
    b += armL('M-30,-224Q-42,-190 -40,-148', -40, -142);
    b += Pa('M30,-224Q52,-236 70,-262', null, sl) + hand(73, -268) + Pa('M73,-268L80,-280', null, { stroke: skin, sw: 5 });
  } else if (pose === 'wave') {
    b += armL('M-30,-224Q-42,-190 -40,-148', -40, -142);
    b += Pa('M30,-224Q50,-240 46,-276', null, sl) + hand(46, -282);
  } else if (pose === 'scanner') {
    b += armL('M-30,-224Q-42,-190 -40,-148', -40, -142);
    b += Pa('M30,-224Q44,-196 38,-176L56,-188', null, sl);
    b += G(R(48, -214, 18, 34, C.ink, { r: 4 }) + R(51, -210, 12, 12, C.cyan, { r: 2 }) + R(52, -182, 10, 18, '#2a3a52', { r: 3 }) + R(51, -218, 12, 6, C.amber, { r: 2 }), { t: 'rotate(18 57 -196)' });
    b += hand(56, -188);
  } else if (pose === 'bag') {
    b += armL('M-30,-224Q-42,-190 -40,-148', -40, -142);
    b += Pa('M30,-224Q42,-190 40,-148', null, sl);
    b += Pa('M32,-150Q40,-170 48,-150', null, { stroke: shade(propColor, 0.2), sw: 3 }) + R(26, -150, 44, 50, propColor, { r: 5 });
    b += hand(40, -144);
  } else if (pose === 'laptopArms') {
    b += Pa('M-30,-224Q-44,-192 -30,-172L-10,-170', null, sl) + Pa('M30,-224Q44,-192 30,-172L10,-170', null, sl) + hand(-10, -170) + hand(10, -170);
  }
  return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${flip ? -s : s},${s})` });
}

/** seated person seen from behind, on an office chair. Origin (x,y)=floor under chair. */
function personBack(x, y, o = {}) {
  const { s = 1, skin = SKIN[0], hair = HAIR[0], hairStyle = 'short', shirt = C.primary, chair = C.slate, armOut = 0 } = o;
  let b = '';
  // chair base
  b += R(-4, -96, 8, 70, '#8da2b3') + Pa('M-34,-18L0,-30L34,-18', null, { stroke: '#8da2b3', sw: 6 });
  b += Ci(-34, -10, 7, C.slate) + Ci(34, -10, 7, C.slate) + Ci(0, -14, 6, C.slate);
  // torso
  b += Pa('M-36,-178Q-38,-192 -24,-196L24,-196Q38,-192 36,-178L33,-110L-33,-110Z', shirt);
  // arms (elbows)
  b += Pa(`M-32,-186Q-50,-160 ${-40 - armOut},-128`, null, { stroke: shirt, sw: 15 }) + Pa(`M32,-186Q50,-160 ${40 + armOut},-128`, null, { stroke: shirt, sw: 15 });
  // chair back
  b += R(-42, -158, 84, 70, chair, { r: 16 }) + R(-34, -150, 68, 54, shade(chair, 0.12), { r: 12, op: 0.5 });
  // neck + head
  b += R(-7, -210, 14, 18, shade(skin, 0.12), { r: 4 });
  b += Ci(0, -228, 22, skin) + Ci(-21.5, -226, 4, shade(skin, 0.06)) + Ci(21.5, -226, 4, shade(skin, 0.06));
  if (hairStyle === 'long') b += Pa('M-23,-232Q-25,-254 0,-254Q25,-254 23,-232L26,-190Q0,-184 -26,-190Z', hair);
  else if (hairStyle === 'bun') b += Pa('M-23,-226Q-24,-254 0,-254Q24,-254 23,-226Q12,-214 0,-214Q-12,-214 -23,-226Z', hair) + Ci(0, -254, 9, hair);
  else if (hairStyle === 'curly') { b += Pa('M-23,-226Q-24,-254 0,-254Q24,-254 23,-226Q12,-214 0,-214Q-12,-214 -23,-226Z', hair); for (const [cx, cy] of [[-16, -246], [0, -252], [16, -246], [-20, -232], [20, -232]]) b += Ci(cx, cy, 8, hair); }
  else b += Pa('M-23,-226Q-24,-254 0,-254Q24,-254 23,-226Q12,-216 0,-216Q-12,-216 -23,-226Z', hair);
  return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${s})` });
}

/* ------------------------------------------------------------------ */
/* Scene props                                                         */
/* ------------------------------------------------------------------ */
const WOOD = '#c99a6b', CARD = '#e3b27a', CARD_D = '#c99258', CARD_L = '#f0cc9c';

function sceneBase(floorY, { wall = url('bg'), floor = url('floor'), skirting = true } = {}) {
  let s = R(0, 0, 1200, 800, wall);
  s += R(0, floorY, 1200, 800 - floorY, floor);
  if (skirting) s += R(0, floorY - 6, 1200, 6, '#d3e1ea');
  return s;
}

function box(x, y, w, h, { flat = false, label = true, lite = false } = {}) {
  if (lite) return R(x, y, w, h, CARD, { r: 3 }) + R(x + w / 2 - w * 0.09, y, w * 0.18, h * 0.4, CARD_L) + R(x, y, w, h * 0.14, CARD_D, { r: 3, op: 0.5 });
  let s = R(x, y, w, h, CARD, { r: 3 });
  s += R(x, y, w, h * 0.16, CARD_D, { r: 3, op: 0.55 });
  s += R(x + w / 2 - w * 0.09, y, w * 0.18, h * 0.42, CARD_L, { op: 0.9 });
  if (label && w > 30) s += R(x + w * 0.12, y + h * 0.58, w * 0.3, h * 0.22, '#fff', { r: 2, op: 0.95 }) + R(x + w * 0.15, y + h * 0.63, w * 0.2, 2, C.slate, { op: 0.6 }) + R(x + w * 0.15, y + h * 0.7, w * 0.14, 2, C.slate, { op: 0.4 });
  if (!flat) s += R(x + w - 4, y, 4, h, CARD_D, { op: 0.35 });
  return s;
}
function pallet(x, y, w) {
  return R(x, y, w, 6, WOOD, { r: 1 }) + R(x + 4, y + 6, w * 0.12, 8, shade(WOOD, 0.15)) + R(x + w / 2 - w * 0.06, y + 6, w * 0.12, 8, shade(WOOD, 0.15)) + R(x + w - 4 - w * 0.12, y + 6, w * 0.12, 8, shade(WOOD, 0.15)) + R(x, y + 14, w, 4, WOOD, { r: 1 });
}
/** stack of boxes on a pallet; origin = pallet bottom-left */
function palletLoad(x, y, w, rows = 2, cols = 2) {
  let s = pallet(x, y - 18, w);
  const bw = w / cols, bh = bw * 0.72;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += box(x + c * bw + 1, y - 18 - (r + 1) * bh, bw - 2, bh - 1);
  return s;
}

function plant(x, y, s = 1, { pot = '#ffffff' } = {}) {
  let b = '';
  const leaves = [[-26, -96, -32], [24, -100, 30], [-8, -128, -8], [12, -118, 14], [-34, -70, -55], [34, -74, 55], [0, -146, 0]];
  const greens = ['#1f9d55', '#16a34a', '#2bb673', '#13803d'];
  leaves.forEach(([lx, ly, rot], i) => { b += El(lx, ly, 13, 34, greens[i % 4], { t: `rotate(${rot} ${lx} ${ly})` }); });
  b += Pa('M0,-40Q-2,-90 -8,-128M0,-40Q6,-80 24,-100M0,-40Q-12,-70 -30,-80', null, { stroke: '#13803d', sw: 2.5 });
  b += Pa('M-30,-52H30L24,0H-24Z', pot) + Pa('M-30,-52H30L29,-44H-29Z', C.border);
  return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${s})` });
}
function pendantLamp(x, len, { color = C.ink } = {}) {
  return L(x, 0, x, len, '#9fb3c2', 2) + Pa(`M${x - 26},${len + 26}Q${x - 26},${len} ${x},${len}Q${x + 26},${len} ${x + 26},${len + 26}Z`, color) + El(x, len + 27, 14, 4, '#fde7b0');
}
function officeWindow(x, y, w, h, { panes = 3 } = {}) {
  let s = R(x, y, w, h, url('sky'), { r: 6 });
  // skyline
  const bld = [[0.05, 0.55, 0.12], [0.18, 0.4, 0.1], [0.3, 0.62, 0.14], [0.47, 0.35, 0.09], [0.58, 0.5, 0.13], [0.73, 0.3, 0.1], [0.85, 0.58, 0.12]];
  for (const [bx, bh, bw] of bld) s += R(x + bx * w, y + h - bh * h, bw * w, bh * h, tint(C.primary, 0.78));
  for (const [bx, bh, bw] of bld.slice(0, 5)) s += R(x + bx * w + bw * w * 0.4, y + h - bh * h * 0.6, bw * w * 0.8, bh * h * 0.6, tint(C.primary, 0.66));
  s += Ci(x + w * 0.8, y + h * 0.22, h * 0.07, '#fff', { op: 0.9 });
  s += R(x, y, w, h, null, { r: 6, stroke: '#fff', sw: 10 });
  for (let i = 1; i < panes; i++) s += R(x + (w * i) / panes - 3, y, 6, h, '#fff');
  s += R(x - 8, y + h, w + 16, 10, '#fff', { r: 3 }) + R(x - 8, y + h + 10, w + 16, 3, C.border);
  return s;
}

function forklift(x, y, { s = 1, flip = false, color = C.amber, load = true } = {}) {
  // origin = ground under rear wheel area; faces right
  let b = '';
  // mast
  b += R(118, -190, 9, 180, C.slate) + R(130, -190, 9, 180, '#475467');
  b += R(138, -24, 74, 7, C.slate) + R(138, -60, 8, 40, C.slate);
  if (load) b += palletLoad(146, -24, 64, 2, 2);
  // body
  b += Pa('M10,-40V-96Q10,-108 22,-108H60L78,-150H112V-40Z', color);
  b += Pa('M10,-58H112V-40H10Z', shade(color, 0.15));
  // counterweight
  b += Pa('M-6,-40V-92Q-6,-104 6,-104H18V-40Z', C.slate);
  // cabin frame
  b += Pa('M44,-108L60,-196H110', null, { stroke: C.ink, sw: 6, join: 'round' }) + L(110, -196, 112, -108, C.ink, 6);
  b += R(52, -200, 64, 8, C.ink, { r: 3 });
  // seat + steering
  b += R(36, -134, 24, 26, C.ink, { r: 5 }) + L(84, -112, 96, -138, C.ink, 4);
  // wheels
  b += Ci(32, -24, 24, C.ink) + Ci(32, -24, 10, '#98a2b3') + Ci(100, -26, 26, C.ink) + Ci(100, -26, 11, '#98a2b3');
  b += R(64, -86, 30, 10, '#fff', { r: 3, op: 0.6 });
  return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${flip ? -s : s},${s})` });
}

/** side-view truck; origin = ground at rear; facing right. kind: box | tanker | van */
function truck(x, y, { s = 1, flip = false, kind = 'box', body = '#ffffff', cab = C.primary, label = '' } = {}) {
  let b = '';
  if (kind === 'van') {
    b += Pa('M0,-40V-150Q0,-160 10,-160H190Q214,-160 226,-138L250,-92Q262,-88 262,-74V-40Z', body);
    b += Pa('M196,-150H214Q220,-150 224,-142L242,-100H196Z', '#bfe6f6');
    b += R(0, -86, 262, 16, cab) + R(0, -70, 262, 8, C.amber);
    b += R(130, -150, 4, 108, C.border);
    b += R(-2, -48, 266, 10, C.slate, { r: 4 });
    if (label) b += T(68, -110, label, { s: 18, w: 800, f: C.ink, a: 'middle' });
    b += Ci(54, -38, 24, C.ink) + Ci(54, -38, 10, '#cfd8e0') + Ci(206, -38, 24, C.ink) + Ci(206, -38, 10, '#cfd8e0');
    return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${flip ? -s : s},${s})` });
  }
  // chassis
  b += R(-6, -58, 380, 14, C.slate, { r: 4 });
  if (kind === 'tanker') {
    b += R(0, -160, 270, 100, body, { r: 50 });
    b += R(0, -160, 270, 100, null, { r: 50, stroke: C.border, sw: 2 });
    b += R(10, -118, 250, 14, C.primary);
    b += R(60, -172, 26, 14, C.slate, { r: 3 }) + R(170, -172, 26, 14, C.slate, { r: 3 });
    b += Pa('M20,-160V-176H250V-160', null, { stroke: '#98a2b3', sw: 3 });
    if (label) b += T(135, -128, label, { s: 15, w: 800, f: C.deep, a: 'middle' });
    b += Pa('M120,-60V-44', null, { stroke: C.slate, sw: 6 });
  } else {
    b += R(0, -200, 270, 142, body, { r: 6 });
    b += R(0, -200, 270, 142, null, { r: 6, stroke: C.border, sw: 2 });
    b += R(0, -94, 270, 10, C.cyan);
    if (label) b += T(135, -138, label, { s: 22, w: 800, f: C.ink, a: 'middle' });
  }
  // cab
  b += Pa('M282,-58V-170Q282,-180 292,-180H332Q346,-180 352,-166L374,-110V-58Z', cab);
  b += Pa('M300,-166H330Q336,-166 339,-160L356,-122H300Z', '#bfe6f6');
  b += R(282, -92, 92, 8, shade(cab, 0.2)) + R(368, -82, 10, 18, C.amber, { r: 3 });
  // wheels
  for (const wx of [60, 112, 330]) b += Ci(wx, -40, 24, C.ink) + Ci(wx, -40, 10, '#cfd8e0');
  return G(b, { t: `translate(${r1(x)},${r1(y)}) scale(${flip ? -s : s},${s})` });
}

/** pallet rack bay. levels from bottom; origin top-left */
function rackBay(x, y, w, h, levels = 4, { fill = true, seed = 1, uprights = C.deep, beams = C.amber } = {}) {
  let s = '';
  const lh = h / levels;
  let k = seed;
  const rnd = () => { k = (k * 9301 + 49297) % 233280; return k / 233280; };
  for (let l = 0; l < levels; l++) {
    const by = y + h - l * lh - 10; // beam y
    if (fill) {
      const n = 2 + Math.floor(rnd() * 2);
      const slot = (w - 20) / n;
      for (let i = 0; i < n; i++) {
        if (rnd() < 0.12 && l > 0) continue;
        const bh = lh * (0.5 + rnd() * 0.32);
        s += R(x + 12 + i * slot, by - 18, slot - 8, 18, shade(WOOD, 0.1), { r: 2 }) + R(x + 12 + i * slot, by - 18, slot - 8, 5, WOOD);
        const stack = rnd() < 0.5;
        if (stack) { s += box(x + 12 + i * slot, by - 18 - bh / 2, (slot - 8) / 2 - 1, bh / 2, { lite: true }) + box(x + 12 + i * slot + (slot - 8) / 2 + 1, by - 18 - bh / 2, (slot - 8) / 2 - 1, bh / 2, { lite: true }) + box(x + 12 + i * slot + 4, by - 18 - bh, slot - 16, bh / 2 - 1, { lite: true }); } else s += box(x + 12 + i * slot, by - 18 - bh, slot - 8, bh, { lite: l >= 2 });
      }
    }
    s += R(x, by, w, 10, beams, { r: 2 }) + R(x, by + 7, w, 3, shade(beams, 0.2));
  }
  s += R(x - 6, y - 10, 10, h + 10, uprights, { r: 2 }) + R(x + w - 4, y - 10, 10, h + 10, uprights, { r: 2 });
  s += L(x - 1, y, x - 1, y + h, tint(uprights, 0.4), 4, { dash: '6 16', cap: 'butt' }) + L(x + w + 1, y, x + w + 1, y + h, tint(uprights, 0.4), 4, { dash: '6 16', cap: 'butt' });
  return s;
}

function serverRack(x, y, w, h, { seed = 3 } = {}) {
  let s = R(x, y, w, h, '#14233a', { r: 8 }) + R(x + 8, y + 10, w - 16, h - 20, '#0b172a', { r: 4 });
  let k = seed; const rnd = () => { k = (k * 9301 + 49297) % 233280; return k / 233280; };
  const units = Math.floor((h - 30) / 22);
  for (let i = 0; i < units; i++) {
    const uy = y + 16 + i * 22;
    s += R(x + 12, uy, w - 24, 17, '#1c2d47', { r: 3 });
    s += L(x + 18, uy + 8.5, x + 52, uy + 8.5, '#2e4466', 7, { dash: '3 3', cap: 'butt' });
    const c = rnd() < 0.7 ? C.green : rnd() < 0.5 ? C.cyan : C.amber;
    s += Ci(x + w - 22, uy + 8.5, 2.6, c) + Ci(x + w - 32, uy + 8.5, 2.6, rnd() < 0.6 ? C.cyan : '#2e4466');
  }
  s += R(x + 4, y + h, 10, 8, C.slate) + R(x + w - 14, y + h, 10, 8, C.slate);
  return s;
}
function dbCylinder(cx, y, w, h, { color = C.primary, light = C.cyan } = {}) {
  const ry = w * 0.18; const x = cx - w / 2;
  let s = Pa(`M${x},${y}V${y + h}A${w / 2},${ry} 0 0 0 ${x + w},${y + h}V${y}Z`, color);
  for (let i = 1; i < 3; i++) s += Pa(`M${x},${y + (h * i) / 3}A${w / 2},${ry} 0 0 0 ${x + w},${y + (h * i) / 3}`, null, { stroke: light, sw: 2.5, op: 0.6 });
  s += El(cx, y, w / 2, ry, light);
  s += El(cx, y, w / 2 - 8, ry - 3, tint(light, 0.3), { op: 0.6 });
  return s;
}
function cloud(cx, cy, sc = 1, fill = '#fff', o = {}) {
  return Pa('M-80,30H80A40,40 0 0 0 76,-48A56,56 0 0 0 -26,-60A44,44 0 0 0 -84,-16A30,30 0 0 0 -80,30Z', fill, { t: `translate(${cx},${cy}) scale(${sc})`, sh: o.sh, stroke: o.stroke, sw: o.sw });
}
function shieldIcon(cx, cy, sc = 1) {
  return G(Pa('M0,-60L50,-42V2C50,34 28,56 0,66C-28,56 -50,34 -50,2V-42Z', url('brand')) + Pa('M0,-60L50,-42V2C50,34 28,56 0,66Z', '#fff', { op: 0.12 }) + Pa('M-20,2L-5,17L23,-12', null, { stroke: '#fff', sw: 9 }), { t: `translate(${cx},${cy}) scale(${sc})`, sh: true });
}
function mapPin(x, y, color = C.coral, sc = 1) {
  return G(Pa('M0,0C-6,-14 -22,-26 -22,-42A22,22 0 0 1 22,-42C22,-26 6,-14 0,0Z', color) + Ci(0, -42, 8, '#fff'), { t: `translate(${x},${y}) scale(${sc})` });
}
/** route map panel inside box */
function routeMap(x, y, w, h, { route = true, pins = true, clipR = 10 } = {}) {
  const [cp, cid] = clipRect(x, y, w, h, clipR);
  let m = R(x, y, w, h, '#eef6ee');
  // blocks
  m += R(x, y, w, h, '#eaf3f8');
  m += El(x + w * 0.78, y + h * 0.25, w * 0.22, h * 0.2, '#d8f0de') + El(x + w * 0.15, y + h * 0.82, w * 0.2, h * 0.16, '#d8f0de');
  m += Pa(`M${x},${y + h * 0.62}Q${x + w * 0.35},${y + h * 0.5} ${x + w * 0.55},${y + h * 0.72}T${x + w},${y + h * 0.7}`, null, { stroke: '#bfe6f6', sw: 14 });
  const roads = [[0, 0.3, 1, 0.26], [0, 0.85, 1, 0.9], [0.22, 0, 0.26, 1], [0.6, 0, 0.56, 1], [0.86, 0, 0.9, 1]];
  for (const [a, b2, c, d] of roads) m += L(x + a * w, y + b2 * h, x + c * w, y + d * h, '#fff', 9, { cap: 'butt' });
  for (const [a, b2, c, d] of roads) m += L(x + a * w, y + b2 * h, x + c * w, y + d * h, C.border, 1, { cap: 'butt', dash: '6 6' });
  if (route) {
    const d = `M${x + w * 0.12},${y + h * 0.78}C${x + w * 0.3},${y + h * 0.7} ${x + w * 0.24},${y + h * 0.35} ${x + w * 0.45},${y + h * 0.32}S${x + w * 0.62},${y + h * 0.55} ${x + w * 0.82},${y + h * 0.24}`;
    m += Pa(d, null, { stroke: '#fff', sw: 9 }) + Pa(d, null, { stroke: C.primary, sw: 5 });
    m += Ci(x + w * 0.12, y + h * 0.78, 8, '#fff', { stroke: C.primary, sw: 4 });
  }
  let o = cp + G(m, { clip: cid });
  if (pins) o += mapPin(x + w * 0.82, y + h * 0.24, C.coral, 0.75);
  return o;
}

/** overlay info card (scenes): white, shadowed */
function overlayCard(x, y, w, h, title, { ic = 'chart', color = C.primary, sub } = {}) {
  let s = R(x, y, w, h, '#fff', { r: 16, sh: true });
  s += iconTile(ic, x + 16, y + 16, color, 32);
  s += T(x + 58, y + (sub ? 30 : 37), title, { s: 14, w: 700 });
  if (sub) s += T(x + 58, y + 46, sub, { s: 11, f: C.grey });
  return s;
}
const legendDot = (x, y, color, label) => Ci(x + 4, y - 4, 4, color) + T(x + 13, y, label, { s: 10.5, f: C.grey });

/* ------------------------------------------------------------------ */
/* 1. Hero platform                                                    */
/* ------------------------------------------------------------------ */
function heroPlatform() {
  let s = uiBackdrop({ dots: [[960, 620, 220, 160], [16, 16, 210, 110]] });
  s += Ci(520, 420, 340, tint(C.cyan, 0.8), { op: 0.3 });
  const wx = 40, wy = 90, ww = 860, wh = 610;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'erp.vqbyte.com/dashboard' });
  s += sidebar(wx, wy + 40, 170, wh - 40, ['Dashboard', 'Sales', 'Inventory', 'Finance', 'HR', 'CRM'], 0, { icons: ['grid', 'cart', 'box', 'coin', 'users', 'chat'] });
  const fy = wy + wh - 100;
  s += R(wx + 14, fy, 142, 80, '#14233a', { r: 12 }) + T(wx + 28, fy + 24, 'Sync status', { s: 11, f: '#8fa3b8' });
  s += Ci(wx + 32, fy + 42, 4, C.green) + T(wx + 42, fy + 46, 'All systems live', { s: 11.5, w: 600, f: '#fff' });
  s += progress(wx + 28, fy + 58, 114, 82, C.cyan, { h: 5, track: '#2a3a52' });

  const cx = 234, cw = 642;
  s += T(cx, 170, 'Dashboard', { s: 22, w: 700 }) + T(cx, 190, 'Overview · November 2026', { s: 12, f: C.grey });
  s += R(560, 150, 150, 32, '#fff', { r: 9, stroke: C.border }) + icon('search', 572, 158, C.mute) + T(596, 170, 'Search…', { s: 12, f: C.mute });
  s += R(722, 150, 112, 32, '#fff', { r: 9, stroke: C.border }) + icon('calendar', 734, 158, C.grey) + T(758, 170, 'This month', { s: 12, w: 500, f: C.slate });
  s += avatar(860, 166, 16, SKIN[1], HAIR[0], C.deep);

  const kw = (cw - 36) / 4;
  const k = [
    { label: 'Revenue', value: '$284.6k', delta: '+12.4%', ic: 'coin', color: C.primary },
    { label: 'Open orders', value: '1,284', delta: '+8.1%', ic: 'cart', color: C.cyan },
    { label: 'Stock value', value: '$96.2k', delta: '+3.6%', ic: 'box', color: C.amber },
    { label: 'Receivables', value: '$41.9k', delta: '-3.2%', up: false, ic: 'doc', color: C.violet },
  ];
  k.forEach((d, i) => { s += kpi(cx + i * (kw + 12), 206, kw, 92, d); });

  // revenue chart
  s += card(cx, 312, 410, 192, { title: 'Revenue' });
  s += legendDot(cx + 246, 340, C.cyan, 'This year') + legendDot(cx + 326, 340, C.violet, 'Last year');
  s += T(cx + 18, 372, '$1.92M', { s: 22, w: 700 }) + pill(cx + 108, 357, '+18.2%', C.green, { s: 10 });
  s += lineChart(cx + 18, 390, 374, 82, [[42, 48, 45, 58, 54, 66, 63, 74, 71, 86, 82, 96], [38, 40, 44, 42, 50, 48, 55, 53, 60, 58, 64, 66]], { labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'], grid: 3 });
  // donut
  const dx = cx + 422;
  s += card(dx, 312, 220, 192, { title: 'Sales by channel' });
  s += donut(dx + 64, 420, 40, 14, [{ v: 46, color: C.primary }, { v: 32, color: C.cyan }, { v: 22, color: C.amber }]);
  s += T(dx + 64, 420, '4.8k', { s: 16, w: 700, a: 'middle' }) + T(dx + 64, 434, 'orders', { s: 10, f: C.grey, a: 'middle' });
  [['Online', '46%', C.primary], ['Retail', '32%', C.cyan], ['B2B', '22%', C.amber]].forEach(([lb, v, c], i) => {
    s += legendDot(dx + 126, 396 + i * 26, c, lb) + T(dx + 204, 396 + i * 26, v, { s: 11, w: 700, a: 'end' });
  });
  // orders table
  s += card(cx, 518, cw, 168, { title: 'Recent orders', action: 'View all' });
  s += table(cx + 8, 556, cw - 16, [
    { label: 'ORDER', w: 104 }, { label: 'CUSTOMER', w: 180 }, { label: 'DATE', w: 100 }, { label: 'AMOUNT', w: 110, align: 'end' }, { label: 'STATUS', w: 132, align: 'end' },
  ], [
    ['SO-10482', { av: [SKIN[1], HAIR[0], C.primary], text: 'Apex Builders' }, 'Nov 08', { text: '$12,480', w: 600, color: C.ink }, { pill: 'Paid', color: C.green }],
    ['SO-10481', { av: [SKIN[3], HAIR[4], C.amber], text: 'Cedar Retail' }, 'Nov 08', { text: '$4,920', w: 600, color: C.ink }, { pill: 'Shipped', color: C.primary }],
    ['SO-10480', { av: [SKIN[0], HAIR[3], C.violet], text: 'Blue Harbor Co.' }, 'Nov 07', { text: '$8,315', w: 600, color: C.ink }, { pill: 'Pending', color: C.amber }],
  ], { rowH: 32, headH: 26, s: 11.5 });

  // phone
  const ph = phone(870, 222, 240, 478);
  s += ph.svg;
  const { sx, sy, sw, sh } = ph;
  s += ph.notch + T(sx + 22, sy + 26, '9:41', { s: 11, w: 700 });
  for (let i = 0; i < 3; i++) s += R(sx + sw - 40 + i * 6, sy + 22 - i * 3, 4, 6 + i * 3, C.ink, { r: 1 });
  s += avatar(sx + 30, sy + 62, 14, SKIN[1], HAIR[0], C.deep) + T(sx + 52, sy + 58, 'Good morning', { s: 10, f: C.grey }) + T(sx + 52, sy + 74, 'Admin', { s: 13, w: 700 });
  s += Ci(sx + sw - 28, sy + 62, 15, C.soft) + icon('bell', sx + sw - 35, sy + 55, C.slate, 14) + Ci(sx + sw - 22, sy + 54, 3.5, C.coral);
  const scx = sx + 14, scw = sw - 28;
  const [cpp, cidd] = clipRect(scx, sy + 92, scw, 116, 16);
  s += cpp + G(R(scx, sy + 92, scw, 116, url('brand')) + Ci(scx + scw - 10, sy + 96, 60, '#fff', { op: 0.1 }) + Ci(scx + scw - 30, sy + 210, 50, '#fff', { op: 0.08 }), { clip: cidd });
  s += T(scx + 16, sy + 116, "Today's sales", { s: 11, f: '#fff', op: 0.85 }) + T(scx + 16, sy + 150, '$18,240', { s: 26, w: 800, f: '#fff' });
  s += R(scx + 16, sy + 164, 96, 22, '#fff', { r: 11, op: 0.2 }) + T(scx + 64, sy + 179, '+9.2% today', { s: 10.5, w: 600, f: '#fff', a: 'middle' });
  [14, 22, 18, 30, 26, 36, 42].forEach((h, i) => { s += R(scx + scw - 86 + i * 11, sy + 196 - h, 7, h, '#fff', { r: 3, op: i === 6 ? 0.95 : 0.45 }); });
  [['Order', 'cart', C.primary], ['Stock', 'box', C.amber], ['Leads', 'users', C.violet], ['Invoice', 'doc', C.green]].forEach(([lb, ic, c], i) => {
    const qx = scx + scw / 8 + (i * scw) / 4;
    s += Ci(qx, sy + 240, 19, tint(c, 0.86)) + icon(ic, qx - 8, sy + 232, c) + T(qx, sy + 276, lb, { s: 10, f: C.slate, a: 'middle', w: 500 });
  });
  s += T(scx + 2, sy + 304, 'Recent orders', { s: 13, w: 700 }) + T(scx + scw - 2, sy + 304, 'See all', { s: 10.5, w: 600, f: C.primary, a: 'end' });
  [['SO-10482', 'Apex Builders', '$12,480', C.primary], ['SO-10481', 'Cedar Retail', '$4,920', C.amber]].forEach(([a, b, c, col], i) => {
    const iy = sy + 316 + i * 48;
    s += R(scx, iy, scw, 42, C.soft, { r: 12 }) + iconTile('box', scx + 8, iy + 6, col, 30);
    s += T(scx + 46, iy + 18, a, { s: 11.5, w: 600 }) + T(scx + 46, iy + 33, b, { s: 10, f: C.grey }) + T(scx + scw - 10, iy + 26, c, { s: 12, w: 700, a: 'end' });
  });
  const tby = sy + sh - 46;
  s += L(sx + 10, tby, sx + sw - 10, tby, C.line, 1);
  ['home', 'chart', 'box', 'user'].forEach((ic, i) => { const ix = sx + sw / 8 + (i * sw) / 4; s += icon(ic, ix - 9, tby + 12, i === 0 ? C.primary : C.mute, 18); if (i === 0) s += Ci(ix, tby + 38, 2.5, C.primary); });

  // floating CRM chat card
  s += R(905, 50, 265, 160, '#fff', { r: 16, sh: true });
  s += avatar(933, 80, 16, SKIN[2], HAIR[0], C.violet, { style: 'long' }) + Ci(945, 92, 4.5, C.green, { stroke: '#fff', sw: 2 });
  s += T(957, 77, 'Sara Khan', { s: 13, w: 700 }) + T(957, 93, 'New lead · Live chat', { s: 10.5, f: C.grey });
  s += iconTile('chat', 1130, 64, C.primary, 28);
  s += chatBubble(921, 108, 200, ['Hi! Could we see a demo of', 'the inventory module?']).svg;
  s += chatBubble(994, 166, 160, ['Sure, booked Thu 10:00'], { me: true, s: 11 }).svg;

  // notification chip
  s += R(70, 712, 300, 62, '#fff', { r: 16, sh: true }) + Ci(104, 743, 18, tint(C.green, 0.85)) + icon('check', 96, 735, C.green, 16, 2.4);
  s += T(132, 739, 'Invoice INV-4821 paid', { s: 13, w: 700 }) + T(132, 756, '$12,480 · Apex Builders · just now', { s: 11, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 2. ERP dashboard                                                    */
/* ------------------------------------------------------------------ */
function erpDashboard() {
  let s = uiBackdrop();
  const wx = 60, wy = 50, ww = 1080, wh = 700;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'erp.vqbyte.com/overview' });
  s += sidebar(wx, wy + 40, 190, wh - 40, ['Dashboard', 'Finance', 'Purchase', 'Sales', 'Production', 'Inventory', 'HR', 'Reports'], 0, { icons: ['grid', 'coin', 'cart', 'trend', 'factory', 'box', 'users', 'doc'] });
  const x0 = 278, cw = 834, right = x0 + cw;
  s += T(x0, 128, 'ERP overview', { s: 22, w: 700 }) + T(x0, 148, 'All modules · FY 2026', { s: 12, f: C.grey });
  s += button(right - 270, 112, 110, 34, 'Export', { fill: '#fff', color: C.slate, stroke: C.border, ic: 'doc', r: 9 });
  s += button(right - 150, 112, 150, 34, 'New entry', { ic: 'plus', r: 9 });
  const mw = (cw - 36) / 4;
  [
    ['Finance', 'Net profit', '$128.4k', 72, 'coin', C.primary],
    ['Purchase', 'Open POs', '46', 58, 'cart', C.amber],
    ['Sales', 'Orders this month', '1,920', 84, 'trend', C.green],
    ['Production', 'Work orders', '38', 64, 'factory', C.violet],
  ].forEach(([name, lab, val, pct, ic, col], i) => {
    const x = x0 + i * (mw + 12), y = 166;
    s += R(x, y, mw, 118, '#fff', { r: 14, stroke: C.border });
    s += iconTile(ic, x + 16, y + 16, col, 34) + T(x + 60, y + 38, name, { s: 14, w: 700 });
    s += T(x + 16, y + 72, lab, { s: 11, f: C.grey }) + T(x + mw - 16, y + 74, val, { s: 20, w: 700, a: 'end' });
    s += progress(x + 16, y + 88, mw - 32, pct, col) + T(x + 16, y + 110, `${pct}% of target`, { s: 10, f: C.mute });
  });
  // cash flow
  const cy = 298;
  s += card(x0, cy, 524, 236, { title: 'Cash flow', sub: 'Last 12 months' });
  s += legendDot(x0 + 300, cy + 28, C.primary, 'Inflow') + legendDot(x0 + 362, cy + 28, tint(C.cyan, 0.45), 'Outflow') + legendDot(x0 + 432, cy + 28, C.amber, 'Net');
  const inflow = [62, 58, 70, 66, 74, 80, 72, 86, 82, 90, 88, 98];
  const outflow = [48, 50, 52, 55, 54, 60, 58, 62, 66, 64, 70, 72];
  s += barChart(x0 + 40, cy + 54, 466, 140, inflow.map((v, i) => [v, outflow[i]]), { colors: [C.primary, tint(C.cyan, 0.45)], labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], max: 110, grid: 4, gap: 0.34, r: 3 });
  s += lineChart(x0 + 40 + 466 / 24, cy + 54, 466 - 466 / 12, 140, [inflow.map((v, i) => v - outflow[i])], { grid: 0, area: false, colors: [C.amber], max: 60, min: -40, sw: 2.5, dots: false });
  ['$100k', '$75k', '$50k', '$25k', '0'].forEach((t, i) => { s += T(x0 + 32, cy + 58 + i * 35, t, { s: 9.5, f: C.mute, a: 'end' }); });
  // approvals
  const ax = x0 + 536, aw = cw - 536;
  s += card(ax, cy, aw, 236, { title: 'Pending approvals' }) + pill(ax + 168, cy + 15, '5 new', C.coral, { s: 10 });
  [['PO-2291', 'Steel sheets · $8,400', C.amber, 'cart'], ['EXP-118', 'Travel claim · $640', C.primary, 'coin'], ['LV-077', 'Annual leave · 3 days', C.violet, 'users'], ['SO-10495', 'Discount 12% · $2,180', C.green, 'trend']].forEach(([code, desc, col, ic], i) => {
    const y = cy + 48 + i * 46;
    s += iconTile(ic, ax + 16, y + 2, col, 34) + T(ax + 60, y + 16, code, { s: 12.5, w: 700 }) + T(ax + 60, y + 32, desc, { s: 11, f: C.grey });
    s += button(ax + aw - 88, y + 6, 72, 26, 'Approve', { s: 11, r: 8 });
    if (i < 3) s += L(ax + 16, y + 42, ax + aw - 16, y + 42, C.line, 1);
  });
  // production
  const by = 548;
  s += card(x0, by, 410, 186, { title: 'Production status', action: 'Live' });
  [['Line A · Assembly', 82, C.primary], ['Line B · Packaging', 64, C.cyan], ['Line C · Quality check', 91, C.green], ['Line D · Dispatch', 47, C.amber]].forEach(([n, p, c], i) => {
    const y = by + 58 + i * 32;
    s += T(x0 + 18, y, n, { s: 12, w: 500, f: C.slate }) + T(x0 + 392, y, `${p}%`, { s: 12, w: 700, a: 'end' }) + progress(x0 + 18, y + 8, 374, p, c);
  });
  s += card(x0 + 422, by, cw - 422, 186, { title: 'Invoices', action: 'View all' });
  s += table(x0 + 430, by + 40, cw - 438, [{ label: 'INVOICE', w: 86 }, { label: 'CUSTOMER', w: 104 }, { label: 'DUE', w: 54 }, { label: 'AMOUNT', w: 76, align: 'end' }, { label: 'STATUS', w: 76, align: 'end' }], [
    ['INV-4821', 'Apex Builders', 'Nov 12', { text: '$12,480', w: 600, color: C.ink }, { pill: 'Paid', color: C.green }],
    ['INV-4820', 'Delta Foods', 'Nov 15', { text: '$6,240', w: 600, color: C.ink }, { pill: 'Sent', color: C.primary }],
    ['INV-4817', 'Orbit Labs', 'Nov 02', { text: '$3,180', w: 600, color: C.ink }, { pill: 'Overdue', color: C.coral }],
  ], { rowH: 34, headH: 28, s: 11.5 });
  return s;
}

/* ------------------------------------------------------------------ */
/* 3. CRM pipeline                                                     */
/* ------------------------------------------------------------------ */
function crmPipeline() {
  let s = uiBackdrop();
  const wx = 40, wy = 50, ww = 1120, wh = 700;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'crm.vqbyte.com/pipeline' });
  s += sidebar(wx, wy + 40, 176, wh - 40, ['Dashboard', 'Leads', 'Deals', 'Contacts', 'Inbox', 'Reports'], 2, { brand: 'VQ CRM', icons: ['grid', 'users', 'trend', 'user', 'chat', 'chart'] });
  const x0 = 240;
  s += T(x0, 130, 'Sales pipeline', { s: 22, w: 700 }) + T(x0, 150, '$486,200 across 38 open deals', { s: 12, f: C.grey });
  s += pill(x0 + 410, 118, 'This quarter', C.primary, { s: 11 }) + pill(x0 + 510, 118, 'All owners', C.grey, { s: 11 });
  const cols = [
    ['Lead', 12, '$96k', C.violet, [['Harbor Logistics', 'WMS + scanners', '$24,000', 1], ['Sunline Clinics', 'Patient CRM', '$12,500', 2], ['Atlas Motors', 'Dealer system', '$18,900', 0], ['Pinewood Hotels', 'Booking + POS', '$14,200', 3]]],
    ['Qualified', 9, '$128k', C.amber, [['Greenfield Agro', 'ERP + POS', '$32,000', 3], ['Metro Pharma', 'Inventory', '$15,400', 1], ['Nova Textiles', 'Production', '$27,600', 0], ['Zenith Clinics', 'Patient portal', '$11,800', 2]]],
    ['Proposal', 7, '$164k', C.primary, [['Crescent Mall', 'Retail POS', '$46,800', 2], ['Orbit Schools', 'LMS portal', '$21,000', 0], ['Vega Steel', 'Production ERP', '$38,500', 1]]],
    ['Won', 10, '$98k', C.green, [['Delta Petroleum', 'Tank monitoring', '$64,000', 3], ['Kite Couriers', 'Delivery app', '$9,800', 1], ['Lotus Bakery', 'POS + loyalty', '$7,400', 2]]],
  ];
  const colW = 142, gap = 10;
  let lateDrag = '';
  cols.forEach(([name, n, amt, col, cards], ci) => {
    const x = x0 + ci * (colW + gap), y = 172;
    s += R(x, y, colW, 560, C.soft, { r: 12, stroke: C.line });
    s += Ci(x + 16, y + 22, 4.5, col) + T(x + 26, y + 26, name, { s: 12.5, w: 700 }) + T(x + colW - 12, y + 26, String(n), { s: 11, w: 600, f: C.grey, a: 'end' });
    s += T(x + 12, y + 44, amt, { s: 11, f: C.grey }) + R(x + 12, y + 52, colW - 24, 3, col, { r: 1.5, op: 0.85 });
    if (ci === 2) s += R(x + 7, y + 66 + 106, colW - 14, 96, tint(C.primary, 0.94), { r: 10, stroke: tint(C.primary, 0.4), dash: '5 5', sw: 1.5 });
    let dragSvg = '';
    cards.forEach(([co, deal, val, sk], i) => {
      const cy = y + 66 + i * 106;
      const drag = ci === 2 && i === 1;
      const inner = R(x + 7, cy, colW - 14, 96, '#fff', { r: 10, stroke: drag ? undefined : C.border, sh: drag })
        + R(x + 7, cy + 14, 3, 22, col, { r: 1.5 })
        + T(x + 18, cy + 22, co, { s: 11.5, w: 700 }) + T(x + 18, cy + 38, deal, { s: 10.5, f: C.grey })
        + T(x + 18, cy + 64, val, { s: 13, w: 700 }) + progress(x + 18, cy + 76, 70, [30, 50, 75, 100][ci], col, { h: 4 })
        + avatar(x + colW - 26, cy + 70, 11, SKIN[sk], HAIR[sk % 5], [C.primary, C.amber, C.violet, C.green][sk]);
      if (drag) dragSvg = G(inner, { t: `translate(${colW * 0.62} 22) rotate(-5 ${x + colW / 2} ${cy + 48})` });
      else s += inner;
    });
    lateDrag += dragSvg;
    s += T(x + colW / 2, y + 540, '+ Add deal', { s: 11, w: 600, f: C.mute, a: 'middle' });
  });
  s += lateDrag;
  // side chat panel
  const px = 856, pw = 304, py = wy + 40;
  s += Pa(rrPath(px, py, pw, wh - 40, [0, 0, 16, 0]), C.soft) + L(px, py, px, wy + wh, C.border, 1);
  s += avatar(px + 40, py + 42, 22, SKIN[2], HAIR[0], C.violet, { style: 'long' });
  s += T(px + 72, py + 38, 'Sara Khan', { s: 15, w: 700 }) + T(px + 72, py + 56, 'Crescent Mall · Proposal', { s: 11, f: C.grey });
  s += Ci(px + pw - 58, py + 42, 15, '#fff', { stroke: C.border }) + icon('chat', px + pw - 65, py + 35, C.primary, 14);
  s += Ci(px + pw - 24, py + 42, 15, url('brand')) + icon('mobile', px + pw - 31, py + 35, '#fff', 14);
  ['Chat', 'Notes', 'Activity'].forEach((t, i) => { s += T(px + 24 + i * 76, py + 96, t, { s: 12, w: i === 0 ? 700 : 500, f: i === 0 ? C.primary : C.grey }); });
  s += L(px + 16, py + 108, px + pw - 16, py + 108, C.border, 1) + R(px + 20, py + 106, 36, 3, C.primary, { r: 1.5 });
  // deal summary
  s += R(px + 16, py + 122, pw - 32, 64, '#fff', { r: 12, stroke: C.border });
  s += T(px + 30, py + 146, 'Deal value', { s: 10.5, f: C.grey }) + T(px + 30, py + 168, '$46,800', { s: 16, w: 700 });
  s += T(px + 160, py + 146, 'Close probability', { s: 10.5, f: C.grey }) + progress(px + 160, py + 158, 110, 75, C.green, { h: 7 }) + T(px + 160, py + 180, '75%', { s: 10, w: 600, f: C.green });
  let ty = py + 204;
  const msgs = [
    [false, ['Hi! We reviewed the POS proposal.', 'Can it sync stock across branches?'], '10:02'],
    [true, ['Yes, stock syncs in real time', 'across all 6 branches.'], '10:04'],
    [false, ['Great. Please share the', 'implementation timeline.'], '10:05'],
    [true, ['Sent! Kick-off can start Monday.'], '10:07'],
  ];
  for (const [me, lines, t] of msgs) {
    const w = Math.max(...lines.map((l) => tw(l, 11.5))) + 26;
    const b = chatBubble(me ? px + pw - 16 - w : px + 16, ty, w, lines, { me, s: 11.5, time: t });
    s += b.svg; ty += b.h + 26;
  }
  s += R(px + 16, wy + wh - 62, pw - 32, 44, '#fff', { r: 22, stroke: C.border }) + T(px + 36, wy + wh - 35, 'Type a message…', { s: 12, f: C.mute });
  s += Ci(px + pw - 40, wy + wh - 40, 16, url('brand')) + icon('send', px + pw - 47, wy + wh - 47, '#fff', 14);
  return s;
}

/* ------------------------------------------------------------------ */
/* 4. LMS                                                              */
/* ------------------------------------------------------------------ */
function lmsPlatform() {
  let s = uiBackdrop();
  const wx = 50, wy = 50, ww = 1100, wh = 700;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'learn.vqbyte.com/course/inventory' });
  // top nav
  s += R(wx + 22, wy + 56, 30, 30, url('brand'), { r: 9 }) + T(wx + 37, wy + 76, 'VQ', { s: 12, w: 800, f: '#fff', a: 'middle' }) + T(wx + 62, wy + 76, 'VQ Learn', { s: 15, w: 700 });
  let nvx = wx + 190;
  ['My courses', 'Catalog', 'Certificates'].forEach((t, i) => { s += T(nvx, wy + 76, t, { s: 13, w: i === 0 ? 700 : 500, f: i === 0 ? C.primary : C.grey }); nvx += tw(t, 13, 0.58) + 36; });
  s += avatar(wx + ww - 40, wy + 71, 16, SKIN[3], HAIR[0], C.primary);
  s += Ci(wx + ww - 84, wy + 71, 15, C.soft) + icon('bell', wx + ww - 91, wy + 64, C.slate, 14);
  s += L(wx, wy + 100, wx + ww, wy + 100, C.line, 1);
  // title
  s += T(74, 180, 'Module 3 · Inventory fundamentals', { s: 20, w: 700 }) + T(74, 200, 'Operations Academy  ›  Warehouse & stock control', { s: 12, f: C.grey });
  // video
  const vx = 74, vy = 214, vw = 700, vh = 330;
  const [cp, cid] = clipRect(vx, vy, vw, vh, 14);
  let v = R(vx, vy, vw, vh, url('deep'));
  v += Ci(vx + 120, vy + 60, 180, C.cyan, { op: 0.08 });
  // slide on screen
  v += R(vx + 380, vy + 40, 280, 190, '#fff', { r: 10, op: 0.97 });
  v += T(vx + 400, vy + 70, 'Stock flow', { s: 15, w: 700 }) + T(vx + 400, vy + 88, 'Receive → Store → Pick → Ship', { s: 10.5, f: C.grey });
  v += barChart(vx + 400, vy + 104, 240, 100, [30, 46, 38, 60, 52, 72], { colors: [C.primary, C.cyan], highlight: 5, r: 4, labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'] });
  // instructor
  v += person(vx + 220, vy + 520, { s: 1.15, skin: SKIN[1], hair: HAIR[1], hairStyle: 'long', shirt: '#ffffff', jacket: C.primary, pose: 'wave' });
  s += cp + G(v, { clip: cid });
  s += R(vx + 16, vy + 16, 92, 24, C.ink, { r: 12, op: 0.6 }) + Ci(vx + 30, vy + 28, 4, C.coral) + T(vx + 40, vy + 32, 'Lesson 3/8', { s: 10.5, w: 600, f: '#fff' });
  // controls
  s += R(vx + 16, vy + vh - 44, vw - 32, 32, C.ink, { r: 10, op: 0.65 });
  s += icon('play', vx + 28, vy + vh - 36, '#fff', 16) + T(vx + 54, vy + vh - 23, '12:48 / 24:10', { s: 11, f: '#fff' });
  s += R(vx + 140, vy + vh - 30, 420, 5, '#fff', { r: 2.5, op: 0.3 }) + R(vx + 140, vy + vh - 30, 222, 5, C.cyan, { r: 2.5 }) + Ci(vx + 362, vy + vh - 27.5, 7, '#fff');
  s += T(vx + vw - 80, vy + vh - 23, '1.25x', { s: 11, w: 600, f: '#fff' }) + icon('gear', vx + vw - 36, vy + vh - 36, '#fff', 16);
  // bottom cards
  const by = 556, bh = 178;
  s += card(74, by, 220, bh, { title: 'Your progress' });
  s += ring(160, by + 104, 46, 12, 68, C.primary, { label: '68%', sub: 'complete', s: 20 });
  s += T(232, by + 92, '5 of 8', { s: 12, w: 700 }) + T(232, by + 108, 'lessons', { s: 10.5, f: C.grey }) + T(232, by + 134, '2h 40m', { s: 12, w: 700 }) + T(232, by + 150, 'total', { s: 10.5, f: C.grey });
  // certificate
  const cx2 = 306;
  s += card(cx2, by, 220, bh, { title: 'Certificate' });
  s += Pa(`M${cx2 + 94},${by + 100}l-12,40 12,-7 9,10 6,-36z`, C.coral) + Pa(`M${cx2 + 126},${by + 100}l12,40-12,-7-9,10-6,-36z`, shade(C.coral, 0.12));
  s += Ci(cx2 + 110, by + 84, 32, C.amber) + Ci(cx2 + 110, by + 84, 24, '#fbbf24') + Ci(cx2 + 110, by + 84, 24, null, { stroke: '#fff', sw: 1.5, dash: '3 3', op: 0.8 });
  s += icon('star', cx2 + 99, by + 73, '#fff', 22, 2);
  s += T(cx2 + 110, by + 166, 'Unlocks at 100%', { s: 11, f: C.grey, a: 'middle' });
  // quiz
  const qx = 538, qw = 236;
  s += card(qx, by, qw, bh, { title: 'Quick quiz' }) + pill(qx + qw - 14, by + 14, '2 / 5', C.violet, { s: 10, a: 'end' });
  s += T(qx + 18, by + 52, 'Which method values stock', { s: 11.5, f: C.slate }) + T(qx + 18, by + 68, 'using the latest cost?', { s: 11.5, f: C.slate });
  ['FIFO', 'LIFO', 'Weighted average'].forEach((o, i) => {
    const y = by + 80 + i * 30; const on = i === 1;
    s += R(qx + 16, y, qw - 32, 24, on ? tint(C.primary, 0.9) : '#fff', { r: 8, stroke: on ? C.primary : C.border });
    s += Ci(qx + 30, y + 12, 5.5, on ? C.primary : '#fff', { stroke: on ? C.primary : C.mute, sw: 1.5 }) + (on ? Ci(qx + 30, y + 12, 2.2, '#fff') : '');
    s += T(qx + 44, y + 16, o, { s: 11.5, w: on ? 600 : 400, f: on ? C.deep : C.slate });
  });
  // lessons
  const lx = 790, lw = 336, ly = 166;
  s += card(lx, ly, lw, 568, { title: 'Course content' });
  s += T(lx + 18, ly + 48, '8 lessons · 2h 40m', { s: 11, f: C.grey }) + progress(lx + 18, ly + 60, lw - 36, 68, C.green);
  const lessons = [['Welcome & overview', '04:12', 'done'], ['Items, SKUs & units', '12:30', 'done'], ['Inventory fundamentals', '24:10', 'now'], ['Warehouses & bins', '18:05', 'open'], ['Stock transfers', '15:40', 'open'], ['Cycle counting', '11:22', 'open'], ['Reorder rules', '16:48', 'open'], ['Final assessment', '20:00', 'lock']];
  lessons.forEach(([n, d, st], i) => {
    const y = ly + 82 + i * 56;
    if (st === 'now') s += R(lx + 10, y, lw - 20, 48, tint(C.primary, 0.9), { r: 10, stroke: tint(C.primary, 0.6) });
    if (st === 'done') s += Ci(lx + 36, y + 24, 12, C.green) + icon('check', lx + 29, y + 17, '#fff', 14, 2.4);
    else if (st === 'now') s += Ci(lx + 36, y + 24, 12, C.primary) + Pa(`M${lx + 32},${y + 18}l9,6-9,6z`, '#fff');
    else if (st === 'lock') s += Ci(lx + 36, y + 24, 12, C.line) + icon('lock', lx + 30, y + 18, C.mute, 12);
    else s += Ci(lx + 36, y + 24, 11, '#fff', { stroke: C.border, sw: 2 });
    s += T(lx + 58, y + 21, `${i + 1}. ${n}`, { s: 12.5, w: st === 'now' ? 700 : 500, f: st === 'lock' ? C.mute : C.ink });
    s += T(lx + 58, y + 37, st === 'done' ? 'Completed' : st === 'now' ? 'In progress' : 'Video lesson', { s: 10.5, f: st === 'done' ? C.green : st === 'now' ? C.primary : C.mute });
    s += T(lx + lw - 22, y + 29, d, { s: 11, f: C.grey, a: 'end' });
  });
  s += button(lx + 18, ly + 520, lw - 36, 34, 'Continue lesson', { ic: 'play', r: 10 });
  return s;
}

/* ------------------------------------------------------------------ */
/* 5. Inventory / WMS                                                  */
/* ------------------------------------------------------------------ */
function barcode(x, y, w, h, color = C.ink) {
  let s = ''; let cx = x; let k = 7;
  while (cx < x + w - 2) { k = (k * 37 + 11) % 97; const bw = 1 + (k % 3); s += R(cx, y, bw, h, color); cx += bw + 1 + (k % 2) * 1.5; }
  return s;
}
function inventoryWms() {
  let s = uiBackdrop({ dots: [[980, 40, 200, 160], [30, 680, 200, 100]] });
  const wx = 30, wy = 40, ww = 920, wh = 620;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'wms.vqbyte.com/stock' });
  s += sidebar(wx, wy + 40, 170, wh - 40, ['Overview', 'Receiving', 'Stock', 'Picking', 'Transfers', 'Reports'], 2, { brand: 'VQ WMS', icons: ['grid', 'truck', 'box', 'doc', 'link', 'chart'] });
  const x0 = 224, cw = 702, right = x0 + cw;
  s += T(x0, 120, 'Stock on hand', { s: 22, w: 700 }) + T(x0, 140, 'Main warehouse · WH-01', { s: 12, f: C.grey });
  s += button(right - 230, 104, 104, 34, 'Scan', { fill: '#fff', color: C.slate, stroke: C.border, ic: 'search', r: 9 }) + button(right - 114, 104, 114, 34, 'Transfer', { ic: 'link', r: 9 });
  const kw = (cw - 36) / 4;
  [
    { label: 'Stock on hand', value: '48,920', delta: '+4.2%', ic: 'box', color: C.primary },
    { label: 'Pick lists', value: '126', delta: '+18', ic: 'doc', color: C.cyan },
    { label: 'Low stock', value: '14', delta: '-3', up: false, ic: 'bell', color: C.coral },
    { label: 'Inbound today', value: '32', delta: '+6', ic: 'truck', color: C.green },
  ].forEach((d, i) => { s += kpi(x0 + i * (kw + 12), 156, kw, 92, d); });
  s += card(x0, 262, 420, 384, { title: 'Inventory', action: 'Filter' });
  s += table(x0 + 8, 296, 404, [{ label: 'SKU', w: 78 }, { label: 'ITEM', w: 124 }, { label: 'BIN', w: 64 }, { label: 'QTY', w: 50, align: 'end' }, { label: 'STATUS', w: 88, align: 'end' }], [
    ['SKU-1042', 'Steel bolts M8', 'A-04-2', '1,240', { pill: 'In stock', color: C.green }],
    ['SKU-1187', 'Cable ties 200mm', 'B-02-1', '86', { pill: 'Low', color: C.amber }],
    ['SKU-2205', 'Hydraulic oil 5L', 'C-01-3', '312', { pill: 'In stock', color: C.green }],
    ['SKU-2290', 'Safety gloves L', 'A-07-4', '540', { pill: 'In stock', color: C.green }],
    ['SKU-3016', 'Bearing 6204', 'D-03-2', '24', { pill: 'Reorder', color: C.coral }],
    ['SKU-3122', 'Pallet wrap', 'B-05-1', '148', { pill: 'In stock', color: C.green }],
    ['SKU-4410', 'Brass valve 2"', 'C-06-2', '62', { pill: 'Low', color: C.amber }],
    ['SKU-4532', 'Label rolls', 'E-01-1', '930', { pill: 'In stock', color: C.green }],
  ], { rowH: 38, headH: 28, s: 11 });
  // heatmap
  const hx = x0 + 432, hw = 270;
  s += card(hx, 262, hw, 384, { title: 'Floor heatmap' }) + T(hx + 18, 306, 'Pick frequency by bin', { s: 11, f: C.grey });
  const aisles = ['A', 'B', 'C', 'D', 'E', 'F'];
  const heat = [C.bg2, tint(C.cyan, 0.7), tint(C.cyan, 0.4), C.cyan, C.primary, C.deep];
  let k = 5;
  aisles.forEach((a, r) => {
    s += T(hx + 22, 340 + r * 34, a, { s: 11, w: 700, f: C.grey, a: 'middle' });
    for (let c = 0; c < 7; c++) {
      k = (k * 29 + 17) % 101;
      let lvl = Math.min(5, Math.floor((k % 6) * 0.6 + (c < 3 ? 2 : 0) + (r < 2 ? 1 : 0)));
      if (r === 0 && c === 3) lvl = 5;
      const hot = r === 1 && c === 1;
      s += R(hx + 36 + c * 31, 323 + r * 34, 27, 28, hot ? C.amber : heat[lvl], { r: 5 });
    }
  });
  for (let c = 0; c < 7; c++) s += T(hx + 49.5 + c * 31, 538, String(c + 1).padStart(2, '0'), { s: 9.5, f: C.mute, a: 'middle' });
  s += T(hx + 18, 572, 'Low', { s: 10, f: C.grey });
  heat.forEach((hc, i) => { s += R(hx + 46 + i * 28, 562, 26, 12, hc, { r: i === 0 ? 3 : 0 }); });
  s += T(hx + 220, 572, 'High', { s: 10, f: C.grey });
  s += R(hx + 18, 592, hw - 36, 38, C.soft, { r: 10 }) + R(hx + 30, 604, 14, 14, C.amber, { r: 4 }) + T(hx + 52, 615, 'Hot bin B-02 · restock', { s: 11, w: 600, f: C.slate });

  // foreground box + scanner
  s += G(box(860, 600, 320, 230, { label: false }), {});
  s += R(930, 650, 170, 92, '#fff', { r: 6 }) + barcode(946, 668, 138, 44) + T(1015, 730, 'A-04-2 · SKU-1042', { s: 10, w: 600, f: C.ink, a: 'middle' });
  // beam
  s += Pa('M994,552L940,690L1090,690Z', C.coral, { op: 0.16 }) + L(938, 690, 1092, 690, C.coral, 2.5, { op: 0.9 });
  // scanner device
  let d = '';
  d += R(0, 0, 150, 300, C.ink, { r: 26 }) + R(-6, 20, 10, 60, '#1d2939', { r: 4 }) + R(146, 20, 10, 60, '#1d2939', { r: 4 });
  d += R(0, 0, 150, 34, C.amber, { r: 26 }) + R(0, 18, 150, 16, C.amber);
  d += R(12, 44, 126, 150, '#fff', { r: 8 });
  d += R(12, 44, 126, 26, C.primary, { r: 8 }) + R(12, 58, 126, 12, C.primary) + T(22, 62, 'Scan bin', { s: 11, w: 700, f: '#fff' });
  d += T(22, 92, 'A-04-2', { s: 18, w: 800 }) + T(22, 108, 'Steel bolts M8', { s: 10, f: C.grey });
  d += R(22, 118, 106, 30, C.soft, { r: 6 }) + T(32, 138, 'Qty', { s: 10, f: C.grey }) + T(118, 139, '24', { s: 14, w: 700, a: 'end' });
  d += R(22, 156, 106, 28, C.green, { r: 7 }) + T(75, 174, 'Confirm', { s: 11, w: 700, f: '#fff', a: 'middle' });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) d += R(20 + c * 40, 206 + r * 22, 32, 16, '#26354d', { r: 5 });
  d += R(50, 274, 50, 10, C.amber, { r: 5 });
  s += G(d, { t: 'translate(946 260) rotate(14 75 150)', sh: true });
  return s;
}

/* ------------------------------------------------------------------ */
/* 6. POS                                                              */
/* ------------------------------------------------------------------ */
function productGlyph(kind, cx, cy) {
  switch (kind) {
    case 'cup': return El(cx, cy + 22, 30, 6, '#d0dce5') + Pa(`M${cx - 22},${cy - 12}h44l-6,34h-32z`, '#fff', { stroke: C.border, sw: 1.5 }) + Pa(`M${cx + 21},${cy - 4}a8,8 0 0 1 0,14`, null, { stroke: C.border, sw: 4 }) + El(cx, cy - 12, 22, 5, '#8b5a3c') + Pa(`M${cx - 6},${cy - 24}q-4,-6 0,-12M${cx + 6},${cy - 24}q-4,-6 0,-12`, null, { stroke: C.mute, sw: 2, op: 0.6 });
    case 'latte': return Pa(`M${cx - 16},${cy - 26}h32l-4,52h-24z`, '#fff', { stroke: C.border, sw: 1.5 }) + Pa(`M${cx - 15},${cy - 10}h30l-3,36h-24z`, '#c08a5f') + R(cx - 17, cy - 30, 34, 6, C.ink, { r: 3 });
    case 'croissant': return Pa(`M${cx - 34},${cy + 10}Q${cx - 30},${cy - 26} ${cx},${cy - 26}Q${cx + 30},${cy - 26} ${cx + 34},${cy + 10}Q${cx + 18},${cy - 2} ${cx},${cy - 2}Q${cx - 18},${cy - 2} ${cx - 34},${cy + 10}Z`, '#e7a24a') + Pa(`M${cx - 12},${cy - 24}l4,22M${cx + 12},${cy - 24}l-4,22M${cx},${cy - 26}v24`, null, { stroke: '#b7741f', sw: 2 });
    case 'muffin': return Pa(`M${cx - 20},${cy}h40l-6,26h-28z`, C.coral) + Pa(`M${cx - 26},${cy + 2}Q${cx - 28},${cy - 28} ${cx},${cy - 28}Q${cx + 28},${cy - 28} ${cx + 26},${cy + 2}Z`, '#c98a55') + Ci(cx - 8, cy - 12, 3.5, C.violet) + Ci(cx + 8, cy - 16, 3.5, C.violet) + Ci(cx + 4, cy - 4, 3.5, C.violet);
    case 'juice': return Pa(`M${cx - 18},${cy - 26}h36l-4,52h-28z`, '#fff', { stroke: C.border, sw: 1.5 }) + Pa(`M${cx - 16},${cy - 12}h32l-3,36h-26z`, C.amber) + L(cx + 6, cy - 34, cx + 2, cy - 4, C.coral, 3) + Ci(cx - 14, cy - 26, 8, '#f8c35a');
    case 'water': return Pa(`M${cx - 12},${cy - 18}q0,-8 6,-10v-6h12v6q6,2 6,10v44h-24z`, tint(C.cyan, 0.55)) + R(cx - 12, cy - 4, 24, 14, '#fff') + R(cx - 6, cy - 40, 12, 7, C.primary, { r: 2 });
    case 'sandwich': return Pa(`M${cx - 30},${cy + 20}L${cx + 28},${cy + 20}L${cx - 2},${cy - 24}Z`, '#f2d39c') + Pa(`M${cx - 26},${cy + 14}L${cx + 24},${cy + 14}`, null, { stroke: C.green, sw: 5 }) + Pa(`M${cx - 20},${cy + 6}L${cx + 18},${cy + 6}`, null, { stroke: C.coral, sw: 5 }) + Pa(`M${cx - 30},${cy + 20}L${cx + 28},${cy + 20}L${cx - 2},${cy - 24}Z`, null, { stroke: '#d9a861', sw: 2 });
    case 'brownie': return R(cx - 24, cy - 14, 48, 34, '#6b4430', { r: 5 }) + R(cx - 24, cy - 14, 48, 10, '#4a2e20', { r: 5 }) + Ci(cx - 8, cy + 6, 2.5, '#8a5a40') + Ci(cx + 10, cy + 2, 2.5, '#8a5a40');
    case 'tea': return Pa(`M${cx - 18},${cy - 26}h36l-4,52h-28z`, '#fff', { stroke: C.border, sw: 1.5 }) + Pa(`M${cx - 16},${cy - 14}h32l-3,38h-26z`, '#c9773c', { op: 0.85 }) + R(cx - 10, cy - 10, 10, 10, '#fff', { r: 2, op: 0.7 }) + R(cx + 2, cy - 4, 10, 10, '#fff', { r: 2, op: 0.7 }) + El(cx + 12, cy - 26, 8, 5, C.green);
    default: return '';
  }
}
function posSystem() {
  let s = uiBackdrop({ dots: [[20, 30, 220, 130]] });
  // counter
  s += R(0, 718, 1200, 82, '#dfe9ef') + R(0, 712, 1200, 10, '#cfdde6');
  // stand
  s += Pa('M470,640L500,640L530,714H440Z', '#9fb3c2') + R(400, 704, 170, 12, '#8da2b3', { r: 6 });
  const tb = tabletFrame(80, 80, 860, 566);
  s += tb.svg;
  const { sx, sy, sw, sh } = tb;
  // header
  s += R(sx + 16, sy + 16, 30, 30, url('brand'), { r: 9 }) + T(sx + 31, sy + 36, 'VQ', { s: 12, w: 800, f: '#fff', a: 'middle' }) + T(sx + 56, sy + 36, 'VQ POS', { s: 15, w: 700 });
  s += R(sx + 150, sy + 16, 200, 32, C.soft, { r: 10 }) + icon('search', sx + 162, sy + 24, C.mute) + T(sx + 186, sy + 36, 'Search products', { s: 12, f: C.mute });
  s += pill(sx + 362, sy + 20, 'Branch 02 · Till 1', C.primary, { s: 11 });
  const cats = ['All', 'Coffee', 'Bakery', 'Drinks', 'Snacks'];
  let px = sx + 16;
  cats.forEach((c, i) => { s += pill(px, sy + 62, c, i === 0 ? C.primary : C.grey, { s: 12, solid: i === 0, h: 28 }); px += pillW(c, 12) + 8; });
  // products
  const prods = [['Cappuccino', '$4.20', 'cup', C.amber], ['Caffe latte', '$4.50', 'latte', C.primary], ['Croissant', '$3.10', 'croissant', C.amber], ['Berry muffin', '$2.90', 'muffin', C.violet], ['Orange juice', '$3.80', 'juice', C.amber], ['Water 500ml', '$1.20', 'water', C.cyan], ['Club sandwich', '$6.90', 'sandwich', C.green], ['Brownie', '$2.60', 'brownie', C.coral], ['Iced tea', '$3.20', 'tea', C.green]];
  const gx = sx + 16, gw = sw - 300 - 32, tw2 = (gw - 24) / 3, th = 136;
  prods.forEach(([n, p, g, c], i) => {
    const x = gx + (i % 3) * (tw2 + 12), y = sy + 104 + Math.floor(i / 3) * (th + 10);
    const sel = [0, 2, 4, 6].includes(i);
    s += R(x, y, tw2, th, '#fff', { r: 12, stroke: sel ? C.primary : C.border, sw: sel ? 1.8 : 1 });
    s += R(x + 8, y + 8, tw2 - 16, 78, tint(c, 0.88), { r: 9 }) + productGlyph(g, x + tw2 / 2, y + 48);
    s += T(x + 12, y + 106, n, { s: 12.5, w: 600 }) + T(x + 12, y + 124, p, { s: 12, w: 700, f: C.primary });
    s += Ci(x + tw2 - 22, y + 114, 12, sel ? C.primary : C.soft) + icon('plus', x + tw2 - 28, y + 108, sel ? '#fff' : C.slate, 12, 2.2);
  });
  // cart
  const cx = sx + sw - 300, cy = sy;
  s += Pa(rrPath(cx, cy, 300, sh, [0, 12, 12, 0]), C.soft) + L(cx, cy, cx, cy + sh, C.border, 1);
  s += T(cx + 20, cy + 38, 'Current order', { s: 15, w: 700 }) + T(cx + 280, cy + 38, '#1048', { s: 12, w: 600, f: C.grey, a: 'end' });
  s += R(cx + 20, cy + 54, 260, 30, '#fff', { r: 8, stroke: C.border }) + icon('user', cx + 30, cy + 61, C.grey) + T(cx + 54, cy + 74, 'Walk-in customer', { s: 12, f: C.slate });
  const items = [['2', 'Cappuccino', '$8.40'], ['1', 'Croissant', '$3.10'], ['1', 'Orange juice', '$3.80'], ['1', 'Club sandwich', '$6.90']];
  items.forEach(([q, n, p], i) => {
    const y = cy + 100 + i * 46;
    s += R(cx + 20, y, 28, 28, '#fff', { r: 8, stroke: C.border }) + T(cx + 34, y + 18, `${q}x`, { s: 11, w: 700, f: C.primary, a: 'middle' });
    s += T(cx + 60, y + 13, n, { s: 12.5, w: 600 }) + T(cx + 60, y + 28, 'Regular', { s: 10, f: C.mute }) + T(cx + 280, y + 19, p, { s: 12.5, w: 700, a: 'end' });
  });
  let ty = cy + 300;
  s += L(cx + 20, ty, cx + 280, ty, C.border, 1, { dash: '4 4' });
  [['Subtotal', '$22.20'], ['Tax (8%)', '$1.78'], ['Discount', '-$0.00']].forEach(([a, b], i) => { s += T(cx + 20, ty + 24 + i * 22, a, { s: 12, f: C.grey }) + T(cx + 280, ty + 24 + i * 22, b, { s: 12, w: 600, f: C.slate, a: 'end' }); });
  s += T(cx + 20, ty + 108, 'Total', { s: 15, w: 700 }) + T(cx + 280, ty + 110, '$23.98', { s: 24, w: 800, a: 'end' });
  [['Card', 'card'], ['Cash', 'coin'], ['Wallet', 'mobile']].forEach(([n, ic], i) => {
    const x = cx + 20 + i * 89, y = ty + 128; const on = i === 0;
    s += R(x, y, 82, 40, on ? tint(C.primary, 0.9) : '#fff', { r: 10, stroke: on ? C.primary : C.border, sw: on ? 1.5 : 1 }) + icon(ic, x + 12, y + 12, on ? C.primary : C.slate) + T(x + 34, y + 25, n, { s: 12, w: 600, f: on ? C.deep : C.slate });
  });
  s += button(cx + 20, cy + sh - 64, 260, 46, 'Charge $23.98', { s: 15, r: 12 });
  // receipt printer
  let rc = Pa('M992,468H1128V610H992Z', '#fff', { sh: true });
  rc += Pa('M992,468l11,-8 11,8 11,-8 11,8 11,-8 11,8 11,-8 11,8 11,-8 11,8 11,-8 11,8 4,-3V468Z', '#fff');
  rc += T(1060, 494, 'VQ POS', { s: 12, w: 800, a: 'middle' }) + T(1060, 510, 'Branch 02 · #1048', { s: 9, f: C.grey, a: 'middle' });
  [['Cappuccino x2', '8.40'], ['Croissant', '3.10'], ['Orange juice', '3.80'], ['Club sandwich', '6.90']].forEach(([a, b], i) => { rc += T(1004, 532 + i * 15, a, { s: 9, f: C.slate }) + T(1116, 532 + i * 15, b, { s: 9, f: C.slate, a: 'end' }); });
  rc += L(1004, 594, 1116, 594, C.border, 1, { dash: '3 3' }) + T(1004, 608, 'TOTAL', { s: 10, w: 800 }) + T(1116, 608, '23.98', { s: 10, w: 800, a: 'end' });
  s += G(rc, { t: 'translate(0 -26)' });
  s += R(960, 604, 200, 112, '#e4ecf1', { r: 18, sh: true }) + R(985, 606, 150, 10, C.slate, { r: 5 });
  s += R(960, 660, 200, 56, '#d3dee6', { r: 18 }) + R(960, 660, 200, 20, '#d3dee6') + Ci(1130, 640, 5, C.green) + R(985, 634, 60, 8, '#cfdbe3', { r: 4 });
  // approval chip
  s += R(870, 40, 270, 62, '#fff', { r: 16, sh: true }) + Ci(904, 71, 18, tint(C.green, 0.85)) + icon('check', 896, 63, C.green, 16, 2.4);
  s += T(932, 67, 'Payment approved', { s: 13, w: 700 }) + T(932, 84, 'Card · $23.98 · receipt printed', { s: 11, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 7. SEO analytics                                                    */
/* ------------------------------------------------------------------ */
function seoAnalytics() {
  let s = uiBackdrop();
  const wx = 50, wy = 50, ww = 1100, wh = 700;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'seo.vqbyte.com/overview' });
  s += sidebar(wx, wy + 40, 180, wh - 40, ['Overview', 'Keywords', 'Pages', 'Backlinks', 'Site audit', 'Reports'], 0, { brand: 'VQ SEO', icons: ['grid', 'search', 'doc', 'link', 'shield', 'chart'] });
  const x0 = 254, cw = 872, right = x0 + cw;
  s += T(x0, 128, 'Organic performance', { s: 22, w: 700 }) + T(x0, 148, 'vqbyte.com · Last 90 days', { s: 12, f: C.grey });
  s += R(right - 140, 112, 140, 34, '#fff', { r: 9, stroke: C.border }) + icon('calendar', right - 128, 121, C.grey) + T(right - 104, 133, 'Last 90 days', { s: 12, w: 500, f: C.slate });
  const kw = (cw - 36) / 4;
  [
    { label: 'Organic sessions', value: '48.2k', delta: '+32%', ic: 'trend', color: C.primary },
    { label: 'Avg. position', value: '8.4', delta: '+2.1', ic: 'arrowUp', color: C.green },
    { label: 'Top-10 keywords', value: '214', delta: '+18', ic: 'search', color: C.violet },
    { label: 'Backlinks', value: '1,920', delta: '+6.4%', ic: 'link', color: C.amber },
  ].forEach((d, i) => { s += kpi(x0 + i * (kw + 12), 162, kw, 92, d); });
  // traffic chart
  s += card(x0, 268, 560, 236, { title: 'Organic traffic' });
  s += legendDot(x0 + 380, 296, C.cyan, 'Clicks') + legendDot(x0 + 450, 296, C.violet, 'Impressions');
  s += lineChart(x0 + 52, 318, 488, 150, [[12, 14, 13, 17, 19, 18, 24, 27, 26, 33, 38, 44], [20, 22, 24, 23, 27, 29, 30, 34, 36, 38, 42, 46]], { labels: ['Aug', 'Sep', 'Oct', 'Nov'], yLabels: ['50k', '36k', '24k', '12k', '0'], grid: 4 });
  s += R(x0 + 392, 330, 112, 44, C.ink, { r: 9 }) + T(x0 + 404, 348, 'Week 46', { s: 10, f: '#b6c4d3' }) + T(x0 + 404, 366, '12,840 clicks', { s: 12, w: 700, f: '#fff' });
  // page speed
  const gx = x0 + 572, gw = cw - 572;
  s += card(gx, 268, gw, 236, { title: 'Page speed' }) + pill(gx + gw - 16, 282, 'Mobile', C.primary, { s: 10, a: 'end' });
  s += gauge(gx + gw / 2, 410, 84, 16, 94, C.green, { label: '94', sub: 'Performance score' });
  [['LCP', '1.8s'], ['CLS', '0.02'], ['INP', '120ms']].forEach(([a, b], i) => {
    const x = gx + 24 + i * ((gw - 48) / 3);
    s += Ci(x + 4, 458, 4, C.green) + T(x + 13, 462, a, { s: 10.5, f: C.grey }) + T(x + 13, 480, b, { s: 13, w: 700 });
  });
  // keyword table
  s += card(x0, 518, 560, 216, { title: 'Keyword rankings', action: 'All keywords' });
  s += table(x0 + 8, 552, 544, [{ label: 'KEYWORD', w: 230 }, { label: 'POSITION', w: 90 }, { label: 'CHANGE', w: 100 }, { label: 'VOLUME', w: 124, align: 'end' }], [
    ['cloud erp software', { text: '3', w: 700, color: C.ink }, { arrow: 'up', text: '2' }, '6,600'],
    ['inventory management system', { text: '5', w: 700, color: C.ink }, { arrow: 'up', text: '4' }, '12,100'],
    ['pos software for retail', { text: '7', w: 700, color: C.ink }, { arrow: 'down', text: '1' }, '4,400'],
    ['custom crm development', { text: '2', w: 700, color: C.ink }, { arrow: 'up', text: '1' }, '1,900'],
  ], { rowH: 36, headH: 28, s: 12 });
  // snippet
  s += card(gx, 518, gw, 216, { title: 'Search preview' });
  s += R(gx + 16, 560, gw - 32, 30, '#fff', { r: 15, stroke: C.border }) + icon('search', gx + 28, 567, C.mute) + T(gx + 52, 580, 'cloud erp software', { s: 12, f: C.slate });
  s += Ci(gx + 30, 614, 10, url('brand')) + T(gx + 30, 617.5, 'VQ', { s: 7.5, w: 800, f: '#fff', a: 'middle' });
  s += T(gx + 48, 612, 'VQBYTE', { s: 11, w: 600, f: C.ink }) + T(gx + 48, 626, 'vqbyte.com › services › erp', { s: 10, f: C.grey });
  s += T(gx + 18, 650, 'Cloud ERP Software for Growing Teams', { s: 13, w: 600, f: '#1a56b8' });
  s += T(gx + 18, 668, 'Finance, inventory, sales and HR in one', { s: 11, f: C.grey }) + T(gx + 18, 683, 'platform. Book a free demo today.', { s: 11, f: C.grey });
  for (let i = 0; i < 5; i++) s += el('path', { d: ICONS.star, fill: C.amber, transform: `translate(${gx + 18 + i * 15},${696}) scale(0.8)` });
  s += T(gx + 98, 707, '4.9 · 128 reviews', { s: 10.5, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 8. Digital marketing                                                */
/* ------------------------------------------------------------------ */
function digitalMarketing() {
  let s = uiBackdrop();
  const wx = 50, wy = 50, ww = 1100, wh = 700;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'growth.vqbyte.com/campaigns' });
  s += sidebar(wx, wy + 40, 180, wh - 40, ['Overview', 'Campaigns', 'Audiences', 'Content', 'Email', 'Reports'], 1, { brand: 'VQ Growth', icons: ['grid', 'megaphone', 'users', 'doc', 'mail', 'chart'] });
  const x0 = 254, cw = 872, right = x0 + cw;
  s += T(x0, 128, 'Campaign performance', { s: 22, w: 700 }) + T(x0, 148, 'Q4 growth campaign · 6 channels', { s: 12, f: C.grey });
  s += pill(right - 170, 116, '● Live', C.green, { s: 11, h: 26 }) + button(right - 104, 112, 104, 34, 'New', { ic: 'plus', r: 9 });
  // funnel
  const fy = 162;
  s += card(x0, fy, 430, 290, { title: 'Conversion funnel', sub: 'Last 30 days' });
  const widths = [300, 236, 172, 108, 64];
  const cols = [C.deep, C.primary, C.cyan, tint(C.cyan, 0.45)];
  const vals = ['1.2M', '86.4k', '4,820', '612'];
  const names = [['Impressions', 'Total reach'], ['Clicks', '7.2% click-through'], ['Leads', '5.6% to lead'], ['Customers', '12.7% close rate']];
  const fcx = x0 + 168;
  for (let i = 0; i < 4; i++) {
    const y = fy + 50 + i * 58, a = widths[i] / 2, b = widths[i + 1] / 2;
    s += Pa(`M${fcx - a},${y}H${fcx + a}L${fcx + b},${y + 52}H${fcx - b}Z`, cols[i]);
    s += T(fcx, y + 31, vals[i], { s: 15, w: 800, f: i === 3 ? C.deep : '#fff', a: 'middle' });
    s += T(x0 + 330, y + 22, names[i][0], { s: 12, w: 700 }) + T(x0 + 330, y + 38, names[i][1], { s: 10, f: C.grey });
  }
  // channel bars
  const bx = x0 + 442;
  s += card(bx, fy, 430, 290, { title: 'Leads by channel', action: 'Details' });
  const chv = [1840, 1260, 920, 480, 320];
  s += barChart(bx + 30, fy + 74, 370, 168, chv, { colors: [C.primary, tint(C.primary, 0.62)], highlight: 0, labels: ['Search', 'Social', 'Email', 'Display', 'Referral'], max: 2100, grid: 4, gap: 0.45, r: 6 });
  chv.forEach((v, i) => { const h = (v / 2100) * 168; s += T(bx + 30 + 37 + i * 74, fy + 74 + 168 - h - 8, v.toLocaleString('en-US'), { s: 11, w: 700, a: 'middle', f: i === 0 ? C.primary : C.slate }); });
  // social post
  const ry = 466;
  s += card(x0, ry, 280, 268);
  s += R(x0 + 16, ry + 16, 34, 34, url('brand'), { r: 17 }) + T(x0 + 33, ry + 37, 'VQ', { s: 11, w: 800, f: '#fff', a: 'middle' });
  s += T(x0 + 58, ry + 31, 'VQBYTE', { s: 12.5, w: 700 }) + T(x0 + 58, ry + 46, 'Sponsored · 2h', { s: 10, f: C.grey });
  s += T(x0 + 16, ry + 72, 'Run your whole business on one platform.', { s: 11, f: C.slate });
  const [cp, cid] = clipRect(x0 + 16, ry + 84, 248, 118, 10);
  let img = R(x0 + 16, ry + 84, 248, 118, url('brand')) + Ci(x0 + 240, ry + 90, 60, '#fff', { op: 0.12 }) + Ci(x0 + 30, ry + 200, 50, '#fff', { op: 0.1 });
  img += R(x0 + 120, ry + 100, 128, 84, '#fff', { r: 8 }) + barChart(x0 + 132, ry + 118, 104, 54, [3, 5, 4, 7, 6, 9], { colors: [C.primary, C.cyan], r: 2, base: false });
  img += T(x0 + 30, ry + 124, 'Grow', { s: 18, w: 800, f: '#fff' }) + T(x0 + 30, ry + 146, 'smarter', { s: 18, w: 800, f: '#fff' }) + R(x0 + 30, ry + 160, 60, 20, '#fff', { r: 10 }) + T(x0 + 60, ry + 174, 'Try free', { s: 9.5, w: 700, f: C.primary, a: 'middle' });
  s += cp + G(img, { clip: cid });
  s += icon('heart', x0 + 18, ry + 216, C.coral) + T(x0 + 40, ry + 228, '1.2k', { s: 11, w: 600, f: C.slate });
  s += icon('chat', x0 + 88, ry + 216, C.grey) + T(x0 + 110, ry + 228, '86', { s: 11, w: 600, f: C.slate });
  s += icon('send', x0 + 146, ry + 216, C.grey) + T(x0 + 168, ry + 228, '214', { s: 11, w: 600, f: C.slate });
  s += pill(x0 + 264, ry + 214, 'CTR 4.8%', C.green, { s: 10, a: 'end' });
  s += L(x0 + 16, ry + 244, x0 + 264, ry + 244, C.line, 1) + T(x0 + 16, ry + 260, 'Reach 48.6k · Spend $820', { s: 10, f: C.grey });
  // email
  const ex = x0 + 292;
  s += card(ex, ry, 300, 268, { title: 'Email campaign' }) + pill(ex + 284, ry + 14, 'Sent', C.green, { s: 10, a: 'end' });
  s += R(ex + 16, ry + 44, 268, 54, C.soft, { r: 10 }) + iconTile('mail', ex + 26, ry + 55, C.primary, 32);
  s += T(ex + 68, ry + 67, 'November newsletter', { s: 12.5, w: 700 }) + T(ex + 68, ry + 84, 'Sent to 12,480 contacts', { s: 10.5, f: C.grey });
  [['Delivered', 98.6, C.primary], ['Open rate', 42.3, C.cyan], ['Click rate', 8.6, C.amber]].forEach(([n, v, c], i) => {
    const y = ry + 128 + i * 44;
    s += T(ex + 18, y, n, { s: 11.5, f: C.slate, w: 500 }) + T(ex + 282, y, `${v}%`, { s: 12, w: 700, a: 'end' }) + progress(ex + 18, y + 10, 264, Math.max(v, 4), c, { h: 7 });
  });
  // ROAS
  const qx = x0 + 604, qw = cw - 604;
  s += card(qx, ry, qw, 268, { title: 'Return on ad spend' });
  s += T(qx + 18, ry + 86, '4.6x', { s: 36, w: 800 }) + pill(qx + 110, ry + 62, '+0.8x', C.green, { s: 10.5 });
  s += lineChart(qx + 18, ry + 104, qw - 36, 70, [[2.8, 3.1, 3.0, 3.6, 3.4, 4.0, 4.2, 4.6]], { grid: 0, dots: true, min: 2 });
  s += T(qx + 18, ry + 206, 'Budget used', { s: 11, f: C.grey }) + T(qx + qw - 18, ry + 206, '68%', { s: 11, w: 700, a: 'end' });
  s += progress(qx + 18, ry + 216, qw - 36, 68, C.violet, { h: 7 }) + T(qx + 18, ry + 246, '$6,800 of $10,000', { s: 10.5, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 9. Custom software                                                  */
/* ------------------------------------------------------------------ */
function customSoftware() {
  const extra = `<marker id="${id('arrow')}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1L9,5L0,9z" fill="${C.primary}"/></marker>`;
  let s = uiBackdrop({ dots: [[20, 20, 220, 120], [960, 680, 220, 110]] });
  // editor
  const ex = 40, ey = 80, ew = 640, eh = 600;
  s += windowChrome(ex, ey, ew, eh, { dark: true, urlText: null });
  s += T(ex + ew / 2, ey + 25, 'orders-service — VQ Studio', { s: 11, f: C.mute, a: 'middle' });
  s += Pa(rrPath(ex + 1, ey + 41, 160, eh - 42, [0, 0, 0, 15]), '#0b1626');
  s += T(ex + 18, ey + 66, 'EXPLORER', { s: 9.5, w: 700, f: '#6b7f99', ls: 1 });
  const tree = [[0, 'src', 'f'], [1, 'api', 'f'], [2, 'orders.ts', 'ts', 1], [2, 'billing.ts', 'ts'], [2, 'auth.ts', 'ts'], [1, 'db', 'f'], [2, 'schema.sql', 'sql'], [1, 'web', 'f'], [1, 'mobile', 'f'], [0, 'tests', 'f'], [0, 'package.json', 'js']];
  tree.forEach(([lv, n, t, on], i) => {
    const y = ey + 84 + i * 26;
    if (on) s += R(ex + 6, y - 2, 148, 24, '#16304f', { r: 6 });
    const x = ex + 18 + lv * 14;
    s += t === 'f' ? Pa(`M${x},${y + 6}h6l2,2h8v10h-16z`, C.amber, { op: 0.85 }) : R(x + 2, y + 5, 12, 14, t === 'ts' ? C.cyan : t === 'sql' ? C.green : C.amber, { r: 2, op: 0.85 });
    s += T(x + 22, y + 15, n, { s: 11.5, f: on ? '#fff' : '#a9b8c9', w: on ? 600 : 400 });
  });
  // tabs
  const cx = ex + 161;
  s += R(cx, ey + 41, ew - 161, 32, '#0b1626') + R(cx, ey + 41, 120, 32, '#0f1b2e') + R(cx, ey + 41, 120, 2, C.cyan);
  s += R(cx + 14, ey + 52, 10, 11, C.cyan, { r: 2 }) + T(cx + 30, ey + 62, 'orders.ts', { s: 11.5, f: '#fff' }) + T(cx + 140, ey + 62, 'schema.sql', { s: 11.5, f: '#6b7f99' });
  // code
  const kw = tint(C.violet, 0.3), fn = '#5cc8f2', str = '#fbbf6a', id2 = '#cfdae6', cm = '#4f6280', ty = '#6fd39a', pu = '#7d8ea5';
  const code = [
    [[0, 10, cm], [12, 120, cm]],
    [[0, 44, kw], [48, 70, id2], [122, 30, kw], [156, 96, str]],
    [[0, 44, kw], [48, 54, id2], [106, 30, kw], [140, 80, str]],
    [],
    [[0, 44, kw], [48, 34, kw], [86, 58, kw], [148, 92, fn], [244, 40, id2], [288, 60, ty], [352, 10, pu]],
    [[20, 34, kw], [58, 44, id2], [106, 10, pu], [120, 80, fn], [204, 46, id2], [254, 10, pu]],
    [[20, 14, kw], [38, 10, pu], [52, 34, id2], [90, 50, fn], [144, 10, pu]],
    [[40, 34, kw], [78, 70, fn], [152, 120, str]],
    [[20, 10, pu]],
    [[20, 34, kw], [58, 40, id2], [102, 10, pu], [116, 32, kw], [152, 70, fn], [226, 46, id2], [276, 10, pu]],
    [[40, 60, id2], [104, 10, pu], [118, 50, id2], [172, 10, pu]],
    [[40, 74, id2], [118, 10, pu], [132, 88, fn], [224, 20, pu]],
    [[40, 50, id2], [94, 10, pu], [108, 64, str]],
    [[20, 10, pu], [34, 10, pu]],
    [[20, 46, kw], [70, 80, fn], [154, 40, id2], [198, 10, pu]],
    [[20, 46, kw], [70, 40, id2]],
    [[0, 10, pu]],
  ];
  code.forEach((ln, i) => {
    const y = ey + 92 + i * 22;
    if (i === 9) s += R(cx, y - 8, ew - 161, 24, '#132640');
    s += T(cx + 30, y + 8, String(i + 1), { s: 10.5, f: i === 9 ? '#a9b8c9' : '#3f526c', a: 'end' });
    for (const [x, w, c] of ln) s += R(cx + 46 + x, y, w, 8, c, { r: 4 });
    if (i === 9) s += R(cx + 46 + 282, y - 4, 2, 16, '#fff');
  });
  // terminal
  const ty2 = ey + eh - 136;
  s += R(cx, ty2, ew - 162, 1, '#1e2d45') + T(cx + 18, ty2 + 24, 'TERMINAL', { s: 9.5, w: 700, f: '#6b7f99', ls: 1 }) + T(cx + 100, ty2 + 24, 'PROBLEMS', { s: 9.5, w: 600, f: '#3f526c', ls: 1 });
  s += T(cx + 18, ty2 + 52, '$ npm run test && npm run deploy', { s: 11.5, f: '#a9b8c9' });
  s += icon('check', cx + 18, ty2 + 64, C.green, 14, 2.4) + T(cx + 40, ty2 + 76, '128 tests passed', { s: 11.5, w: 600, f: '#6fd39a' });
  s += icon('send', cx + 18, ty2 + 88, C.cyan, 14) + T(cx + 40, ty2 + 100, 'Deployed to staging in 42s', { s: 11.5, f: '#5cc8f2' });
  // status bar
  s += Pa(rrPath(cx, ey + eh - 24, ew - 161, 24, [0, 0, 15, 0]), C.primary) + T(cx + 14, ey + eh - 8, 'main  ·  TypeScript  ·  Ln 10, Col 42', { s: 10, f: '#fff' });

  // architecture
  s += R(705, 70, 465, 660, '#fff', { r: 22, op: 0.75, stroke: C.border, dash: '6 6' });
  s += pill(725, 88, 'System architecture', C.primary, { s: 11, h: 26 });
  const node = (x, y, w, label, sub, ic, col) => R(x, y, w, 58, '#fff', { r: 14, sh: true }) + iconTile(ic, x + 12, y + 12, col, 34) + T(x + 56, y + 27, label, { s: 13, w: 700 }) + T(x + 56, y + 43, sub, { s: 10, f: C.grey });
  const link = (x1, y1, x2, y2) => {
    const my = (y1 + y2) / 2;
    return el('path', { d: `M${x1},${y1}C${x1},${my} ${x2},${my} ${x2},${y2}`, fill: 'none', stroke: C.primary, 'stroke-width': 2, opacity: 0.55, 'marker-end': url('arrow') })
      + Ci((x1 + x2) / 2, my, 5, C.cyan, { stroke: '#fff', sw: 2 });
  };
  s += link(805, 208, 900, 296) + link(1035, 208, 960, 296);
  s += link(900, 356, 785, 446) + link(930, 356, 930, 446) + link(960, 356, 1075, 446);
  s += link(785, 506, 790, 592) + link(930, 506, 815, 592) + link(1075, 506, 1040, 600);
  s += node(730, 150, 150, 'Web app', 'Customer portal', 'globe', C.primary) + node(960, 150, 150, 'Mobile app', 'iOS & Android', 'mobile', C.violet);
  s += node(835, 298, 190, 'API gateway', 'REST · Auth · Rate limits', 'link', C.deep);
  s += node(715, 448, 140, 'Orders', 'Service', 'box', C.amber) + node(860, 448, 140, 'Billing', 'Service', 'coin', C.green) + node(1005, 448, 140, 'Identity', 'Service', 'lock', C.coral);
  s += dbCylinder(800, 610, 96, 64, {}) + T(800, 708, 'Database', { s: 12, w: 700, a: 'middle' });
  s += node(960, 602, 170, 'Event queue', 'Async jobs', 'flow', C.cyan);
  return [s, extra];
}

/* ------------------------------------------------------------------ */
/* 10. Mobile apps                                                     */
/* ------------------------------------------------------------------ */
function statusBar(sx, sy, sw, dark = false) {
  const c = dark ? '#fff' : C.ink;
  let s = T(sx + 22, sy + 26, '9:41', { s: 11, w: 700, f: c });
  for (let i = 0; i < 3; i++) s += R(sx + sw - 40 + i * 6, sy + 22 - i * 3, 4, 6 + i * 3, c, { r: 1 });
  return s;
}
function tabBar(sx, sy, sw, sh, active = 0, icons = ['home', 'box', 'pin', 'user']) {
  const y = sy + sh - 48;
  let s = L(sx + 10, y, sx + sw - 10, y, C.line, 1);
  icons.forEach((ic, i) => { const ix = sx + sw / 8 + (i * sw) / 4; s += icon(ic, ix - 9, y + 14, i === active ? C.primary : C.mute, 18); if (i === active) s += Ci(ix, y + 40, 2.5, C.primary); });
  return s;
}
function mobileApps() {
  let s = uiBackdrop({ dots: [[20, 20, 220, 140], [960, 640, 220, 140]] });
  s += Ci(600, 430, 330, C.bg2) + Ci(600, 430, 260, '#fff', { op: 0.5 }) + Ci(600, 430, 380, null, { stroke: tint(C.primary, 0.75), sw: 1.5, dash: '4 8' });
  // left: orders
  {
    const ph = phone(150, 180, 250, 520);
    let c = ph.svg + ph.notch;
    const { sx, sy, sw, sh } = ph;
    c += statusBar(sx, sy, sw) + T(sx + 18, sy + 64, 'My orders', { s: 18, w: 800 }) + Ci(sx + sw - 30, sy + 58, 14, C.soft) + icon('search', sx + sw - 37, sy + 51, C.slate, 14);
    c += R(sx + 14, sy + 78, sw - 28, 32, C.soft, { r: 16 }) + R(sx + 17, sy + 81, (sw - 28) / 2 - 3, 26, '#fff', { r: 13 });
    c += T(sx + 14 + (sw - 28) / 4, sy + 98, 'Active', { s: 11.5, w: 700, a: 'middle' }) + T(sx + 14 + (sw - 28) * 0.75, sy + 98, 'History', { s: 11.5, f: C.grey, a: 'middle' });
    [['#2841', '3 items · $48.20', 'On the way', C.primary, 'truck'], ['#2839', '1 item · $12.90', 'Preparing', C.amber, 'box'], ['#2817', '5 items · $86.40', 'Delivered', C.green, 'check'], ['#2802', '2 items · $24.10', 'Delivered', C.green, 'check']].forEach(([n, d, st, col, ic], i) => {
      const y = sy + 124 + i * 78;
      c += R(sx + 14, y, sw - 28, 68, i === 0 ? '#fff' : C.soft, { r: 14, stroke: i === 0 ? tint(C.primary, 0.6) : undefined });
      c += iconTile(ic, sx + 24, y + 16, col, 36) + T(sx + 70, y + 30, `Order ${n}`.replace('Order ', ''), { s: 12.5, w: 700 }) + T(sx + 70, y + 47, d, { s: 10.5, f: C.grey });
      c += pill(sx + sw - 22, y + 10, st, col, { s: 9, a: 'end', h: 18 });
    });
    c += tabBar(sx, sy, sw, sh, 1);
    s += G(c, { t: 'rotate(-7 275 440)' });
  }
  // right: profile
  {
    const ph = phone(800, 180, 250, 520);
    let c = ph.svg;
    const { sx, sy, sw, sh } = ph;
    const [cp, cid] = clipRect(sx, sy, sw, sh, 30);
    c += cp + G(R(sx, sy, sw, 150, url('brand')) + Ci(sx + sw, sy + 20, 80, '#fff', { op: 0.1 }) + Ci(sx, sy + 150, 60, '#fff', { op: 0.08 }), { clip: cid });
    c += ph.notch + statusBar(sx, sy, sw, true) + T(sx + sw / 2, sy + 62, 'Profile', { s: 13, w: 700, f: '#fff', a: 'middle' });
    c += Ci(sx + sw / 2, sy + 130, 40, '#fff') + avatar(sx + sw / 2, sy + 130, 35, SKIN[0], HAIR[1], C.violet, { style: 'long' });
    c += T(sx + sw / 2, sy + 192, 'Maya Chen', { s: 16, w: 800, a: 'middle' });
    c += pill(sx + sw / 2 - pillW('Gold member', 10) / 2, sy + 202, 'Gold member', C.amber, { s: 10 });
    [['48', 'Orders'], ['1,260', 'Points'], ['$86', 'Saved']].forEach(([v, l], i) => {
      const x = sx + 14 + (i + 0.5) * ((sw - 28) / 3);
      c += T(x, sy + 254, v, { s: 15, w: 800, a: 'middle' }) + T(x, sy + 270, l, { s: 10, f: C.grey, a: 'middle' });
    });
    c += R(sx + 14, sy + 232, sw - 28, 50, null, { r: 12, stroke: C.line });
    [['Addresses', 'pin'], ['Payment methods', 'card'], ['Notifications', 'bell'], ['Help center', 'chat']].forEach(([n, ic], i) => {
      const y = sy + 296 + i * 40;
      c += iconTile(ic, sx + 16, y + 4, [C.primary, C.green, C.amber, C.violet][i], 28) + T(sx + 54, y + 22, n, { s: 12, w: 500 });
      if (i === 2) c += R(sx + sw - 50, y + 9, 34, 18, C.green, { r: 9 }) + Ci(sx + sw - 25, y + 18, 7, '#fff');
      else c += Pa(`M${sx + sw - 28},${y + 12}l5,6-5,6`, null, { stroke: C.mute, sw: 2 });
    });
    c += tabBar(sx, sy, sw, sh, 3);
    s += G(c, { t: 'rotate(7 925 440)' });
  }
  // center: tracking
  {
    const ph = phone(465, 90, 270, 600);
    let c = ph.svg;
    const { sx, sy, sw, sh } = ph;
    const mh = sh * 0.6;
    const [cp, cid] = clipRect(sx, sy, sw, sh, 32);
    c += cp + G(routeMap(sx, sy, sw, mh, { pins: false, clipR: 0 }), { clip: cid });
    c += mapPin(sx + sw * 0.82, sy + mh * 0.24, C.coral, 0.75);
    c += Ci(sx + sw * 0.45, sy + mh * 0.32, 17, C.primary, { stroke: '#fff', sw: 3, sh: true }) + icon('truck', sx + sw * 0.45 - 8, sy + mh * 0.32 - 8, '#fff', 16);
    c += ph.notch + statusBar(sx, sy, sw);
    c += Ci(sx + 30, sy + 62, 16, '#fff', { sh: true }) + Pa(`M${sx + 33},${sy + 55}l-7,7 7,7`, null, { stroke: C.ink, sw: 2.2 });
    c += R(sx + 56, sy + 48, 130, 28, '#fff', { r: 14, sh: true }) + T(sx + 121, sy + 67, 'Track order', { s: 12, w: 700, a: 'middle' });
    const by = sy + mh - 30;
    c += Pa(rrPath(sx, by, sw, sh - mh + 30, [26, 26, 30, 30]), '#fff', { sh: true });
    c += R(sx + sw / 2 - 20, by + 10, 40, 4, C.border, { r: 2 });
    c += T(sx + 20, by + 42, 'Arriving in', { s: 11, f: C.grey }) + T(sx + 20, by + 72, '12 min', { s: 26, w: 800 }) + pill(sx + sw - 20, by + 50, 'On time', C.green, { s: 10, a: 'end' });
    const st = ['Confirmed', 'Picked up', 'On the way', 'Delivered'];
    const lx = sx + 30, lw = sw - 60;
    c += L(lx, by + 98, lx + lw, by + 98, C.line, 4) + L(lx, by + 98, lx + lw * (2 / 3), by + 98, C.primary, 4);
    st.forEach((t, i) => {
      const x = lx + (lw * i) / 3; const done = i <= 2;
      c += Ci(x, by + 98, i === 2 ? 8 : 6, done ? C.primary : '#fff', { stroke: done ? '#fff' : C.border, sw: 2 });
      c += T(x, by + 120, t, { s: 9, f: i === 2 ? C.primary : C.grey, w: i === 2 ? 700 : 400, a: 'middle' });
    });
    const dy = by + 136;
    c += R(sx + 14, dy, sw - 28, 60, C.soft, { r: 14 }) + avatar(sx + 40, dy + 30, 18, SKIN[2], HAIR[0], C.primary);
    c += T(sx + 66, dy + 26, 'Ali Rahman', { s: 12.5, w: 700 }) + el('path', { d: ICONS.star, fill: C.amber, transform: `translate(${sx + 66},${dy + 33}) scale(0.7)` }) + T(sx + 80, dy + 44, '4.9 · Courier', { s: 10, f: C.grey });
    c += Ci(sx + sw - 74, dy + 30, 15, '#fff', { stroke: C.border }) + icon('chat', sx + sw - 81, dy + 23, C.primary, 14);
    c += Ci(sx + sw - 38, dy + 30, 15, C.green) + icon('mobile', sx + sw - 45, dy + 23, '#fff', 14);
    s += c;
  }
  // chips
  s += R(40, 70, 300, 62, '#fff', { r: 16, sh: true }) + iconTile('bell', 56, 85, C.primary, 32) + T(100, 97, 'Out for delivery', { s: 13, w: 700 }) + T(100, 114, 'Order #2841 · arriving 10:24', { s: 11, f: C.grey });
  s += R(900, 712, 240, 58, '#fff', { r: 16, sh: true });
  for (let i = 0; i < 5; i++) s += el('path', { d: ICONS.star, fill: C.amber, transform: `translate(${918 + i * 18},${724})` });
  s += T(1010, 737, '4.8', { s: 15, w: 800 }) + T(918, 758, 'Average app rating', { s: 11, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 11. Integrations                                                    */
/* ------------------------------------------------------------------ */
function integrations() {
  let s = uiBackdrop({ dots: [[20, 20, 240, 160], [940, 620, 240, 160]] });
  const hx = 600, hy = 410;
  s += Ci(hx, hy, 220, '#fff', { op: 0.45 }) + Ci(hx, hy, 150, null, { stroke: tint(C.primary, 0.7), sw: 1.5, dash: '4 7' });
  const nodes = [['ERP', 'Finance & ops', 'grid', C.primary], ['CRM', 'Leads & deals', 'users', C.violet], ['E-commerce', 'Online store', 'cart', C.cyan], ['Payments', 'Cards & wallets', 'card', C.green], ['Accounting', 'Ledger & tax', 'coin', C.amber], ['Messaging', 'SMS & chat', 'chat', C.coral], ['Warehouse', 'Stock & bins', 'box', C.deep]];
  const pos = nodes.map((_, i) => { const a = (-90 + (i * 360) / 7) * Math.PI / 180; return [hx + 410 * Math.cos(a), hy + 275 * Math.sin(a)]; });
  let lines = '', dots = '';
  pos.forEach(([x, y], i) => {
    const mx = (hx + x) / 2, my = (hy + y) / 2; const dx = x - hx, dy = y - hy; const len = Math.hypot(dx, dy);
    const cx = mx + (-dy / len) * 46, cy = my + (dx / len) * 46;
    const d = `M${hx},${hy}Q${r1(cx)},${r1(cy)} ${r1(x)},${r1(y)}`;
    lines += Pa(d, null, { stroke: tint(C.primary, 0.55), sw: 2.5, op: 0.9 });
    lines += el('path', { d, fill: 'none', stroke: nodes[i][3], 'stroke-width': 2.5, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round' },
      `<animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.4s" repeatCount="indefinite"/>`);
    for (const t of [0.45, 0.7]) {
      const bx = (1 - t) ** 2 * hx + 2 * (1 - t) * t * cx + t * t * x, by = (1 - t) ** 2 * hy + 2 * (1 - t) * t * cy + t * t * y;
      dots += Ci(bx, by, t === 0.45 ? 6 : 4.5, nodes[i][3], { stroke: '#fff', sw: 2 });
    }
  });
  s += lines + dots;
  // hub
  s += Ci(hx, hy, 104, tint(C.cyan, 0.85)) + Ci(hx, hy, 80, url('brand'), { sh: true }) + Ci(hx, hy, 80, null, { stroke: '#fff', sw: 3, op: 0.5 });
  s += T(hx, hy + 6, 'VQ', { s: 40, w: 800, f: '#fff', a: 'middle' }) + T(hx, hy + 30, 'Connect', { s: 13, w: 600, f: '#fff', a: 'middle', op: 0.9 });
  s += R(hx - 64, hy + 116, 128, 28, '#fff', { r: 14, sh: true }) + Ci(hx - 46, hy + 130, 4, C.green) + T(hx + 6, hy + 134.5, 'Real-time sync', { s: 11.5, w: 600, a: 'middle' });
  // nodes
  pos.forEach(([x, y], i) => {
    const [n, sub, ic, col] = nodes[i];
    s += R(x - 88, y - 32, 176, 64, '#fff', { r: 16, sh: true }) + iconTile(ic, x - 74, y - 18, col, 36);
    s += T(x - 28, y - 2, n, { s: 14, w: 700 }) + T(x - 28, y + 15, sub, { s: 10.5, f: C.grey });
  });
  // status card
  s += R(36, 650, 290, 120, '#fff', { r: 16, sh: true }) + T(56, 680, 'Sync health', { s: 13, w: 700 }) + T(306, 681, '99.98%', { s: 15, w: 800, f: C.green, a: 'end' });
  [['Order #5531 → Accounting', '2s ago'], ['Payment captured → ERP', '5s ago'], ['Stock update → E-commerce', '9s ago']].forEach(([a, b], i) => {
    const y = 706 + i * 21;
    s += icon('check', 56, y - 10, C.green, 12, 2.4) + T(76, y, a, { s: 11, f: C.slate }) + T(306, y, b, { s: 10, f: C.mute, a: 'end' });
  });
  s += R(890, 40, 270, 76, '#fff', { r: 16, sh: true }) + iconTile('flow', 908, 62, C.primary, 32) + T(952, 72, '12,480 events today', { s: 13, w: 700 }) + T(952, 90, 'Webhooks · REST API · Files', { s: 11, f: C.grey });
  return s;
}

/* ------------------------------------------------------------------ */
/* 12. Web development                                                 */
/* ------------------------------------------------------------------ */
function webDevelopment() {
  let s = uiBackdrop({ dots: [[960, 20, 220, 120], [20, 680, 220, 100]] });
  const bx = 40, by = 70, bw = 840, bh = 610;
  s += windowChrome(bx, by, bw, bh, { urlText: 'lumen-co.example' });
  const x = bx + 30;
  // nav
  s += R(x, by + 58, 28, 28, url('brand'), { r: 8 }) + Pa(`M${x + 8},${by + 66}l6,12 6,-12`, null, { stroke: '#fff', sw: 2.4 }) + T(x + 38, by + 77, 'Lumen & Co.', { s: 14, w: 800 });
  let nx = x + 340;
  ['Services', 'Industries', 'About', 'Contact'].forEach((t) => { s += T(nx, by + 77, t, { s: 12, w: 500, f: C.slate }); nx += tw(t, 12, 0.58) + 34; });
  s += button(bx + bw - 140, by + 56, 110, 32, 'Get a quote', { s: 12, r: 9 });
  // hero
  s += R(bx + 1, by + 104, bw - 2, 290, url('bg'));
  s += pill(x, by + 130, 'New · Cloud platform 2.0', C.primary, { s: 10.5 });
  s += T(x, by + 186, 'Software that runs', { s: 32, w: 800 }) + T(x, by + 224, 'your whole business', { s: 32, w: 800, f: C.primary });
  s += T(x, by + 256, 'Cloud ERP, CRM and apps built around', { s: 13, f: C.grey }) + T(x, by + 275, 'the way your team actually works.', { s: 13, f: C.grey });
  s += button(x, by + 298, 132, 40, 'Book a demo', { s: 13, r: 10 }) + button(x + 144, by + 298, 120, 40, 'See pricing', { s: 13, r: 10, fill: '#fff', color: C.ink, stroke: C.border });
  s += T(x, by + 368, '250+ clients  ·  99.9% uptime  ·  24/7 support', { s: 11, w: 600, f: C.slate });
  // hero image
  s += R(bx + 430, by + 126, 290, 196, '#fff', { r: 14, sh: true });
  s += miniDash(bx + 440, by + 136, 270, 176);
  s += R(bx + 384, by + 268, 150, 84, '#fff', { r: 14, sh: true }) + T(bx + 400, by + 292, 'Conversions', { s: 11, f: C.grey }) + T(bx + 400, by + 314, '+38%', { s: 18, w: 800, f: C.green });
  s += sparkline(bx + 400, by + 320, 118, 20, [2, 3, 2.6, 4, 3.6, 5, 6], C.green);
  // features
  [['Fast setup', 'Go live in weeks with', 'guided onboarding.', 'trend', C.primary], ['Secure cloud', 'Encrypted, backed up and', 'monitored around the clock.', 'shield', C.green], ['Real support', 'A named team that knows', 'your business.', 'users', C.violet]].forEach(([t, a, b, ic, col], i) => {
    const fx = x + i * 258;
    s += R(fx, by + 414, 240, 130, '#fff', { r: 14, stroke: C.border }) + iconTile(ic, fx + 18, by + 432, col, 36);
    s += T(fx + 18, by + 492, t, { s: 14, w: 700 }) + T(fx + 18, by + 512, a, { s: 11, f: C.grey }) + T(fx + 18, by + 528, b, { s: 11, f: C.grey });
  });
  s += Pa(rrPath(bx + 1, by + 562, bw - 2, bh - 563, [0, 0, 15, 15]), C.ink);
  s += tline(x, by + 584, 90, '#2a3a52') + tline(x + 200, by + 584, 60, '#2a3a52') + tline(x + 300, by + 584, 70, '#2a3a52') + tline(x + 410, by + 584, 50, '#2a3a52');
  // tablet
  {
    const tb = tabletFrame(760, 236, 290, 430, { bezel: 14 });
    s += tb.svg;
    const { sx, sy, sw } = tb;
    s += R(sx + 14, sy + 14, 22, 22, url('brand'), { r: 6 }) + T(sx + 44, sy + 30, 'Lumen & Co.', { s: 11, w: 800 });
    for (let i = 0; i < 3; i++) s += R(sx + sw - 34, sy + 18 + i * 6, 18, 2.5, C.ink, { r: 1 });
    s += R(sx, sy + 50, sw, 170, url('bg'));
    s += T(sx + 16, sy + 84, 'Software that runs', { s: 18, w: 800 }) + T(sx + 16, sy + 106, 'your whole business', { s: 18, w: 800, f: C.primary });
    s += tline(sx + 16, sy + 120, 190, C.border, 6) + tline(sx + 16, sy + 132, 150, C.border, 6);
    s += button(sx + 16, sy + 150, 104, 30, 'Book a demo', { s: 11, r: 8 });
    s += R(sx + 16, sy + 196, sw - 32, 110, '#fff', { r: 10, sh: true }) + miniDash(sx + 24, sy + 204, sw - 48, 94, { variant: 1 });
    for (let i = 0; i < 2; i++) {
      const cx = sx + 16 + i * ((sw - 40) / 2 + 8);
      s += R(cx, sy + 320, (sw - 40) / 2, 66, '#fff', { r: 10, stroke: C.border }) + iconTile(['trend', 'shield'][i], cx + 10, sy + 330, [C.primary, C.green][i], 24) + tline(cx + 10, sy + 364, 70, C.border, 6) + tline(cx + 10, sy + 375, 50, C.line, 5);
    }
  }
  // phone
  {
    const ph = phone(1010, 360, 160, 330);
    s += ph.svg;
    const { sx, sy, sw } = ph;
    s += R(sx + 10, sy + 34, 16, 16, url('brand'), { r: 5 });
    for (let i = 0; i < 3; i++) s += R(sx + sw - 26, sy + 36 + i * 5, 14, 2.2, C.ink, { r: 1 });
    s += R(sx, sy + 58, sw, 110, url('bg'));
    s += T(sx + 10, sy + 84, 'Software that', { s: 13, w: 800 }) + T(sx + 10, sy + 100, 'runs your', { s: 13, w: 800 }) + T(sx + 10, sy + 116, 'business', { s: 13, w: 800, f: C.primary });
    s += button(sx + 10, sy + 130, 84, 24, 'Book a demo', { s: 9.5, r: 7 });
    s += R(sx + 10, sy + 180, sw - 20, 76, '#fff', { r: 10, sh: true }) + barChart(sx + 20, sy + 192, sw - 40, 52, [3, 5, 4, 7, 6, 8], { colors: [C.primary, C.cyan], r: 2, base: false });
    s += R(sx + 10, sy + 266, sw - 20, 40, '#fff', { r: 10, stroke: C.border }) + iconTile('trend', sx + 18, sy + 274, C.primary, 24) + tline(sx + 50, sy + 280, 70, C.border, 6) + tline(sx + 50, sy + 292, 50, C.line, 5);
    s += ph.notch;
  }
  // chips
  s += R(900, 120, 250, 64, '#fff', { r: 16, sh: true });
  s += ring(934, 152, 17, 5, 98, C.green) + T(934, 156, '98', { s: 11, w: 800, a: 'middle' });
  s += T(962, 148, 'Performance score', { s: 12.5, w: 700 }) + T(962, 165, 'Fast on every device', { s: 11, f: C.grey });
  s += Ci(1110, 60, 30, url('brand'), { sh: true }) + icon('code', 1098, 48, '#fff', 24, 2);
  return s;
}

/* ------------------------------------------------------------------ */
/* 13. Analytics & reporting                                           */
/* ------------------------------------------------------------------ */
function hexPath(cx, cy, r) {
  let d = '';
  for (let k = 0; k < 6; k++) { const a = ((60 * k - 90) * Math.PI) / 180; d += `${k ? 'L' : 'M'}${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`; }
  return d + 'Z';
}
function analyticsReporting() {
  let s = uiBackdrop();
  const wx = 40, wy = 40, ww = 1120, wh = 720;
  s += windowChrome(wx, wy, ww, wh, { urlText: 'insights.vqbyte.com/executive' });
  const x0 = 64, cw = 1072, right = x0 + cw;
  s += R(x0, 98, 30, 30, url('brand'), { r: 9 }) + icon('chart', x0 + 7, 105, '#fff');
  s += T(x0 + 42, 112, 'Executive report', { s: 18, w: 800 }) + T(x0 + 42, 128, 'VQ Insights · Updated 5 min ago', { s: 11, f: C.grey });
  let px = x0 + 420;
  ['Region: All', 'Period: Q4', 'Compare: Last year'].forEach((t) => { s += pill(px, 102, t, C.grey, { s: 11, h: 26 }); px += pillW(t, 11) + 8; });
  s += button(right - 100, 98, 100, 32, 'Share', { s: 12, r: 9, ic: 'send' });
  const kw = (cw - 48) / 5;
  [
    { label: 'Revenue', value: '$4.82M', delta: '+14%', ic: 'coin', color: C.primary },
    { label: 'Gross margin', value: '38.6%', delta: '+2.1pt', ic: 'trend', color: C.green },
    { label: 'Orders', value: '18,240', delta: '+9%', ic: 'cart', color: C.cyan },
    { label: 'Avg. order value', value: '$264', delta: '-1.2%', up: false, ic: 'chart', color: C.amber },
    { label: 'NPS', value: '62', delta: '+5', ic: 'heart', color: C.violet },
  ].forEach((d, i) => { s += kpi(x0 + i * (kw + 12), 146, kw, 92, d); });
  // line chart
  const ry = 252;
  s += card(x0, ry, 520, 224, { title: 'Revenue vs target' }) + legendDot(x0 + 330, ry + 28, C.cyan, 'Revenue') + legendDot(x0 + 410, ry + 28, C.violet, 'Target');
  s += lineChart(x0 + 46, ry + 50, 456, 132, [[3.1, 3.4, 3.2, 3.8, 4.1, 3.9, 4.4, 4.6, 4.5, 4.9, 5.2, 5.6], [3.2, 3.3, 3.5, 3.6, 3.8, 3.9, 4.1, 4.2, 4.4, 4.5, 4.7, 4.8]], { labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'], yLabels: ['$6M', '$4.5M', '$3M', '$1.5M', '0'], max: 6, min: 0 });
  // hex map
  const mx = x0 + 532, mw = cw - 532;
  s += card(mx, ry, mw, 224, { title: 'Sales by region', action: 'Map view' });
  const seq = [tint(C.cyan, 0.78), tint(C.cyan, 0.55), tint(C.cyan, 0.2), C.primary, C.deep];
  const hr = 10.5, hw = Math.sqrt(3) * hr;
  let k = 3;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) {
    const inside = ((c - 7) / 7.6) ** 2 + ((r - 4) / 4.6) ** 2 < 1 && !(r < 2 && c > 10) && !(r > 7 && c < 4) && !(r === 4 && c === 13);
    if (!inside) continue;
    k = (k * 31 + 7) % 89;
    let v = Math.min(4, Math.floor((k % 5) * 0.5 + (c < 7 ? 1.5 : 0.5) + (r < 4 ? 0.8 : 0)));
    const cx = mx + 36 + c * hw + (r % 2 ? hw / 2 : 0), cy = ry + 60 + r * hr * 1.5;
    s += Pa(hexPath(cx, cy, hr - 1), seq[v]);
  }
  s += Ci(mx + 36 + 4 * hw, ry + 60 + 3 * hr * 1.5, 9, C.amber, { stroke: '#fff', sw: 2.5 }) + Ci(mx + 36 + 9.5 * hw, ry + 60 + 5 * hr * 1.5, 7, C.amber, { stroke: '#fff', sw: 2.5 });
  const lgx = mx + 344;
  [['North', '32%', C.deep], ['Central', '26%', C.primary], ['Coastal', '18%', tint(C.cyan, 0.2)], ['South', '14%', tint(C.cyan, 0.55)], ['East', '10%', tint(C.cyan, 0.78)]].forEach(([n, v, c], i) => {
    const y = ry + 66 + i * 28;
    s += R(lgx, y - 9, 10, 10, c, { r: 3 }) + T(lgx + 18, y, n, { s: 11.5, f: C.slate }) + T(mx + mw - 18, y, v, { s: 11.5, w: 700, a: 'end' }) + progress(lgx + 18, y + 6, mw - 380, parseInt(v, 10) * 3, c, { h: 3 });
  });
  // bottom row
  const by = 490, bh = 246;
  s += card(x0, by, 340, bh, { title: 'Top categories' });
  [['Software licences', 92, C.primary], ['Implementation', 74, C.primary], ['Support plans', 58, C.cyan], ['Hardware', 41, C.cyan], ['Training', 26, tint(C.cyan, 0.4)]].forEach(([n, v, c], i) => {
    const y = by + 62 + i * 36;
    s += T(x0 + 18, y, n, { s: 11.5, f: C.slate }) + T(x0 + 322, y, ['$1.14M', '$918k', '$719k', '$508k', '$322k'][i], { s: 11.5, w: 700, a: 'end' }) + progress(x0 + 18, y + 8, 304, v, c, { h: 8 });
  });
  const dx = x0 + 352;
  s += card(dx, by, 340, bh, { title: 'Revenue mix' });
  s += donut(dx + 100, by + 140, 62, 22, [{ v: 42, color: C.primary }, { v: 24, color: C.cyan }, { v: 18, color: C.amber }, { v: 16, color: C.violet }]);
  s += T(dx + 100, by + 140, '$4.82M', { s: 16, w: 800, a: 'middle' }) + T(dx + 100, by + 156, 'total', { s: 10, f: C.grey, a: 'middle' });
  [['Products', '42%', C.primary], ['Services', '24%', C.cyan], ['Subscriptions', '18%', C.amber], ['Other', '16%', C.violet]].forEach(([n, v, c], i) => {
    const y = by + 100 + i * 28; s += legendDot(dx + 190, y, c, n) + T(dx + 322, y, v, { s: 11.5, w: 700, a: 'end' });
  });
  const hx = dx + 352, hw2 = right - hx;
  s += card(hx, by, hw2, bh, { title: 'Orders by weekday' });
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], slots = ['8am', '11am', '2pm', '5pm', '8pm'];
  const hcol = [C.bg2, tint(C.cyan, 0.7), tint(C.cyan, 0.4), C.cyan, C.primary, C.deep];
  let q = 11;
  slots.forEach((sl, r) => {
    s += T(hx + 46, by + 76 + r * 33, sl, { s: 10, f: C.grey, a: 'end' });
    days.forEach((d, c) => {
      q = (q * 17 + 5) % 53;
      const lvl = Math.max(0, Math.min(5, Math.floor((q % 4) + (r === 1 || r === 2 ? 1.5 : 0) + (c < 5 ? 0.6 : -1.2))));
      s += R(hx + 54 + c * 42, by + 56 + r * 33, 38, 29, hcol[lvl], { r: 6 });
    });
  });
  days.forEach((d, c) => { s += T(hx + 73 + c * 42, by + 236, d, { s: 10, w: 600, f: C.grey, a: 'middle' }); });
  return s;
}

/* ------------------------------------------------------------------ */
/* Extra scene props                                                   */
/* ------------------------------------------------------------------ */
function desk(x, y, w, { legH = 150, top = '#ffffff', leg = '#9fb3c2' } = {}) {
  return R(x + 16, y + 14, 8, legH, leg) + R(x + w - 24, y + 14, 8, legH, leg) + R(x + 40, y + 14, w - 80, 46, '#e3ecf1', { op: 0.9 })
    + R(x, y, w, 16, top, { r: 4 }) + R(x, y + 12, w, 4, '#d3e1ea');
}
function mug(x, y, c = C.primary) { return R(x, y, 18, 22, c, { r: 4 }) + Pa(`M${x + 18},${y + 5}a6,6 0 0 1 0,12`, null, { stroke: c, sw: 3 }); }
function storageTank(x, y, w, h, { label, band = C.primary } = {}) {
  let s = R(x - 6, y + h - 4, w + 12, 12, '#c3d2dc', { r: 4 });
  s += R(x, y, w, h, '#f7fafc') + R(x, y, w * 0.14, h, '#e2ebf1') + R(x + w * 0.78, y, w * 0.22, h, '#e9f0f5');
  s += Pa(`M${x},${y}Q${x + w / 2},${y - w * 0.16} ${x + w},${y}Z`, '#e4edf3');
  s += R(x, y + h * 0.22, w, 12, band) + R(x, y + h * 0.22 + 15, w, 4, band, { op: 0.5 });
  for (let i = 0; i < 5; i++) s += L(x + w * 0.08 + i * w * 0.18, y + h, x + w * 0.2 + i * w * 0.18, y + 4, '#c7d5df', 1.5, { op: 0.8 });
  s += R(x, y, w, h, null, { stroke: '#d3e0e8', sw: 1.5 });
  if (label) s += T(x + w / 2, y + h * 0.62, label, { s: Math.min(22, w * 0.11), w: 800, f: C.deep, a: 'middle' });
  return s;
}
function column(x, y, w, h, { platforms = 3 } = {}) {
  let s = Pa(rrPath(x, y, w, h, [w / 2, w / 2, 0, 0]), '#eef3f7') + R(x + w * 0.66, y + w / 2, w * 0.34, h - w / 2, '#d8e4ec');
  s += R(x + w / 2 - 3, y - 26, 6, 26, '#9fb3c2');
  s += L(x + w + 6, y + 20, x + w + 6, y + h, '#9fb3c2', 2) + L(x + w + 14, y + 20, x + w + 14, y + h, '#9fb3c2', 2);
  for (let yy = y + 30; yy < y + h; yy += 14) s += L(x + w + 6, yy, x + w + 14, yy, '#9fb3c2', 1.5);
  for (let i = 0; i < platforms; i++) {
    const py = y + 50 + (i * (h - 80)) / platforms;
    s += R(x - 12, py, w + 30, 5, C.slate) + L(x - 12, py - 14, x + w + 18, py - 14, C.slate, 1.5) + L(x - 12, py - 14, x - 12, py, C.slate, 1.5) + L(x + w + 18, py - 14, x + w + 18, py, C.slate, 1.5);
  }
  s += R(x - 4, y + h - 6, w + 8, 10, '#c3d2dc', { r: 3 });
  return s;
}
function pipe(x1, y1, x2, y2, c = '#c3d2dc', sw = 12) {
  return L(x1, y1, x2, y2, c, sw, { cap: 'butt' }) + L(x1, y1 - sw * 0.2, x2, y2 - sw * 0.2, '#fff', 2, { cap: 'butt', op: 0.6 });
}
function tree(x, y, s = 1) {
  return G(R(-6, -70, 12, 70, '#8a6a4f', { r: 3 }) + Ci(0, -110, 46, '#22a35a') + Ci(-30, -84, 32, '#1f9d55') + Ci(30, -86, 34, '#16a34a') + Ci(10, -140, 30, '#2bb673'), { t: `translate(${x},${y}) scale(${s})` });
}
function cone(x, y) {
  return Pa(`M${x - 14},${y}L${x - 4},${y - 40}H${x + 4}L${x + 14},${y}Z`, C.coral) + R(x - 10, y - 24, 20, 6, '#fff') + R(x - 20, y - 4, 40, 6, shade(C.coral, 0.2), { r: 2 });
}
function shelfUnit(x, y, w, h, levels = 4, seed = 2) {
  let s = R(x, y, w, h, '#ffffff', { stroke: C.border }) + R(x, y, w, 14, C.deep);
  let k = seed; const rnd = () => { k = (k * 9301 + 49297) % 233280; return k / 233280; };
  const pal = [C.primary, C.cyan, C.amber, C.coral, C.green, C.violet, C.deep];
  const lh = (h - 14) / levels;
  for (let l = 0; l < levels; l++) {
    const by = y + 14 + (l + 1) * lh - 8;
    let px = x + 10;
    while (px < x + w - 26) {
      const t = rnd(); const c = pal[Math.floor(rnd() * pal.length)];
      if (t < 0.4) { const bw = 22 + rnd() * 14, bh = lh * (0.45 + rnd() * 0.3); s += R(px, by - bh, bw, bh, c, { r: 2 }) + R(px, by - bh * 0.6, bw, bh * 0.2, '#fff', { op: 0.75 }); px += bw + 4; }
      else if (t < 0.7) { const bh = lh * (0.5 + rnd() * 0.25); s += R(px + 3, by - bh - 8, 8, 10, shade(c, 0.2), { r: 2 }) + R(px, by - bh, 14, bh, c, { r: 5 }) + R(px, by - bh * 0.55, 14, bh * 0.25, '#fff', { op: 0.8 }); px += 18; }
      else { const bh = lh * 0.32; s += R(px, by - bh, 16, bh, c, { r: 3 }) + R(px, by - bh, 16, 4, '#fff', { op: 0.5 }); s += R(px, by - bh * 2 - 1, 16, bh, c, { r: 3 }); px += 20; }
    }
    s += R(x, by, w, 8, '#d3e1ea') + R(x, by + 6, w, 2, '#b9c8d3');
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* 14. Team collaboration                                              */
/* ------------------------------------------------------------------ */
function teamCollaboration() {
  let s = sceneBase(600);
  s += Ci(980, 180, 260, '#fff', { op: 0.5 });
  s += officeWindow(60, 90, 320, 240);
  s += pendantLamp(300, 30) + pendantLamp(520, 50);
  // wall screen
  s += R(712, 112, 436, 276, C.ink, { r: 14, sh: true });
  const sx = 724, sy = 124, sw = 412, sh = 252;
  s += R(sx, sy, sw, sh, '#fff', { r: 6 });
  s += T(sx + 18, sy + 30, 'Sprint review', { s: 15, w: 800 }) + pill(sx + sw - 16, sy + 14, 'Q4', C.primary, { s: 10, a: 'end' });
  [['Tasks done', '86%', C.green], ['On time', '94%', C.primary], ['Bugs', '-32%', C.coral]].forEach(([a, b, c], i) => {
    const x = sx + 18 + i * 128;
    s += R(x, sy + 44, 118, 54, C.soft, { r: 8 }) + T(x + 10, sy + 63, a, { s: 10, f: C.grey }) + T(x + 10, sy + 87, b, { s: 17, w: 800, f: c });
  });
  s += barChart(sx + 24, sy + 116, 220, 110, [4, 6, 5, 8, 7, 10], { colors: [C.primary, tint(C.primary, 0.6)], highlight: 5, labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], r: 3 });
  s += donut(sx + 330, sy + 172, 44, 14, [{ v: 5, color: C.primary }, { v: 3, color: C.cyan }, { v: 2, color: C.amber }]);
  // plant
  s += plant(1150, 640, 1.2);
  s += plant(36, 690, 1.35);
  // desk + monitors
  s += El(330, 760, 330, 26, C.ink, { op: 0.06 });
  s += desk(60, 540, 560, { legH: 160 });
  const m1 = monitor(130, 380, 200, 124, { stand: 44 }); s += m1.svg + miniDash(m1.sx, m1.sy, m1.sw, m1.sh);
  const m2 = monitor(370, 380, 200, 124, { stand: 44 }); s += m2.svg + miniDash(m2.sx, m2.sy, m2.sw, m2.sh, { variant: 1 });
  s += mug(84, 518, C.coral) + plant(590, 540, 0.42, { pot: C.soft });
  // people
  s += personBack(230, 790, { s: 1.15, skin: SKIN[0], hair: HAIR[3], hairStyle: 'long', shirt: C.primary });
  s += personBack(470, 790, { s: 1.15, skin: SKIN[3], hair: HAIR[4], hairStyle: 'curly', shirt: C.amber });
  s += person(700, 660, { s: 1.12, skin: SKIN[2], hair: HAIR[0], hairStyle: 'bun', shirt: '#ffffff', jacket: C.deep, pants: C.ink, pose: 'point' });
  s += person(1030, 720, { s: 1.08, skin: SKIN[1], hair: HAIR[1], shirt: C.violet, pants: '#344054', pose: 'hold', prop: 'tablet', flip: true });
  return s;
}

/* ------------------------------------------------------------------ */
/* 15. Warehouse operations                                            */
/* ------------------------------------------------------------------ */
function warehouseOperations() {
  let s = sceneBase(640, { wall: url('sky') });
  s += R(0, 0, 1200, 40, '#dbe8ef');
  for (let i = 0; i < 6; i++) s += R(40 + i * 200, 52, 150, 30, '#ffffff', { r: 4 }) + R(40 + i * 200, 52, 150, 30, null, { r: 4, stroke: '#cfdde6' });
  s += rackBay(40, 150, 300, 480, 4, { seed: 3 }) + rackBay(350, 150, 300, 480, 4, { seed: 8 }) + rackBay(660, 150, 300, 480, 4, { seed: 13 }) + rackBay(970, 150, 260, 480, 4, { seed: 21 });
  // aisle signs
  ['A', 'B', 'C'].forEach((a, i) => { s += R(170 + i * 310, 112, 40, 30, C.primary, { r: 6 }) + T(190 + i * 310, 133, a, { s: 16, w: 800, f: '#fff', a: 'middle' }); });
  // floor markings
  s += R(0, 690, 1200, 6, C.amber, { op: 0.8 });
  for (let i = 0; i < 10; i++) s += Pa(`M${i * 130},800l40,-80h24l-40,80z`, C.amber, { op: 0.18 });
  s += palletLoad(60, 760, 170, 2, 3);
  s += forklift(600, 770, { s: 1.12 });
  s += person(420, 780, { s: 1.15, skin: SKIN[2], hair: HAIR[0], shirt: C.slate, pants: C.ink, vest: C.amber, hat: '#ffffff', pose: 'scanner' });
  // tablet overlay
  const tb = tabletFrame(850, 70, 320, 250, { bezel: 12 });
  s += tb.svg;
  const { sx, sy, sw } = tb;
  s += T(sx + 16, sy + 28, 'Stock levels', { s: 14, w: 800 }) + pill(sx + sw - 14, sy + 12, 'Live', C.green, { s: 10, a: 'end' });
  s += T(sx + 16, sy + 50, 'Stock on hand', { s: 10, f: C.grey }) + T(sx + 16, sy + 72, '48,920', { s: 20, w: 800 });
  s += T(sx + 150, sy + 50, 'Pick lists', { s: 10, f: C.grey }) + T(sx + 150, sy + 72, '126', { s: 20, w: 800 });
  [['Zone A', 82, C.primary], ['Zone B', 64, C.cyan], ['Zone C', 38, C.amber], ['Zone D', 91, C.green]].forEach(([n, v, c], i) => {
    const y = sy + 96 + i * 30;
    s += T(sx + 16, y + 10, n, { s: 10.5, f: C.slate }) + progress(sx + 70, y + 4, sw - 130, v, c, { h: 8 }) + T(sx + sw - 16, y + 11, `${v}%`, { s: 10.5, w: 700, a: 'end' });
  });
  return s;
}

/* ------------------------------------------------------------------ */
/* 16. Oil & gas                                                       */
/* ------------------------------------------------------------------ */
function oilGasOperations() {
  let s = R(0, 0, 1200, 800, url('sky'));
  s += Ci(980, 140, 70, '#fff', { op: 0.7 });
  s += Pa('M0,560Q200,500 420,540T860,520T1200,540V640H0Z', tint(C.primary, 0.85));
  s += cloud(260, 120, 0.7, '#fff', { op: 0.9 }) + cloud(640, 80, 0.5, '#fff');
  s += R(0, 610, 1200, 190, url('floor'));
  // pipe rack
  for (let x = 470; x < 1200; x += 120) s += R(x, 540, 8, 80, '#9fb3c2');
  s += pipe(450, 552, 1200, 552) + pipe(450, 572, 1200, 572, tint(C.primary, 0.55), 10) + pipe(450, 590, 1200, 590, '#d7c08a', 8);
  // towers + flare
  s += column(560, 230, 54, 390, { platforms: 4 }) + column(650, 300, 40, 320, { platforms: 3 }) + column(720, 360, 34, 260, { platforms: 2 });
  s += pipe(614, 300, 650, 330, '#c3d2dc', 8) + pipe(690, 380, 720, 400, '#c3d2dc', 8);
  s += R(800, 170, 12, 450, '#9fb3c2') + Pa('M806,170c-14,-18 -6,-34 0,-48c8,16 18,26 0,48z', C.amber) + Pa('M806,166c-6,-8 -2,-16 0,-22c4,8 8,14 0,22z', C.coral);
  for (let y = 200; y < 600; y += 40) s += L(800, y, 812, y + 40, '#b9c8d3', 1.5) + L(812, y, 800, y + 40, '#b9c8d3', 1.5);
  // tanks
  s += storageTank(40, 400, 250, 220, { label: 'T-101' }) + storageTank(310, 450, 200, 170, { label: 'T-102', band: C.cyan });
  s += pipe(290, 600, 310, 600, '#c3d2dc', 10) + pipe(510, 600, 560, 600, '#c3d2dc', 10);
  // truck & engineer
  s += truck(780, 730, { s: 0.98, kind: 'tanker', body: '#f7fafc', cab: C.primary, label: 'FUEL' });
  s += El(600, 778, 60, 8, C.ink, { op: 0.08 });
  s += person(600, 778, { s: 1.15, skin: SKIN[1], hair: HAIR[0], shirt: C.deep, pants: C.ink, vest: C.amber, hat: '#ffffff', pose: 'hold', prop: 'tablet' });
  // overlay card
  const ox = 860, oy = 230, ow = 300, oh = 250;
  s += overlayCard(ox, oy, ow, oh, 'Tank levels', { ic: 'chart', sub: 'Terminal 2 · live' });
  [['T-101', 82, C.primary], ['T-102', 64, C.cyan], ['T-103', 41, C.amber], ['T-104', 90, C.green]].forEach(([n, v, c], i) => {
    const x = ox + 30 + i * 66, y = oy + 74, h = 120;
    s += R(x, y, 40, h, C.soft, { r: 10, stroke: C.border }) + R(x + 4, y + 4 + (h - 8) * (1 - v / 100), 32, (h - 8) * (v / 100), c, { r: 7 });
    s += T(x + 20, y + h + 20, n, { s: 10.5, w: 700, a: 'middle' }) + T(x + 20, y + h + 36, `${v}%`, { s: 10, f: C.grey, a: 'middle' });
  });
  return s;
}

/* ------------------------------------------------------------------ */
/* 17. Manufacturing floor                                             */
/* ------------------------------------------------------------------ */
function roboticArm(x, y, { s = 1, flip = false } = {}) {
  let b = '';
  b += R(-46, -20, 92, 20, C.slate, { r: 6 }) + Pa('M-34,-20L-26,-60H26L34,-20Z', C.ink);
  b += Ci(0, -64, 22, C.ink);
  b += Pa('M0,-64L-60,-230', null, { stroke: C.amber, sw: 34, cap: 'round' });
  b += Ci(-60, -230, 18, C.ink) + Ci(-60, -230, 7, '#9fb3c2');
  b += Pa('M-60,-230L80,-210', null, { stroke: C.amber, sw: 26, cap: 'round' });
  b += Pa('M-60,-230L80,-210', null, { stroke: '#fff', sw: 3, op: 0.35 });
  b += Ci(80, -210, 13, C.ink) + R(72, -206, 16, 40, C.slate, { r: 3 });
  b += Pa('M66,-166h28M70,-166v18M90,-166v18', null, { stroke: C.ink, sw: 5 });
  b += Ci(0, -64, 8, '#9fb3c2');
  return G(b, { t: `translate(${x},${y}) scale(${flip ? -s : s},${s})` });
}
function manufacturingFloor() {
  let s = sceneBase(600, { wall: url('sky') });
  // roof trusses + windows
  s += R(0, 0, 1200, 70, '#dbe8ef');
  for (let x = 0; x < 1200; x += 150) s += Pa(`M${x},70L${x + 75},20L${x + 150},70`, null, { stroke: '#b9c8d3', sw: 3 }) + L(x + 75, 20, x + 75, 70, '#b9c8d3', 2);
  for (let i = 0; i < 5; i++) s += R(60 + i * 230, 110, 170, 110, url('bg'), { r: 6 }) + R(60 + i * 230, 110, 170, 110, null, { r: 6, stroke: '#fff', sw: 6 }) + R(143 + i * 230, 110, 4, 110, '#fff');
  s += R(0, 300, 1200, 8, C.amber, { op: 0.35 });
  // conveyor
  const cy = 548;
  for (let x = 90; x <= 860; x += 110) s += R(x, cy + 30, 10, 120, '#9fb3c2');
  s += R(60, cy, 840, 34, C.slate, { r: 17 }) + R(66, cy + 5, 828, 12, '#475467', { r: 6 });
  for (let x = 78; x < 890; x += 26) s += Ci(x, cy + 24, 5, '#98a2b3');
  // products on belt
  [[120, 'box'], [260, 'box'], [420, 'box'], [610, 'box'], [760, 'box']].forEach(([x], i) => { s += box(x, cy - 44 + (i % 2) * 6, 64, 44 - (i % 2) * 6); });
  s += roboticArm(560, 548 + 0, { s: 1.1 }) + roboticArm(290, 548, { s: 0.95, flip: true });
  // floor markings
  s += R(0, 720, 1200, 6, C.amber, { op: 0.75 });
  for (let i = 0; i < 12; i++) s += Pa(`M${40 + i * 70},726l20,-6h24l-20,6z`, C.ink, { op: 0.0 });
  s += palletLoad(40, 780, 150, 2, 3);
  // control panel
  const px = 900;
  s += R(px, 420, 150, 300, '#dfe9ef', { r: 10, stroke: '#c3d2dc' }) + Pa(`M${px},420l20,-60h110l20,60z`, C.ink);
  s += Pa(`M${px + 26},414l14,-46h70l14,46z`, '#fff');
  s += barChart(px + 46, 378, 70, 30, [3, 5, 4, 6, 7], { colors: [C.primary, C.cyan], r: 1, base: false });
  [[C.green, 450], [C.amber, 450], [C.coral, 450]].forEach(([c], i) => { s += Ci(px + 40 + i * 35, 456, 11, c) + Ci(px + 40 + i * 35, 456, 11, null, { stroke: '#fff', sw: 2, op: 0.6 }); });
  s += R(px + 24, 490, 102, 50, '#fff', { r: 6 }) + T(px + 34, 510, 'Line 2', { s: 10, f: C.grey }) + T(px + 34, 530, 'Running', { s: 14, w: 800, f: C.green });
  for (let i = 0; i < 3; i++) s += R(px + 24 + i * 36, 560, 30, 18, '#c3d2dc', { r: 4 });
  // stack light
  s += R(px + 140, 300, 8, 60, '#9fb3c2') + R(px + 132, 252, 24, 16, C.coral, { r: 4 }) + R(px + 132, 270, 24, 16, C.amber, { r: 4 }) + R(px + 132, 288, 24, 16, C.green, { r: 4 });
  s += person(1110, 740, { s: 1.12, skin: SKIN[3], hair: HAIR[4], shirt: C.primary, pants: C.ink, hat: '#ffffff', vest: C.amber, pose: 'point', flip: true });
  // overlay
  const ox = 40, oy = 80, ow = 330, oh = 262;
  s += overlayCard(ox, oy - 40, ow, oh, 'OEE · Line 2', { ic: 'factory', sub: 'Shift A · today' });
  s += ring(ox + 76, oy + 76, 44, 12, 86, C.primary, { label: '86%', sub: 'OEE', s: 18 });
  [['Availability', 92, C.primary], ['Performance', 95, C.cyan], ['Quality', 99, C.green]].forEach(([n, v, c], i) => {
    const y = oy + 40 + i * 30;
    s += T(ox + 140, y, n, { s: 10.5, f: C.slate }) + T(ox + ow - 18, y, `${v}%`, { s: 10.5, w: 700, a: 'end' }) + progress(ox + 140, y + 6, ow - 158, v, c, { h: 5 });
  });
  s += L(ox + 16, oy + 136, ox + ow - 16, oy + 136, C.line, 1) + T(ox + 18, oy + 160, 'Work orders', { s: 12, w: 700 });
  s += T(ox + 18, oy + 184, 'WO-1042 · Steel frames', { s: 10.5, f: C.slate }) + pill(ox + ow - 16, oy + 172, 'In progress', C.primary, { s: 9.5, a: 'end' });
  s += T(ox + 18, oy + 204, 'WO-1043 · Panels', { s: 10.5, f: C.slate }) + pill(ox + ow - 16, oy + 192, 'Queued', C.grey, { s: 9.5, a: 'end' });
  return s;
}

/* ------------------------------------------------------------------ */
/* 18. Distribution & logistics                                        */
/* ------------------------------------------------------------------ */
function rearTruck(x, y, w, h) {
  let s = R(x, y, w, h, '#ffffff', { r: 6, stroke: C.border, sw: 2 });
  s += L(x + w / 2, y + 8, x + w / 2, y + h - 8, C.border, 2) + R(x + w / 2 - 14, y + h / 2 - 20, 6, 40, '#9fb3c2', { r: 3 }) + R(x + w / 2 + 8, y + h / 2 - 20, 6, 40, '#9fb3c2', { r: 3 });
  s += R(x, y + h - 26, w, 12, C.cyan);
  s += R(x - 4, y + h, w + 8, 16, C.slate, { r: 4 }) + R(x + 8, y + h + 2, 18, 10, C.coral, { r: 3 }) + R(x + w - 26, y + h + 2, 18, 10, C.coral, { r: 3 });
  s += R(x + 14, y + h + 16, 44, 34, C.ink, { r: 6 }) + R(x + w - 58, y + h + 16, 44, 34, C.ink, { r: 6 });
  return s;
}
function distributionLogistics() {
  let s = R(0, 0, 1200, 800, url('sky'));
  s += cloud(160, 110, 0.6, '#fff') + cloud(560, 70, 0.45, '#fff');
  // building
  s += R(0, 190, 1200, 450, '#eef4f8') + R(0, 190, 1200, 34, C.deep) + R(0, 224, 1200, 6, C.cyan);
  s += T(40, 214, 'DISTRIBUTION CENTRE · DC-02', { s: 15, w: 800, f: '#fff', ls: 1.5 });
  for (let i = 0; i < 12; i++) s += R(i * 100, 230, 2, 410, '#dde8ef');
  // docks
  const doors = [80, 420, 760];
  doors.forEach((dx, i) => {
    s += R(dx - 10, 330, 300, 20, '#c3d2dc', { r: 4 }) + R(dx + 104, 300, 72, 24, C.ink, { r: 5 }) + T(dx + 140, 317, `DOCK ${i + 1}`, { s: 11, w: 800, f: '#fff', a: 'middle' });
    s += R(dx, 350, 280, 250, i === 1 ? '#3a4a60' : '#dfe9ef');
    if (i !== 1) for (let y = 360; y < 600; y += 16) s += R(dx, y, 280, 3, '#c9d6df');
    s += R(dx - 12, 350, 12, 250, C.ink) + R(dx + 280, 350, 12, 250, C.ink);
    s += R(dx + 20, 600, 40, 30, C.ink, { r: 4 }) + R(dx + 220, 600, 40, 30, C.ink, { r: 4 });
  });
  // open dock interior
  s += palletLoad(450, 600, 110, 3, 2) + palletLoad(580, 600, 100, 2, 2);
  s += R(0, 600, 1200, 40, '#c9d6df') + R(0, 600, 1200, 6, C.amber);
  s += R(0, 640, 1200, 160, url('floor'));
  for (let i = 0; i < 8; i++) s += R(60 + i * 150, 720, 70, 6, '#fff', { op: 0.8 });
  // trucks at docks 1 and 3
  s += rearTruck(90, 380, 260, 236) + rearTruck(770, 380, 260, 236);
  s += T(220, 470, 'RT-14', { s: 22, w: 800, f: C.deep, a: 'middle' }) + T(900, 470, 'RT-09', { s: 22, w: 800, f: C.deep, a: 'middle' });
  // foreground
  s += palletLoad(380, 760, 150, 2, 3) + palletLoad(1010, 770, 130, 1, 2);
  s += forklift(620, 770, { s: 0.9 });
  s += person(320, 778, { s: 1.12, skin: SKIN[0], hair: HAIR[3], hairStyle: 'long', shirt: C.primary, pants: C.ink, vest: C.amber, pose: 'hold', prop: 'clipboard' });
  // route map overlay
  const ox = 860, oy = 30, ow = 310, oh = 256;
  s += overlayCard(ox, oy, ow, oh, 'Route RT-14', { ic: 'truck', sub: '6 stops · ETA 14:20' });
  s += routeMap(ox + 16, oy + 62, ow - 32, 136, {});
  [['Delivered', '3', C.green], ['En route', '1', C.primary], ['Pending', '2', C.grey]].forEach(([a, b, c], i) => {
    const x = ox + 18 + i * 96;
    s += Ci(x + 4, oy + 218, 4, c) + T(x + 13, oy + 222, a, { s: 10.5, f: C.grey }) + T(x + 13, oy + 240, b, { s: 13, w: 800 });
  });
  return s;
}

/* ------------------------------------------------------------------ */
/* 19. Retail store                                                    */
/* ------------------------------------------------------------------ */
function retailStore() {
  let s = sceneBase(620);
  s += pendantLamp(560, 40, { color: C.deep }) + pendantLamp(760, 40, { color: C.deep });
  s += R(40, 70, 220, 34, C.deep, { r: 8 }) + T(150, 93, 'GROCERY', { s: 14, w: 800, f: '#fff', a: 'middle', ls: 2 });
  s += R(300, 70, 220, 34, C.green, { r: 8 }) + T(410, 93, 'FRESH', { s: 14, w: 800, f: '#fff', a: 'middle', ls: 2 });
  s += shelfUnit(30, 120, 240, 500, 5, 3) + shelfUnit(290, 120, 240, 500, 5, 11);
  s += El(800, 772, 300, 22, C.ink, { op: 0.06 });
  // cashier behind counter
  s += person(800, 760, { s: 1.1, skin: SKIN[1], hair: HAIR[0], hairStyle: 'long', shirt: '#ffffff', jacket: C.green, pose: 'laptopArms' });
  // counter
  s += R(580, 560, 440, 22, '#f7fafc', { r: 6 }) + R(590, 582, 420, 178, C.deep, { r: 4 }) + R(590, 582, 420, 10, shade(C.deep, 0.2));
  s += R(620, 640, 360, 6, C.cyan, { op: 0.7 }) + T(800, 700, 'CHECKOUT 2', { s: 15, w: 800, f: '#fff', a: 'middle', ls: 2, op: 0.9 });
  // pos on counter
  s += Pa('M640,560l8,-30h18l8,30z', '#9fb3c2');
  s += G(R(0, 0, 130, 88, C.ink, { r: 8 }) + R(6, 6, 118, 76, '#fff', { r: 4 }) + R(10, 10, 60, 68, C.soft, { r: 3 }) + R(74, 10, 46, 68, tint(C.primary, 0.9), { r: 3 }) + R(78, 60, 38, 12, C.primary, { r: 3 }), { t: 'translate(592 446) rotate(-4)' });
  s += R(880, 520, 44, 40, C.ink, { r: 6 }) + R(886, 526, 32, 14, C.cyan, { r: 2 });
  s += Pa('M940,560V510h50v50z', C.amber) + Pa('M950,510q15,-24 30,0', null, { stroke: shade(C.amber, 0.2), sw: 3 });
  // customer
  s += person(1100, 780, { s: 1.16, skin: SKIN[3], hair: HAIR[4], hairStyle: 'curly', shirt: C.violet, pants: C.ink, pose: 'bag', propColor: C.amber, flip: true });
  s += plant(1160, 630, 0.9);
  // overlay
  const ox = 860, oy = 60, ow = 300, oh = 236;
  s += overlayCard(ox, oy, ow, oh, 'Branch sales', { ic: 'store', sub: 'Today · 4 branches' });
  s += T(ox + 18, oy + 88, '$48.2k', { s: 22, w: 800 }) + pill(ox + 112, oy + 72, '+12%', C.green, { s: 10 });
  [['Downtown', 86, C.primary], ['City Mall', 72, C.cyan], ['Airport', 54, C.amber], ['Harbor', 40, C.violet]].forEach(([n, v, c], i) => {
    const y = oy + 116 + i * 28;
    s += T(ox + 18, y + 9, n, { s: 10.5, f: C.slate }) + progress(ox + 92, y + 3, ow - 150, v, c, { h: 8 }) + T(ox + ow - 18, y + 10, `$${(v * 0.14).toFixed(1)}k`, { s: 10.5, w: 700, a: 'end' });
  });
  return s;
}

/* ------------------------------------------------------------------ */
/* 20. Construction                                                    */
/* ------------------------------------------------------------------ */
function constructionProjects() {
  let s = R(0, 0, 1200, 800, url('sky'));
  s += cloud(700, 120, 0.6, '#fff') + cloud(150, 230, 0.45, '#fff');
  s += Pa('M0,600Q300,560 600,590T1200,580V660H0Z', tint(C.primary, 0.85));
  s += R(0, 640, 1200, 160, '#efe7da') + R(0, 640, 1200, 8, '#e2d5c0');
  // building frame
  const bx = 430, bw = 380, top = 230, base = 640, fl = 6;
  const fh = (base - top) / fl;
  for (let f = 0; f < fl; f++) {
    const y = base - (f + 1) * fh;
    if (f < 2) for (let c = 0; c < 5; c++) s += R(bx + c * (bw / 5) + 6, y + 8, bw / 5 - 12, fh - 14, tint(C.cyan, 0.55 + (c % 2) * 0.1), { op: 0.9 });
    if (f >= 2 && f < 4) s += R(bx, y + fh - 10, bw, 10, '#cfd8e0');
  }
  for (let c = 0; c <= 5; c++) s += R(bx + c * (bw / 5) - 5, top, 10, base - top, C.slate);
  for (let f = 0; f <= fl; f++) s += R(bx - 8, base - f * fh - 6, bw + 16, 10, C.primary);
  for (let f = 3; f < fl; f++) s += L(bx + 10, base - f * fh, bx + bw / 5 - 10, base - (f + 1) * fh + 10, '#9fb3c2', 3) + L(bx + 4 * bw / 5 + 10, base - (f + 1) * fh + 10, bx + bw - 10, base - f * fh, '#9fb3c2', 3);
  // scaffold
  for (let y = 300; y < 640; y += 56) s += L(812, y, 860, y, '#c99a6b', 3);
  s += L(860, 290, 860, 640, '#c99a6b', 4) + L(836, 290, 836, 640, '#c99a6b', 4);
  // tower crane
  const mx = 300;
  s += R(mx - 14, 110, 28, 530, null, { stroke: C.amber, sw: 4 });
  for (let y = 110; y < 640; y += 28) s += L(mx - 14, y, mx + 14, y + 28, C.amber, 2.5) + L(mx - 14, y + 28, mx + 14, y + 28, C.amber, 2);
  s += R(mx - 34, 628, 68, 16, C.slate, { r: 3 });
  s += Pa(`M${mx},70L${mx - 10},110H${mx + 10}Z`, C.amber);
  s += R(140, 104, 690, 14, null, { stroke: C.amber, sw: 3 });
  for (let x = 140; x < 830; x += 24) s += L(x, 104, x + 12, 118, C.amber, 2) + L(x + 12, 118, x + 24, 104, C.amber, 2);
  s += L(mx, 70, 150, 104, C.slate, 2) + L(mx, 70, 760, 104, C.slate, 2);
  s += R(146, 118, 70, 40, C.slate, { r: 4 }) + R(152, 124, 26, 28, '#9fb3c2', { r: 2 }) + R(184, 124, 26, 28, '#9fb3c2', { r: 2 });
  s += R(mx + 14, 118, 40, 34, C.primary, { r: 6 }) + R(mx + 20, 124, 26, 16, '#bfe6f6', { r: 3 });
  s += R(640, 118, 30, 12, C.slate, { r: 3 }) + L(655, 130, 655, 300, C.slate, 2) + Pa('M648,300h14l-7,14z', C.slate);
  s += L(655, 314, 600, 340, C.slate, 1.5) + L(655, 314, 710, 340, C.slate, 1.5) + R(570, 340, 170, 16, C.amber, { r: 2 }) + R(570, 352, 170, 4, shade(C.amber, 0.2));
  // ground props
  s += cone(400, 700) + cone(470, 712) + cone(1110, 700);
  s += R(120, 690, 180, 30, '#fff', { r: 4 }) + Pa('M130,690h20l-14,30h-20zM170,690h20l-14,30h-20zM210,690h20l-14,30h-20zM250,690h20l-14,30h-20z', C.coral) + R(130, 720, 6, 30, C.slate) + R(284, 720, 6, 30, C.slate);
  for (let i = 0; i < 4; i++) s += R(560 + i * 6, 730 - i * 12, 200, 10, i % 2 ? C.slate : '#9fb3c2', { r: 2 });
  s += person(980, 770, { s: 1.18, skin: SKIN[2], hair: HAIR[0], shirt: '#ffffff', pants: C.ink, vest: C.amber, hat: '#ffffff', pose: 'hold', prop: 'tablet' });
  // overlay
  const ox = 870, oy = 50, ow = 300, oh = 270;
  s += overlayCard(ox, oy, ow, oh, 'Budget vs actual', { ic: 'chart', sub: 'Tower B · $4.2M' });
  s += legendDot(ox + 18, oy + 80, tint(C.primary, 0.6), 'Budget') + legendDot(ox + 92, oy + 80, C.primary, 'Actual') + pill(ox + ow - 16, oy + 66, 'On track', C.green, { s: 10, a: 'end' });
  s += barChart(ox + 22, oy + 96, ow - 44, 130, [[80, 76], [100, 104], [70, 52], [60, 18]], { colors: [tint(C.primary, 0.6), C.primary], labels: ['Foundation', 'Structure', 'MEP', 'Finishing'], gap: 0.4, r: 3, grid: 3 });
  return s;
}

/* ------------------------------------------------------------------ */
/* 21. Education & training                                            */
/* ------------------------------------------------------------------ */
function educationTraining() {
  let s = sceneBase(600);
  s += officeWindow(40, 100, 200, 220, { panes: 2 });
  // wall screen with class grid
  s += R(300, 56, 560, 330, C.ink, { r: 16, sh: true });
  const sx = 314, sy = 70, sw = 532, sh = 302;
  s += R(sx, sy, sw, sh, '#14233a', { r: 8 });
  s += pill(sx + 14, sy + 12, '● LIVE', C.coral, { s: 10, solid: true }) + T(sx + 80, sy + 27, 'Inventory fundamentals · Session 3', { s: 12, w: 600, f: '#fff' });
  const tiles = [[SKIN[1], HAIR[1], C.primary, 'long'], [SKIN[3], HAIR[4], C.amber, 'curly'], [SKIN[0], HAIR[3], C.violet, 'short'], [SKIN[2], HAIR[0], C.green, 'bun'], [SKIN[0], HAIR[1], C.coral, 'long'], [SKIN[2], HAIR[4], C.cyan, 'short']];
  tiles.forEach(([sk, hr, sh2, st], i) => {
    const tw2 = (sw - 40) / 3, th = (sh - 70) / 2;
    const x = sx + 12 + (i % 3) * (tw2 + 8), y = sy + 44 + Math.floor(i / 3) * (th + 8);
    const [cp, cid] = clipRect(x, y, tw2, th, 8);
    s += cp + G(R(x, y, tw2, th, i === 0 ? '#1d3a5c' : '#22324a') + avatar(x + tw2 / 2, y + th / 2 + 6, th * 0.42, sk, hr, sh2, { bg: 'none', style: st, noClip: true }), { clip: cid });
    if (i === 0) s += R(x, y, tw2, th, null, { r: 8, stroke: C.cyan, sw: 3 });
    s += R(x + 6, y + th - 22, 70, 16, C.ink, { r: 8, op: 0.7 }) + T(x + 12, y + th - 10, ['Trainer', 'Omar', 'Lena', 'Aisha', 'Priya', 'Jon'][i], { s: 9.5, w: 600, f: '#fff' });
  });
  // desk + laptops + learners
  s += desk(80, 560, 1040, { legH: 160 });
  [[230, 0], [600, 1], [970, 2]].forEach(([x, k]) => {
    const lp = laptop(x - 90, 470, 180, 92);
    s += lp.svg;
    const lsx = lp.sx, lsy = lp.sy;
    s += R(lsx, lsy, lp.sw, 20, C.ink) + R(lsx + 6, lsy + 26, lp.sw * 0.6, lp.sh - 32, url('deep'), { r: 3 }) + Pa(`M${lsx + lp.sw * 0.3 - 4},${lsy + 44}l12,8-12,8z`, '#fff');
    for (let j = 0; j < 4; j++) s += R(lsx + lp.sw * 0.66, lsy + 28 + j * 12, lp.sw * 0.3, 7, j === 1 ? tint(C.green, 0.6) : C.line, { r: 3 });
    s += progress(lsx + 6, lsy + lp.sh - 8, lp.sw * 0.6, 40 + k * 20, C.cyan, { h: 3 });
  });
  s += personBack(230, 800, { s: 1.0, skin: SKIN[2], hair: HAIR[0], shirt: C.primary });
  s += personBack(600, 800, { s: 1.0, skin: SKIN[0], hair: HAIR[3], hairStyle: 'long', shirt: C.coral });
  s += personBack(970, 800, { s: 1.0, skin: SKIN[3], hair: HAIR[4], hairStyle: 'bun', shirt: C.green });
  s += plant(1160, 600, 1.0);
  // overlay
  const ox = 890, oy = 60, ow = 280, oh = 250;
  s += overlayCard(ox, oy, ow, oh, 'Course progress', { ic: 'cap', sub: 'Cohort B · 24 learners' });
  s += ring(ox + 62, oy + 128, 40, 11, 72, C.primary, { label: '72%', s: 17 });
  [['Completed', '18', C.green], ['In progress', '5', C.primary], ['Not started', '1', C.mute]].forEach(([a, b, c], i) => {
    const y = oy + 98 + i * 26; s += legendDot(ox + 126, y, c, a) + T(ox + ow - 18, y, b, { s: 11, w: 700, a: 'end' });
  });
  s += L(ox + 16, oy + 186, ox + ow - 16, oy + 186, C.line, 1) + T(ox + 18, oy + 210, 'Avg. quiz score', { s: 11, f: C.grey }) + T(ox + ow - 18, oy + 210, '88%', { s: 13, w: 800, a: 'end' });
  s += progress(ox + 18, oy + 222, ow - 36, 88, C.green, { h: 6 });
  return s;
}

/* ------------------------------------------------------------------ */
/* 22. Data center                                                     */
/* ------------------------------------------------------------------ */
function dataCenter() {
  let s = sceneBase(640);
  for (let x = 0; x < 1200; x += 80) s += L(x, 640, x - 60 + (x - 600) * 0.3, 800, '#d3e1ea', 1.5);
  s += L(0, 700, 1200, 700, '#d3e1ea', 1.5) + L(0, 760, 1200, 760, '#d3e1ea', 1.5);
  // racks
  for (let i = 0; i < 5; i++) s += serverRack(600 + i * 116, 240, 108, 400, { seed: i * 7 + 3 });
  s += R(590, 226, 590, 14, '#c3d2dc', { r: 4 });
  // cloud + links
  [[650, 240], [770, 240], [886, 240]].forEach(([x, y]) => { s += Pa(`M440,200C${x - 60},200 ${x},170 ${x},${y}`, null, { stroke: C.primary, sw: 2, dash: '5 6', op: 0.6 }); });
  s += cloud(380, 170, 1.15, '#fff', { sh: true }) + icon('server', 340, 140, C.primary, 40, 1.6) + T(380, 210, 'VQ Cloud', { s: 14, w: 800, f: C.deep, a: 'middle' });
  s += shieldIcon(520, 120, 0.7);
  // databases
  s += dbCylinder(120, 560, 100, 80) + dbCylinder(240, 590, 80, 60, { color: C.deep, light: C.primary });
  s += El(170, 652, 110, 10, C.ink, { op: 0.06 });
  // engineer at standing desk
  s += person(420, 770, { s: 1.12, skin: SKIN[3], hair: HAIR[4], hairStyle: 'short', shirt: C.primary, pants: C.ink, pose: 'laptopArms' });
  s += R(330, 600, 180, 12, '#fff', { r: 4 }) + R(408, 612, 14, 160, '#9fb3c2') + R(370, 764, 90, 10, '#8da2b3', { r: 5 });
  s += laptop(374, 544, 92, 56, { back: true }).svg;
  // overlay
  s += overlayCard(40, 40, 260, 150, 'Uptime 99.98%', { ic: 'shield', color: C.green, sub: 'Last 90 days' });
  for (let i = 0; i < 30; i++) s += R(58 + i * 7.4, 110, 5, 32, i === 17 ? C.amber : C.green, { r: 2 });
  s += T(58, 168, 'Backups: 4h ago · Encrypted', { s: 10.5, f: C.grey });
  s += R(860, 80, 300, 110, '#fff', { r: 16, sh: true }) + T(880, 110, 'Cluster load', { s: 13, w: 700 }) + T(1140, 110, '42%', { s: 13, w: 800, f: C.primary, a: 'end' });
  s += sparkline(880, 130, 260, 40, [30, 42, 36, 50, 44, 38, 46, 40, 34, 42], C.cyan);
  return s;
}

/* ------------------------------------------------------------------ */
/* 23. Field services                                                  */
/* ------------------------------------------------------------------ */
function fieldServices() {
  let s = R(0, 0, 1200, 800, url('sky'));
  s += cloud(520, 90, 0.55, '#fff') + cloud(1040, 150, 0.45, '#fff');
  // house
  s += R(660, 330, 340, 300, '#ffffff') + Pa('M630,340L830,200L1030,340Z', C.deep) + Pa('M650,340L830,214L1010,340Z', C.primary);
  s += R(700, 400, 80, 70, tint(C.cyan, 0.6), { stroke: '#fff', sw: 6 }) + R(880, 400, 80, 70, tint(C.cyan, 0.6), { stroke: '#fff', sw: 6 });
  s += R(796, 500, 68, 130, C.amber, { r: 4 }) + Ci(850, 566, 4, '#fff');
  s += R(940, 230, 30, 70, '#c3d2dc');
  s += tree(1110, 640, 1.2);
  // ground
  s += R(0, 630, 1200, 40, '#dfe9ef') + R(0, 670, 1200, 130, '#cfdbe3') + R(0, 666, 1200, 6, '#fff');
  for (let i = 0; i < 8; i++) s += R(40 + i * 160, 740, 80, 6, '#fff', { op: 0.9 });
  s += Pa('M420,700C520,700 620,690 830,640', null, { stroke: C.primary, sw: 3, dash: '2 10', op: 0.8 });
  s += mapPin(830, 470, C.coral, 1.5);
  // van
  s += truck(70, 720, { s: 1.3, kind: 'van', body: '#ffffff', cab: C.primary, label: 'VQ Service' });
  // technician
  s += person(560, 760, { s: 1.15, skin: SKIN[2], hair: HAIR[0], shirt: C.primary, pants: C.slate, pose: 'hold', prop: 'tablet', hat: C.deep });
  s += R(620, 724, 60, 36, C.amber, { r: 4 }) + Pa('M634,724v-10h32v10', null, { stroke: C.slate, sw: 4 }) + R(620, 736, 60, 4, shade(C.amber, 0.2));
  // overlay
  const ox = 40, oy = 40, ow = 330, oh = 290;
  s += overlayCard(ox, oy, ow, oh, "Today's jobs", { ic: 'calendar', sub: 'Technician · 4 visits' });
  [['09:00', 'AC maintenance', 'Done', C.green], ['11:30', 'Boiler inspection', 'En route', C.primary], ['14:00', 'Network install', 'Scheduled', C.grey], ['16:30', 'Meter check', 'Scheduled', C.grey]].forEach(([t, j, st, c], i) => {
    const y = oy + 70 + i * 52;
    s += R(ox + 16, y, ow - 32, 44, i === 1 ? tint(C.primary, 0.92) : C.soft, { r: 10 }) + R(ox + 16, y + 8, 4, 28, c, { r: 2 });
    s += T(ox + 32, y + 19, t, { s: 11, w: 700, f: C.grey }) + T(ox + 32, y + 35, j, { s: 12, w: 600 });
    s += pill(ox + ow - 26, y + 13, st, c, { s: 9.5, a: 'end', h: 18 });
  });
  return s;
}

/* ------------------------------------------------------------------ */
/* 24. Consultation meeting                                            */
/* ------------------------------------------------------------------ */
function consultationMeeting() {
  const extra = `<marker id="${id('arrow')}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1L9,5L0,9z" fill="${C.slate}"/></marker>`;
  let s = sceneBase(620);
  s += officeWindow(40, 110, 260, 240, { panes: 2 });
  s += pendantLamp(560, 20);
  // whiteboard
  const wx = 360, wy = 90, ww = 600, wh = 290;
  s += R(wx, wy, ww, wh, '#fff', { r: 10, sh: true }) + R(wx, wy, ww, wh, null, { r: 10, stroke: '#c3d2dc', sw: 6 }) + R(wx + 40, wy + wh, ww - 80, 10, '#c3d2dc', { r: 3 });
  s += T(wx + 30, wy + 40, 'Discovery workshop', { s: 17, w: 800, f: C.deep });
  const steps = [['Discover', C.primary], ['Design', C.violet], ['Build', C.amber], ['Launch', C.green]];
  steps.forEach(([n, c], i) => {
    const x = wx + 30 + i * 142, y = wy + 80;
    s += R(x, y, 110, 54, tint(c, 0.86), { r: 10, stroke: c, sw: 2 }) + T(x + 55, y + 33, n, { s: 14, w: 700, f: shade(c, 0.2), a: 'middle' });
    if (i < 3) s += el('path', { d: `M${x + 114},${y + 27}H${x + 138}`, stroke: C.slate, 'stroke-width': 2.5, fill: 'none', 'marker-end': url('arrow') });
  });
  s += el('path', { d: `M${wx + 85},${wy + 140}Q${wx + 85},${wy + 190} ${wx + 160},${wy + 196}`, stroke: C.slate, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '5 5', 'marker-end': url('arrow') });
  s += R(wx + 166, wy + 176, 130, 40, '#fff', { r: 20, stroke: C.slate, sw: 1.5 }) + T(wx + 231, wy + 201, 'Requirements', { s: 12, w: 600, f: C.slate, a: 'middle' });
  [[wx + 330, wy + 168, '#fde68a', -4], [wx + 410, wy + 172, tint(C.coral, 0.6), 3], [wx + 490, wy + 166, tint(C.cyan, 0.6), -2]].forEach(([x, y, c, r]) => {
    s += G(R(0, 0, 66, 60, c, { r: 3 }) + R(10, 14, 44, 4, C.ink, { op: 0.25, r: 2 }) + R(10, 26, 34, 4, C.ink, { op: 0.25, r: 2 }) + R(10, 38, 40, 4, C.ink, { op: 0.25, r: 2 }), { t: `translate(${x},${y}) rotate(${r})` });
  });
  s += Pa(`M${wx + 40},${wy + 260}l40,-20 40,10 40,-30`, null, { stroke: C.green, sw: 3 });
  // presenter
  s += person(1050, 660, { s: 1.06, skin: SKIN[0], hair: HAIR[3], hairStyle: 'short', shirt: '#ffffff', jacket: C.primary, pants: C.ink, pose: 'point', flip: true });
  s += plant(1160, 680, 1.1);
  // seated people behind table
  s += person(400, 730, { s: 1.0, skin: SKIN[2], hair: HAIR[0], hairStyle: 'long', shirt: C.coral, pose: 'laptopArms' });
  s += person(680, 730, { s: 1.0, skin: SKIN[1], hair: HAIR[4], hairStyle: 'short', shirt: C.deep, pose: 'laptopArms' });
  // table
  s += El(560, 790, 420, 18, C.ink, { op: 0.06 });
  s += R(204, 584, 712, 170, '#e3ecf1', { r: 6 }) + R(204, 584, 712, 170, null, { r: 6, stroke: '#d3e1ea' });
  s += R(190, 560, 740, 22, '#ffffff', { r: 11 }) + R(200, 580, 720, 10, '#d3e1ea', { r: 4 });
  s += R(260, 590, 14, 190, '#9fb3c2') + R(846, 590, 14, 190, '#9fb3c2') + R(300, 640, 520, 8, '#c3d2dc');
  s += laptop(340, 500, 110, 62, { back: true }).svg + laptop(620, 500, 110, 62, { back: true }).svg;
  s += mug(480, 538, C.primary) + mug(780, 538, C.amber);
  s += G(R(0, 0, 70, 46, '#fff', { stroke: C.border }) + R(8, 10, 46, 3, C.border) + R(8, 18, 40, 3, C.border) + R(8, 26, 50, 3, C.border), { t: 'translate(520 520) rotate(-6)' });
  return [s, extra];
}

// @@CHUNK4@@

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */
const FILES = [
  ['hero-platform', 'VQ ERP dashboard with revenue chart, orders table, a mobile sales app and a live CRM chat card', heroPlatform],
  ['erp-dashboard', 'ERP overview dashboard with finance, purchase, sales and production modules, cash-flow chart and approvals', erpDashboard],
  ['crm-pipeline', 'CRM sales pipeline board with lead, qualified, proposal and won stages beside a customer chat thread', crmPipeline],
  ['lms-platform', 'Learning platform course player with video lesson, lesson list, progress ring, certificate badge and quiz', lmsPlatform],
  ['inventory-wms', 'Warehouse management screen with stock table, bin heatmap and a handheld barcode scanner', inventoryWms],
  ['pos-system', 'Point of sale checkout on a tablet with product grid, cart, total, payment button and receipt printer', posSystem],
  ['seo-analytics', 'SEO dashboard with rising organic traffic, keyword rankings, page speed score and a search result preview', seoAnalytics],
  ['digital-marketing', 'Digital marketing campaign dashboard with conversion funnel, leads by channel, social post and email campaign results', digitalMarketing],
  ['custom-software', 'Code editor with passing tests beside a system architecture diagram linking web, mobile, API, services and database', customSoftware],
  ['mobile-apps', 'Three mobile app screens showing order history, live delivery tracking on a map and a customer profile', mobileApps],
  ['integrations', 'Integration hub connecting ERP, CRM, e-commerce, payments, accounting, messaging and warehouse systems', integrations],
  ['web-development', 'Responsive business website shown in a desktop browser, a tablet and a phone', webDevelopment],
  ['analytics-reporting', 'Business intelligence report with KPIs, revenue trend, regional sales map, category bars, revenue mix and weekday heatmap', analyticsReporting],
  ['team-collaboration', 'Diverse team working at desks with dashboard monitors while a colleague presents a sprint review on a wall screen', teamCollaboration],
  ['warehouse-operations', 'Warehouse with tall pallet racks, a forklift and a worker in a hi-vis vest scanning stock, with a stock levels tablet', warehouseOperations],
  ['oil-gas-operations', 'Oil and gas facility with storage tanks, refinery towers, pipelines, a fuel tanker and a field engineer with a tablet showing tank levels', oilGasOperations],
  ['manufacturing-floor', 'Factory production line with conveyor and robotic arms, an operator at a control panel and an OEE and work orders card', manufacturingFloor],
  ['distribution-logistics', 'Distribution centre loading docks with trucks, pallets, a forklift and a delivery route map card', distributionLogistics],
  ['retail-store', 'Retail store with stocked shelves, a cashier at the POS counter, a customer with a shopping bag and a branch sales card', retailStore],
  ['construction-projects', 'Construction site with tower crane and building frame, a site manager with a tablet and a budget versus actual card', constructionProjects],
  ['education-training', 'Learners with laptops in a training room following a live online class, with a course progress card', educationTraining],
  ['data-center', 'Data centre with server racks, databases, a secure cloud and an engineer at a laptop monitoring uptime', dataCenter],
  ['field-services', 'Field technician beside a service van with a tablet, a map pin at the customer site and a daily job schedule', fieldServices],
  ['consultation-meeting', 'Discovery workshop with a consultant presenting a process flow on a whiteboard to two colleagues at a table', consultationMeeting],
];

const only = process.argv.slice(2);
mkdirSync(OUT_DIR, { recursive: true });
for (const [name, title, fn] of FILES) {
  if (only.length && !only.includes(name)) continue;
  P = name; uid = 0;
  const res = fn();
  const out = Array.isArray(res) ? svgDoc(name, title, res[0], res[1]) : svgDoc(name, title, res);
  writeFileSync(path.join(OUT_DIR, `${name}.svg`), out, 'utf8');
  console.log(`${name}.svg  ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB`);
}
