"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/navigation";

export function DesktopNavigation() {
  const [open, setOpen] = useState<string | null>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(null);
        buttons.current[open]?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return <nav className="desktop-nav" aria-label="Primary navigation" onMouseLeave={() => setOpen(null)}>
    {navigation.map((group) => <div className={`nav-group ${open === group.label ? "is-open" : ""}`} key={group.label}>
      <button ref={(node) => { buttons.current[group.label] = node }} aria-expanded={open === group.label} onClick={() => setOpen(open === group.label ? null : group.label)} onMouseEnter={() => setOpen(group.label)}>{group.label}<ChevronDown size={15} aria-hidden="true" /></button>
      {open === group.label && <div className="mega-menu"><p className="mega-label">Explore {group.label.toLowerCase()}</p><div className="mega-grid">{group.items.map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(null)}><strong>{item.label}</strong>{item.description && <span>{item.description}</span>}</Link>)}</div>{group.featured && <Link className="mega-featured" href={group.featured.href} onClick={() => setOpen(null)}>{group.featured.label} <span aria-hidden="true">→</span></Link>}</div>}
    </div>)}
  </nav>;
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") { setOpen(false); opener.current?.focus(); return; }
      if (event.key === "Tab") {
        const focusable = [...(panel.current?.querySelectorAll<HTMLElement>("button,a,summary") ?? [])].filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("button")?.focus());
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" };
  }, [open]);
  const close = () => setOpen(false);
  return <div className="mobile-menu"><button ref={opener} aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>{open && <div ref={panel} className="mobile-panel" role="dialog" aria-modal="true" aria-label="Site navigation"><div className="mobile-panel-head"><Image src="/brand/vqbyte-logo.svg" alt="VQBYTE" width={142} height={40} /><button aria-label="Close navigation" onClick={close}><X /></button></div>{navigation.map((group) => <details key={group.label} className="mobile-group"><summary>{group.label}<ChevronDown size={17} /></summary><div>{group.items.map((item) => <Link href={item.href} key={item.href} onClick={close}>{item.label}</Link>)}</div></details>)}<div className="mobile-actions"><Link className="button button-primary" href="/book-a-demo" onClick={close}>Book a Demo</Link><Link className="button button-secondary" href="/contact" onClick={close}>Contact</Link></div></div>}</div>;
}
