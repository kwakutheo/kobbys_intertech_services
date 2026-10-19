import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "About | Kobby's Intertech Services",
  description:
    "Learn about Kobby's Intertech Services — our mission, values, and dedication to delivering dependable technology, security and communication solutions in Ghana.",
};

const COMPANY_VALUES = [
  {
    title: "Professionalism",
    description:
      "We deliver disciplined technical execution, adhering to certified installation standards, safety guidelines, and clear, respectful communication.",
  },
  {
    title: "Integrity",
    description:
      "We prioritize honesty, transparent quotations, and authentic technical recommendations tailored strictly to solve your genuine requirements.",
  },
  {
    title: "Customer Focus",
    description:
      "Your property, security, and operational uptime come first. We listen carefully, customize each setup, and provide responsive ongoing care.",
  },
  {
    title: "Innovation",
    description:
      "We continuously adopt modern tools and infrastructure, providing fast fibre internet, smart surveillance, and dependable digital systems.",
  },
  {
    title: "Reliability",
    description:
      "Engineered for long-term performance and high uptime, our installations minimize disruptions and ensure dependable day-to-day operation.",
  },
  {
    title: "Teamwork",
    description:
      "Our team of certified technicians, network specialists, and support personnel work in harmony to deliver seamless and timely installations.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["ABOUT US", "MISSION", "EXPERTISE"]}
        title={
          <>
            Solutions built around the <br className="hero-br" />
            people who rely on them.
          </>
        }
        lead="Kobby's Intertech Services provides dependable technology, security and communication solutions for individuals and businesses across Ghana."
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
              Empowering people and businesses to thrive in the digital age.
            </h2>
          </div>

          <div className="about-mission-right">
            <div className="about-mission-quote">
              <p className="about-mission-lead">
                We are committed to delivering reliable, innovative and cost-effective services that enhance security, streamline operations and foster seamless communication.
              </p>
            </div>
            <div className="about-mission-pillars">
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Enhanced Security</span>
              </div>
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Streamlined Operations</span>
              </div>
              <div className="about-mission-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Seamless Connectivity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-values-header">
          <p className="eyebrow">Our values</p>
          <h2 className="about-values-heading">The core principles guiding everything we deliver.</h2>
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
              To be a leading provider of technology, security and communication solutions in Ghana.
            </h2>
            <p className="about-vision-lead">
              We are driven by a long-term commitment to empower homes and enterprises across Ghana through dependable infrastructure, forward-thinking innovation, and responsive technical support.
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
                <strong>Nationwide Reach</strong>
                <p>Delivering dependable, certified technical solutions throughout Ghana.</p>
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
                <strong>Modern Security &amp; Networks</strong>
                <p>Smart surveillance, high-speed fibre internet, and durable infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
