import Link from "next/link";
import { services } from "@/data/site";

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-container">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span>TECHNOLOGY</span>
              <span className="hero-dot">·</span>
              <span>SECURITY</span>
              <span className="hero-dot">·</span>
              <span>COMMUNICATION</span>
            </p>
            <h1 className="hero-title">
              Technology that keeps your world <br className="hero-br" />
              connected.
            </h1>
            <p className="hero-lead">
              Professional installation, support and practical technology solutions for homes and businesses across Ghana.
            </p>
            <div className="hero-actions">
              <Link className="hero-button-primary" href="/book-service">
                Book a service <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
              <Link className="hero-link-secondary" href="/services">
                Explore our services <span aria-hidden="true" className="link-arrow">↗</span>
              </Link>
            </div>
          </div>

          <aside className="hero-card" aria-label="Key operational details">
            <div className="hero-card-row">
              <div className="hero-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div className="hero-card-info">
                <strong className="hero-card-value">{services.length}</strong>
                <span className="hero-card-label">core service areas</span>
              </div>
            </div>

            <div className="hero-card-divider" />

            <div className="hero-card-row">
              <div className="hero-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="hero-card-info">
                <strong className="hero-card-value">Mon–Sat</strong>
                <span className="hero-card-label">7:30 am–5:00 pm</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">What we do</p>
          <h2>Solutions Tailored to Your Needs.</h2>
          <p>From a new installation to troubleshooting and ongoing support, we help you make the right technical decisions.</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.slug}>
              <span className="service-number">0{index + 1}</span>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <Link href={`/services/${service.slug}`}>
                Explore service <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-heading">
          <p className="eyebrow">Why Kobby&apos;s Intertech</p>
          <h2>Professional service, clear communication, dependable results.</h2>
        </div>
        <div className="principles">
          <p>We bring technology, security and communication solutions together in one trusted service.</p>
          <ul>
            <li><span>01</span> Customer-focused advice</li>
            <li><span>02</span> Reliable installation and support</li>
            <li><span>03</span> Professional, transparent service</li>
          </ul>
        </div>
      </section>

      <section className="contact-section">
        <div>
          <p className="eyebrow">Let&apos;s get started</p>
          <h2>Tell us how we can help.</h2>
          <p>For a quotation, booking or general enquiry, get in touch with our team.</p>
        </div>
        <div className="contact-actions">
          <Link className="button" href="/contact">Contact us</Link>
          <a className="text-link dark-link" href="https://wa.me/233243487160">
            WhatsApp +233 24 348 7160 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
