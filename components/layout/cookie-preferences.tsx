"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY, loadAnalytics, readConsent } from "@/lib/analytics";

export function CookiePreferences() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (consent === "granted") loadAnalytics();
    // Show the banner shortly after load so it never blocks first paint.
    const timer = consent ? undefined : window.setTimeout(() => setVisible(true), 600);
    const reopen = () => setVisible(true);
    window.addEventListener("vqbyte:cookie-settings", reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("vqbyte:cookie-settings", reopen);
    };
  }, []);

  function choose(value: "granted" | "denied") {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage unavailable */ }
    if (value === "granted") loadAnalytics();
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <aside className="cookie-panel" aria-label="Cookie choices">
      <div>
        <strong>Cookies</strong>
        <p>We use optional analytics to improve this website. Nothing is tracked unless you allow it. <Link href="/legal/cookies">Cookie policy</Link></p>
      </div>
      <div className="cookie-actions">
        <button className="button button-secondary" onClick={() => choose("denied")}>Decline</button>
        <button className="button button-primary" onClick={() => choose("granted")}>Allow analytics</button>
      </div>
    </aside>
  );
}

export function CookieSettingsLink() {
  return <button type="button" className="footer-linkbtn" onClick={() => window.dispatchEvent(new Event("vqbyte:cookie-settings"))}>Cookie settings</button>;
}
