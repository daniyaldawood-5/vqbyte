"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/navigation";

export function DesktopNavigation() {
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        buttons.current[open]?.focus();
        setOpen(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="desktop-nav" aria-label="Primary navigation" onMouseLeave={() => setOpen(null)}>
      {navigation.map((group) => (
        <div className={`nav-group ${open === group.label ? "is-open" : ""}`} key={group.label}>
          <button
            ref={(node) => {
              buttons.current[group.label] = node;
            }}
            aria-expanded={open === group.label}
            onClick={() => setOpen(open === group.label ? null : group.label)}
            onMouseEnter={() => setOpen(group.label)}
          >
            {group.label}
            <ChevronDown size={15} aria-hidden="true" />
          </button>
          {open === group.label && (
            <div className={`mega-menu cols-${group.columns.length}`}>
              <div className="mega-columns">
                {group.columns.map((col) => (
                  <div key={col.title}>
                    <p className="mega-label">{col.title}</p>
                    <ul>
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={() => setOpen(null)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {group.href && (
                <Link className="mega-featured" href={group.href} onClick={() => setOpen(null)}>
                  View all {group.label.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
      <Link className="nav-link" href="/insights">
        Insights
      </Link>
    </nav>
  );
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
        opener.current?.focus();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...(panel.current?.querySelectorAll<HTMLElement>("button,a,summary") ?? [])];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("button")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div className="mobile-menu">
      <button ref={opener} aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}>
        <Menu aria-hidden="true" />
      </button>
      {open && (
        <div ref={panel} className="mobile-panel" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="mobile-panel-head">
            <Image src="/brand/vqbyte-logo.svg" alt="VQBYTE" width={130} height={43} />
            <button aria-label="Close navigation" onClick={close}>
              <X aria-hidden="true" />
            </button>
          </div>
          {navigation.map((group) => (
            <details key={group.label} className="mobile-group">
              <summary>
                {group.label}
                <ChevronDown size={17} aria-hidden="true" />
              </summary>
              <div>
                {group.href && (
                  <Link href={group.href} onClick={close}>
                    <strong>All {group.label.toLowerCase()}</strong>
                  </Link>
                )}
                {group.columns
                  .flatMap((c) => c.items)
                  .map((item) => (
                    <Link href={item.href} key={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  ))}
              </div>
            </details>
          ))}
          <Link className="mobile-single" href="/insights" onClick={close}>
            Insights
          </Link>
          <div className="mobile-actions">
            <Link className="button button-primary" href="/contact" onClick={close}>
              Free consultation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
