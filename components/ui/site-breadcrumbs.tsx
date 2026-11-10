import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

export function SiteBreadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <JsonLd data={breadcrumbSchema(items.map((i) => ({ name: i.label, path: i.href })))} />
      <ol>
        <li><Link href="/">Home</Link></li>
        {items.map((item, index) => (
          <li key={item.href + index}>
            {index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
