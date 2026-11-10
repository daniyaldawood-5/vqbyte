"use client";
import { useEffect, useRef } from "react";

/**
 * Brand cursor: a precise dot plus a trailing ring that grows over links and buttons.
 * Only enabled for mouse/trackpad users who haven't asked for reduced motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !dot.current || !ring.current) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    const d = dot.current;
    const r = ring.current;
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      root.classList.remove("cursor-hidden");
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const interactive = target?.closest("a, button, summary, select, label, [role='button']");
      const text = target?.closest("input, textarea");
      r.classList.toggle("is-hover", Boolean(interactive) && !text);
      r.classList.toggle("is-text", Boolean(text));
      d.classList.toggle("is-text", Boolean(text));
    };
    const down = () => r.classList.add("is-down");
    const up = () => r.classList.remove("is-down");
    const leave = () => root.classList.add("cursor-hidden");
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
