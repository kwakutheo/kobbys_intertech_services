import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "About | Kobby's Intertech Services",
  description:
    "Learn about Kobby's Intertech Services — our mission, values, and dedication to delivering dependable technology, security and communication solutions in Ghana.",
};

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
            icon: "pin",
            value: "About Us",
            label: "More details below",
          },
          {
            icon: "clock",
            value: "Mon–Sat",
            label: "7:30 am–5:00 pm",
          },
        ]}
      />

      <section className="section split-section">
        <div>
          <p className="eyebrow">Our mission</p>
          <h2>Empowering people and businesses to thrive in the digital age.</h2>
        </div>
        <p>
          We are committed to delivering reliable, innovative and cost-effective services that enhance security, streamline operations and foster seamless communication.
        </p>
      </section>

      <section className="section">
        <p className="eyebrow">Our values</p>
        <div className="value-grid">
          {["Professionalism", "Integrity", "Customer focus", "Innovation", "Reliability", "Teamwork"].map(
            (value, index) => (
              <article key={value}>
                <span>0{index + 1}</span>
                <h3>{value}</h3>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="section muted-section">
        <p className="eyebrow">Our vision</p>
        <h2>To be a leading provider of technology, security and communication solutions in Ghana.</h2>
      </section>
    </main>
  );
}
