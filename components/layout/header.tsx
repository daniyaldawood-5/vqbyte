import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DesktopNavigation, MobileNavigation } from "./site-navigation";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="header-shell">
        <Link href="/" className="brand-link" aria-label="VQBYTE home">
          <Image src="/brand/vqbyte-logo.svg" alt="VQBYTE" width={150} height={50} priority />
        </Link>
        <DesktopNavigation />
        <Link className="button button-primary header-cta" href="/contact">
          Free consultation <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <MobileNavigation />
      </div>
    </header>
  );
}
