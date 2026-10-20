import Link from "next/link";
import { services } from "@/data/site";
import { getApiBaseUrl } from "@/lib/api-url";
import { HomeGalleryCarousel } from "@/components/home-gallery-carousel";

async function getGalleryPhotos() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/gallery`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const galleryPhotos = await getGalleryPhotos();

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-container">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span>TECHNOLOGY</span>
              <span className="hero-dot">|</span>
              <span>SECURITY</span>
              <span className="hero-dot">|</span>
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
              <div className="hero-card-info">
                <strong className="hero-card-value">Home</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Recent Project Installations Carousel (First 10 Admin-Uploaded Photos + Curated Fallbacks) */}
      <HomeGalleryCarousel photos={galleryPhotos} />

      <section className="svc-section">
        <div className="svc-heading">
          <h2>Professional tech solutions tailored to your needs.</h2>
          <p>From a new installation to troubleshooting and ongoing support, we help you make the right technical decisions.</p>
        </div>
        <div className="svc-grid">
          {services.map((service, index) => (
            <Link href={`/services/${service.slug}`} key={service.slug} className="svc-card">
              <span className="svc-card-img" style={{ backgroundImage: `url(${service.image})` }} aria-hidden="true" />
              <span className="svc-card-overlay" />
              <span className="svc-card-body">
                <span className="svc-card-num">0{index + 1}</span>
                <span className="svc-card-name">{service.name}</span>
                <span className="svc-card-summary">{service.summary}</span>
                <span className="svc-card-cta">Explore service <span aria-hidden="true">↗</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>


      <section className="why-section">
        <div className="why-container">
          <div className="why-copy">
            <p className="eyebrow">Why Kobby&apos;s Intertech</p>
            <h2>Professional service, clear communication, dependable results.</h2>
            <p className="why-lead">
              We bring technology, security and communication solutions together in one trusted service.
            </p>
            <div className="why-trust-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Experienced technicians &amp; ongoing technical support across Ghana</span>
            </div>
          </div>

          <div className="why-pillars">
            <div className="why-pillar-card">
              <span className="why-pillar-num">01</span>
              <div className="why-pillar-text">
                <h3>Customer-focused advice</h3>
                <p>Objective technical guidance configured around your actual property layout, operational requirements, and budget.</p>
              </div>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">02</span>
              <div className="why-pillar-text">
                <h3>Reliable installation and support</h3>
                <p>Certified equipment, clean professional cabling, thorough system testing, and dependable after-sales maintenance.</p>
              </div>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">03</span>
              <div className="why-pillar-text">
                <h3>Professional, transparent service</h3>
                <p>Direct communication, upfront project scoping, honest timelines, and accountability from start to finish.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
