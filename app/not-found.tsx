import Link from "next/link";
import { services } from "@/content/services";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublicSettings } from "@/lib/settings";

export default async function NotFound() {
  const settings = await getPublicSettings();
  return (
    <>
      <Header />
      <main id="main" className="not-found container">
        <p className="eyebrow">404</p>
        <h1>We couldn&apos;t find that page</h1>
        <p className="lede">The page may have moved. Try one of these instead:</p>
        <ul className="tag-list">
          {services.slice(0, 6).map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`}>{s.short}</Link>
            </li>
          ))}
        </ul>
        <div className="actions">
          <Link className="button button-primary" href="/">Go to homepage</Link>
          <Link className="button button-secondary" href="/contact">Contact us</Link>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
