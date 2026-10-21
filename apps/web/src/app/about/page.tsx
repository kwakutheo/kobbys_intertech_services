import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "About | Kobby's Intertech Services",
  description:
    "Learn about Kobby's Intertech Services, providing practical technology, security, connectivity and electrical solutions for homes and businesses in Ghana.",
};

const COMPANY_VALUES = [
  {
    title: "Professionalism",
    description:
      "We approach every job with careful planning, clear communication and attention to detail. We aim to complete installations neatly, safely and in line with the requirements of each property.",
  },
  {
    title: "Integrity",
    description:
      "We believe in honest advice, clear quotations and practical recommendations. We explain available options and costs so customers can make informed decisions before work begins.",
  },
  {
    title: "Customer Focus",
    description:
      "Every customer has different needs, budgets and site conditions. We listen first, assess the work required and recommend suitable solutions for the customer's home, shop, office or business.",
  },
  {
    title: "Practical Innovation",
    description:
      "We help customers make effective use of modern technology, from CCTV cameras and internet connectivity to computer networks and GPS tracking, choosing solutions that suit their needs and available budget.",
  },
  {
    title: "Dependability",
    description:
      "We aim to deliver installations that work as intended, explain how to use the systems we install and provide support based on the service agreed with each customer.",
  },
  {
    title: "Teamwork",
    description:
      "We value cooperation, respect and clear coordination throughout each project. Where a job requires additional specialist expertise, we recognise the importance of involving suitably qualified professionals.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["ABOUT US", "MISSION", "EXPERTISE"]}
        title={
          <>
            Practical technology solutions for the people and businesses that depend on them.
          </>
        }
        lead="Kobby's Intertech Services provides practical technology, security, connectivity and electrical solutions for homes, shops, offices, schools and businesses in Ghana."
        primaryAction={{
          href: "/services",
          label: "Explore our services",
        }}
        secondaryAction={{
          href: "/contact",
          label: "Get in touch",
        }}
        cardRows={[
          {
            value: "About Us",
          },
        ]}
      />

      <section className="about-mission-section">
        <div className="about-mission-card">
          <div className="about-mission-left">
            <div className="about-mission-badge">
              <span className="about-mission-dot" aria-hidden="true" />
              <span className="eyebrow">Our mission</span>
            </div>
            <h2 className="about-mission-title">
              Making everyday technology more useful, secure and dependable.
            </h2>
          </div>

          <div className="about-mission-right">
            <div className="about-mission-quote">
              <p className="about-mission-lead">
                Our mission is to help individuals and businesses in Ghana address everyday security, connectivity and technical challenges through suitable solutions, careful installation and clear customer support. We consider each customer's needs, site conditions and budget before recommending the way forward.
              </p>
            </div>
            <div className="about-mission-pillars">
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Better Security</span>
              </div>
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Practical Solutions</span>
              </div>
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Reliable Connectivity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-values-header">
          <p className="eyebrow">Our values</p>
          <h2 className="about-values-heading">The principles behind how we serve our customers.</h2>
        </div>
        <div className="about-values-grid">
          {COMPANY_VALUES.map((item) => (
            <article key={item.title} className="about-value-card">
              <h3 className="about-value-title">{item.title}</h3>
              <p className="about-value-desc">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-vision-section">
        <div className="about-vision-card">
          <div className="about-vision-copy">
            <div className="about-vision-badge">
              <span className="about-vision-dot" aria-hidden="true" />
              <span className="eyebrow">Our vision</span>
            </div>
            <h2 className="about-vision-title">
              To become a trusted technology and technical services provider for homes and businesses across Ghana.
            </h2>
            <p className="about-vision-lead">
              We aim to build lasting customer relationships by providing suitable technology and infrastructure solutions, communicating clearly about costs and requirements, and helping customers get practical value from the systems installed at their properties.
            </p>
          </div>

          <div className="about-vision-highlights">
            <div className="about-vision-item">
              <div className="about-vision-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <strong>Service Across Ghana</strong>
                <p>Contact us with your location and requirements so we can confirm whether we can undertake the work and arrange a suitable site visit where necessary.</p>
              </div>
            </div>

            <div className="about-vision-item">
              <div className="about-vision-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <strong>Security &amp; Connectivity Solutions</strong>
                <p>Practical CCTV, internet, networking, satellite TV, GPS tracking and electrical services tailored to the needs and conditions of each project.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}