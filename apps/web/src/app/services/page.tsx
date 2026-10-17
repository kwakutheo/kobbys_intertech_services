import Link from "next/link";
import { services } from "@/data/site";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "Services | Kobby's Intertech Services",
  description:
    "Explore our complete range of services in CCTV, fibre-optic internet, networking, satellite, electrical works, and GPS tracking across Ghana.",
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
            icon: "grid",
            value: "Our Services",
            label: "6 specialised service areas",
          },
          {
            icon: "shield",
            value: "Nationwide",
            label: "residential & corporate",
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
