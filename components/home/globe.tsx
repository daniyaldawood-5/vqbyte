"use client";
import { useEffect, useRef } from "react";

type LatLng = [number, number];

/* Real-world industry hubs (illustrative — not client locations). Colours are RGB 0–1. */
const OIL: [number, number, number] = [0.96, 0.62, 0.04]; // amber
const TRADE: [number, number, number] = [0.02, 0.66, 0.9]; // brand cyan
const MAKE: [number, number, number] = [0.49, 0.36, 1]; // violet

const hubs: { name: string; at: LatLng; color: [number, number, number]; size: number }[] = [
  // Oil & gas
  { name: "Houston", at: [29.76, -95.37], color: OIL, size: 0.04 },
  { name: "Dubai", at: [25.2, 55.27], color: OIL, size: 0.045 },
  { name: "Riyadh", at: [24.71, 46.68], color: OIL, size: 0.035 },
  { name: "Doha", at: [25.29, 51.53], color: OIL, size: 0.03 },
  { name: "Aberdeen", at: [57.15, -2.09], color: OIL, size: 0.03 },
  { name: "Karachi", at: [24.86, 67.0], color: OIL, size: 0.035 },
  { name: "Lagos", at: [6.52, 3.38], color: OIL, size: 0.03 },
  // Logistics & trade
  { name: "Singapore", at: [1.35, 103.82], color: TRADE, size: 0.04 },
  { name: "Rotterdam", at: [51.92, 4.48], color: TRADE, size: 0.035 },
  { name: "Shanghai", at: [31.23, 121.47], color: TRADE, size: 0.04 },
  { name: "Los Angeles", at: [33.74, -118.27], color: TRADE, size: 0.035 },
  { name: "Jeddah", at: [21.49, 39.19], color: TRADE, size: 0.03 },
  { name: "Toronto", at: [43.65, -79.38], color: TRADE, size: 0.03 },
  // Manufacturing
  { name: "Lahore", at: [31.52, 74.36], color: MAKE, size: 0.035 },
  { name: "Shenzhen", at: [22.54, 114.06], color: MAKE, size: 0.035 },
  { name: "Stuttgart", at: [48.78, 9.18], color: MAKE, size: 0.03 },
  { name: "Istanbul", at: [41.0, 28.97], color: MAKE, size: 0.035 },
  { name: "Monterrey", at: [25.69, -100.32], color: MAKE, size: 0.03 },
];

/* Supply-chain lanes between hubs. */
const lanes: [LatLng, LatLng][] = [
  [[31.23, 121.47], [51.92, 4.48]],
  [[25.2, 55.27], [29.76, -95.37]],
  [[1.35, 103.82], [25.2, 55.27]],
  [[24.86, 67.0], [25.2, 55.27]],
  [[31.52, 74.36], [51.92, 4.48]],
  [[22.54, 114.06], [33.74, -118.27]],
  [[41.0, 28.97], [48.78, 9.18]],
];

const focusPhi = (lng: number) => Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);

export function Globe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    let globe: import("cobe").Globe | null = null;
    let frame = 0;
    let phi = focusPhi(45);
    let theta = 0.32;
    let velocity = 0;
    let thetaVelocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let disposed = false;

    async function start() {
      if (globe || disposed || !el) return;
      const { default: createGlobe } = await import("cobe");
      if (disposed || globe) return;
      const size = el.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      globe = createGlobe(el, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi,
        theta,
        dark: 0,
        diffuse: 1.15,
        mapSamples: mobile ? 9000 : 18000,
        mapBrightness: 9,
        mapBaseBrightness: 0,
        baseColor: [0.62, 0.78, 0.9],
        markerColor: TRADE,
        glowColor: [0.8, 0.91, 0.98],
        opacity: 0.95,
        markers: hubs.map((h) => ({ location: h.at, size: h.size, color: h.color })),
        arcs: lanes.map(([from, to]) => ({ from, to })),
        arcColor: [0, 0.47, 0.66],
        arcWidth: 0.45,
        arcHeight: 0.28,
        markerElevation: 0.01,
      });
      const g = globe;
      const t0 = performance.now();
      let n = 0;
      // cobe v2 has no internal loop: drive rotation, pulsing signals and live links ourselves.
      const tick = (now: number) => {
        if (globe !== g) return;
        if (!dragging) {
          phi += velocity;
          thetaVelocity *= 0.92;
          theta = Math.max(-0.6, Math.min(0.9, theta + thetaVelocity));
          velocity *= 0.95;
          if (!reduced) phi += 0.0025;
        }
        const state: Partial<import("cobe").COBEOptions> = { phi, theta };
        if (!reduced && n++ % 2 === 0) {
          const t = Math.max(0, now - t0) / 1000; // rAF timestamps can predate t0
          // Signal pulse: each hub breathes on its own phase.
          state.markers = hubs.map((h, i) => ({
            location: h.at,
            color: h.color,
            size: h.size * (1 + 0.45 * Math.max(0, Math.sin(t * 2.4 + i * 1.7))),
          }));
          // Live links: three lanes are "transmitting" at a time, rotating every 1.6s.
          const step = Math.floor(t / 1.6);
          state.arcs = [0, 1, 2].map((k) => {
            const [from, to] = lanes[(step + k * 2) % lanes.length];
            return { from, to };
          });
        }
        g.update(state);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      setTimeout(() => el.classList.add("is-ready"), 120);
    }

    function stop() {
      cancelAnimationFrame(frame);
      globe?.destroy();
      globe = null;
    }

    // Only run the WebGL loop while the globe is (nearly) on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: "200px" });
    io.observe(box);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      phi += dx * 0.006;
      velocity = dx * 0.0015;
      theta = Math.max(-0.6, Math.min(0.9, theta + dy * 0.005));
      thetaVelocity = dy * 0.0008;
    };
    const up = () => {
      dragging = false;
      el.classList.remove("is-dragging");
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (globe) {
          stop();
          start();
        }
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      io.disconnect();
      stop();
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="globe-wrap" ref={wrap}>
      <canvas ref={canvas} className="globe-canvas" aria-label="Interactive globe showing oil and gas, logistics and manufacturing hubs" role="img" />
    </div>
  );
}
