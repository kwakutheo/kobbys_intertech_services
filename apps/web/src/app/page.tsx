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
              <span>CONNECTIVITY</span>
            </p>
            <h1 className="hero-title">
              Practical technology for a <br className="hero-br" />
              more connected world.
            </h1>
            <p className="hero-lead">
              CCTV, internet, networking, satellite TV, GPS tracking and electrical services for homes and businesses in Ghana, with solutions tailored to your needs and budget.
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
          <h2>Technology and technical services for everyday needs.</h2>
          <p>From installation and upgrades to troubleshooting, we provide practical connectivity solutions for your property or business.</p>
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
                <span className="service-row-link">
                  View details <span aria-hidden="true" className="link-arrow">→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>


      <section className="why-section">
        <div className="why-container">
          <div className="why-copy">
            <p className="eyebrow">Why Kobby&apos;s Intertech</p>
            <h2>Practical advice, clear quotations and service you can discuss with confidence.</h2>
            <p className="why-lead">
              We bring security, connectivity and technical services together, helping customers find suitable solutions for their homes, shops, offices and other properties.
            </p>
            <div className="why-trust-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Solutions tailored to your needs, property and budget</span>
            </div>
          </div>

          <div className="why-pillars">
            <div className="why-pillar-card">
              <div className="why-pillar-text">
                <h3>Advice based on your needs</h3>
                <p>We consider your property layout, intended use, available infrastructure and budget before recommending suitable equipment or installation options.</p>
              </div>
            </div>

            <div className="why-pillar-card">
              <div className="why-pillar-text">
                <h3>Careful installation and testing</h3>
                <p>We aim for neat workmanship, appropriate equipment selection and practical system checks. Maintenance and troubleshooting arrangements can be discussed according to your needs.</p>
              </div>
            </div>

            <div className="why-pillar-card">
              <div className="why-pillar-text">
                <h3>Clear and transparent communication</h3>
                <p>We explain the proposed work, relevant costs and expected timelines before proceeding, and discuss any changes that may affect the agreed scope or price.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}