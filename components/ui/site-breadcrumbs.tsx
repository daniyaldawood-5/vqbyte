import Link from "next/link";
export function SiteBreadcrumbs({items}:{items:{label:string;href:string}[]}){return <nav className="breadcrumbs container" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li>{items.map((item,index)=><li key={item.href}>{index<items.length-1?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</li>)}</ol></nav>}
