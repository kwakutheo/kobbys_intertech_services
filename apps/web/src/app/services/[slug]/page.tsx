import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/site";
import { HeroSection } from "@/components/hero-section";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) {
    return {
      title: "Service Not Found | Kobby's Intertech Services",
    };
  }
  return {
    title: `${service.name} Installation & Support | Kobby's Intertech Services`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  // Find other services for related cross-navigation
  const otherServices = services.filter((s) => s.slug !== service.slug);

  const whatsappHref = `https://wa.me/233243487160?text=${encodeURIComponent(
    service.whatsappMessage,
  )}`;

  return (
    <main className="service-detail-page">
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <HeroSection
        eyebrowParts={["SERVICES", service.badge.toUpperCase(), "GHANA"]}
        title={service.name}
        lead={service.tagline}
        backgroundImage={service.image}
        primaryAction={{
          href: `/book-service?service=${service.slug}`,
          label: "Book this service",
        }}
        secondaryAction={{
          href: `/request-quote?service=${service.slug}`,
          label: "Request a quotation",
        }}
        cardRows={[
          {
            value: "Certified Tech",
          },
        ]}
      />

      {/* ── 2. WhatsApp Fast-Track Advisory Ribbon ─────────────────── */}
      <aside className="service-advisory-ribbon" aria-label="Quick Technical Support">
        <div className="service-advisory-inner">
          <div className="service-advisory-text">
            <div className="service-advisory-info">
              <h4>Need Immediate Advice for {service.name}?</h4>
              <p>Chat directly with our lead technician or book a preliminary site survey.</p>
            </div>
          </div>
          <div className="service-advisory-actions">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="service-wa-btn"
            >
              <span>Chat on WhatsApp</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href="tel:+233243487160" className="service-call-btn">
              <span>Call +233 24 348 7160</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ── 3. What We Deliver (Inclusions) ────────────────────────── */}
      <section className="service-section">
        <div className="service-section-header">
          <span className="service-section-eyebrow">WHAT WE DELIVER</span>
          <h2 className="service-section-title">Comprehensive {service.name} scope.</h2>
          <p className="service-section-subtitle">
            {service.description} Everything is installed according to certified electrical, network, and safety standards.
          </p>
        </div>

        <div className="service-inclusions-grid">
          {service.inclusions.map((item) => (
            <div key={item} className="service-inclusion-card">
              <div className="service-inclusion-icon-chip" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="service-inclusion-text">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Technical Specifications & Standards ─────────────────── */}
      <section className="service-section">
        <div className="service-specs-box">
          <div className="service-specs-box-header">
            <span className="service-section-eyebrow" style={{ color: "#ff6e82" }}>
              TECHNICAL STANDARDS
            </span>
            <h2 className="service-section-title">Hardware grades &amp; performance benchmarks.</h2>
            <p className="service-section-subtitle">
              We never cut corners with substandard materials. Every component is selected for tropical heat endurance, surge resilience, and long-term uptime.
            </p>
          </div>

          <div className="service-specs-grid">
            {service.technicalSpecs.map((spec) => (
              <div key={spec.label} className="service-spec-item">
                <span className="service-spec-label">{spec.label}</span>
                <span className="service-spec-value">{spec.value}</span>
                <p className="service-spec-detail">{spec.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Engineering & Execution Workflow (4 Steps) ──────────── */}
      <section className="service-section">
        <div className="service-section-header">
          <span className="service-section-eyebrow">THE EXECUTION PROCESS</span>
          <h2 className="service-section-title">How we deliver from survey to handover.</h2>
          <p className="service-section-subtitle">
            A reliable 4-step deployment methodology ensuring full accountability, clean workmanship, and zero surprises.
          </p>
        </div>

        <div className="service-workflow-grid">
          {service.workflow.map((step) => (
            <article key={step.step} className="service-workflow-card">
              <div className="service-step-badge">{step.step}</div>
              <h3 className="service-step-title">{step.title}</h3>
              <p className="service-step-desc">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 6. Key Advantages & Measurable Value ───────────────────── */}
      <section className="service-section">
        <div className="service-section-header">
          <span className="service-section-eyebrow">KEY ADVANTAGES</span>
          <h2 className="service-section-title">Why trust Kobby&apos;s Intertech for {service.name}.</h2>
          <p className="service-section-subtitle">
            Engineered solutions tailored to keep your operations connected, secure, and running smoothly across Ghana.
          </p>
        </div>

        <div className="service-benefits-grid">
          {service.benefits.map((benefit) => (
            <div key={benefit.title} className="service-benefit-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Target Sectors & Ideal Applications ─────────────────── */}
      <section className="service-section">
        <div className="service-section-header">
          <span className="service-section-eyebrow">IDEAL APPLICATIONS</span>
          <h2 className="service-section-title">Built for diverse property types &amp; industries.</h2>
          <p className="service-section-subtitle">
            Whether securing a family residence or provisioning a multi-location enterprise network, our solutions are customized to your exact environment.
          </p>
        </div>

        <div className="service-sectors-row">
          {service.idealFor.map((sector) => (
            <div key={sector} className="service-sector-chip">
              <span className="service-sector-dot" aria-hidden="true" />
              <span>{sector}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Explore Other Services ──────────────────────────────── */}
      <section className="service-section">
        <div className="service-section-header">
          <span className="service-section-eyebrow">CROSS-COMPATIBLE SOLUTIONS</span>
          <h2 className="service-section-title">Explore our other specialised services.</h2>
          <p className="service-section-subtitle">
            Most properties benefit from integrated technology. Combine your {service.name} with our other professional installations.
          </p>
        </div>

        <div className="service-related-grid">
          {otherServices.slice(0, 3).map((other) => (
            <Link
              key={other.slug}
              href={`/services/${other.slug}`}
              className="service-related-card"
            >
              <div>
                <span className="service-related-badge">{other.badge}</span>
                <h3>{other.name}</h3>
                <p>{other.summary}</p>
              </div>
              <span className="service-related-link">
                <span>View service details</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 9. Grand Executive Bottom CTA Banner ───────────────────── */}
      <section className="service-section">
        <aside className="service-cta-banner">
          <div className="service-cta-copy">
            <div className="service-cta-eyebrow">GET STARTED TODAY</div>
            <h2>Ready to deploy {service.name}?</h2>
            <p>
              Speak directly with our technical team today. We provide upfront site surveys, transparent itemised quotations, and certified installation across Ghana.
            </p>
          </div>
          <div className="service-cta-btns">
            <Link
              href={`/book-service?service=${service.slug}`}
              className="service-btn-primary"
            >
              <span>Book a Service</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={`/request-quote?service=${service.slug}`}
              className="service-btn-secondary"
            >
              <span>Request Quotation</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
