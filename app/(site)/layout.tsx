import "../motion.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookiePreferences } from "@/components/layout/cookie-preferences";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema } from "@/lib/seo";
import { getPublicSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  return (
    <>
      <JsonLd data={organizationSchema(settings)} />
      <Header />
      {children}
      <Footer settings={settings} />
      <CookiePreferences gaId={settings.gaId} />
      <RevealObserver />
      <CustomCursor />
    </>
  );
}
