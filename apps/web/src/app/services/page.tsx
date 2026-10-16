import Link from "next/link";
import { services } from "@/data/site";

export const metadata = { title: "Services | Kobby's Intertech Services" };
export default function ServicesPage() { return <main><section className="page-hero"><p className="eyebrow">Our services</p><h1>Practical expertise for connected, secure spaces.</h1><p>Explore the services available from Kobby&apos;s Intertech Services in Ghana.</p></section><section className="section"><div className="service-list">{services.map((service, index) => <article key={service.slug}><span>0{index + 1}</span><div><h2>{service.name}</h2><p>{service.description}</p></div><Link className="text-link" href={`/services/${service.slug}`}>View details <span aria-hidden="true">→</span></Link></article>)}</div></section></main>; }
