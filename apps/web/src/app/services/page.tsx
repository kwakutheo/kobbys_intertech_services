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
            value: `${services.length}`,
            label: "specialised service areas",
          },
          {
            icon: "shield",
            value: "Nationwide",
            label: "residential & corporate",
          },
        ]}
      />

      <section className="section">
        <div className="service-list">
          {services.map((service, index) => (
            <article key={service.slug}>
              <span>0{index + 1}</span>
              <div>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </div>
              <Link className="text-link" href={`/services/${service.slug}`}>
                View details <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
