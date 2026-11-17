import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/site";
import { HeroSection } from "@/components/hero-section";

export const metadata: Metadata = {
  title: "Technical & Technology Services",
  description:
    "Explore our six core services in Ghana: CCTV security, fibre & satellite internet, enterprise networking, satellite TV, electrical installations, and GPS vehicle tracking.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Technical & Technology Services | Kobby's Intertech Services",
    description:
      "Explore our six core services in Ghana: CCTV security, fibre & satellite internet, enterprise networking, satellite TV, electrical installations, and GPS vehicle tracking.",
    url: "/services",
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Services by Kobby's Intertech Services Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical & Technology Services | Kobby's Intertech Services",
    description:
      "Explore our six core services in Ghana: CCTV security, fibre & satellite internet, enterprise networking, satellite TV, electrical installations, and GPS vehicle tracking.",
    images: ["/hero_section_background.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["OUR SERVICES", "SOLUTIONS", "INSTALLATION"]}
        title={
          <>
            Practical expertise for <br className="hero-br" />
            connected, secure spaces.
          </>
        }
        lead="Explore the complete suite of technology, security and communication services available from Kobby's Intertech Services in Ghana."
        primaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        secondaryAction={{
          href: "/request-quote",
          label: "Request a quotation",
        }}
        cardRows={[
          {
            value: "Our Services",
          },
        ]}
      />

      <section className="section services-page-section">
        <div className="service-list">
          {services.map((service) => (
            <article key={service.slug} className="service-row-card">
              <div className="service-row-content">
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </div>
              <div className="service-row-action">
                <Link className="service-row-link" href={`/services/${service.slug}`}>
                  View details <span aria-hidden="true" className="link-arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
