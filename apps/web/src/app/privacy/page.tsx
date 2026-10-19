import { HeroSection } from "@/components/hero-section";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Kobby's Intertech Services",
  description:
    "Learn how Kobby's Intertech Services collects, uses, and safeguards your personal and business information.",
};

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "We collect information necessary to provide our technology, security, and networking services. This includes personal contact details (such as your full name, email address, phone number, and physical or digital address) submitted through our enquiry, quote, and booking forms.",
      "For on-site installations and service assessments, we may also collect property location data, site specifications, service preferences, and equipment details relevant to executing the requested project.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "Your information is used strictly to fulfill your requested services, including preparing accurate project quotations, dispatching certified technicians, coordinating service schedules, and communicating technical recommendations.",
      "We may also use your contact details to provide project updates, invoices, follow-up maintenance notices, and customer support responses.",
    ],
  },
  {
    title: "3. Information Sharing & Third Parties",
    content: [
      "We do not sell, rent, or trade your personal data to any third parties.",
      "Information is only shared with authorized team members, assigned technicians, and trusted infrastructure providers (such as hosting and database services) necessary for operating our systems and delivering your requested services.",
    ],
  },
  {
    title: "4. Data Security & Storage",
    content: [
      "We implement industry-standard administrative and technical safeguards to protect your personal details against unauthorized access, alteration, disclosure, or destruction.",
      "Direct communication through our digital channels and contact forms is handled using secure transmission protocols.",
    ],
  },
  {
    title: "5. Your Rights & Choices",
    content: [
      "You have the right to request access to the personal data we hold about you, request corrections to inaccurate details, or ask for the deletion of your records where retention is no longer required for active service warranties or legal obligations.",
      "To submit a privacy inquiry or update your contact information, please contact our support team.",
    ],
  },
  {
    title: "6. Contact Us Regarding Privacy",
    content: [
      "If you have any questions or concerns about this Privacy Policy or our data handling practices, feel free to reach out to us directly:",
      "• Phone: +233 24 348 7160\n• Email: kobbysintertech@gmail.com\n• Location: Achimota, Accra – Ghana",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["LEGAL", "PRIVACY POLICY", "DATA PROTECTION"]}
        title={
          <>
            Your privacy and trust <br className="hero-br" />
            matter to us.
          </>
        }
        lead="We are committed to being transparent about how we collect, use, and protect your information when you request quotations, book technical services, or contact our team."
        cardRows={[
          {
            value: "Privacy Policy",
          },
        ]}
      />

      <section className="about-values-section" style={{ maxWidth: "1240px", margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ maxWidth: "860px" }}>
          <p className="eyebrow" style={{ marginBottom: "12px" }}>Transparency & Security</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.03em", marginBottom: "20px" }}>
            How we safeguard your information
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}>
            Last updated: October 2026. This Privacy Policy outlines the standards applied by Kobby’s Intertech Services across all our digital touchpoints and operational services in Ghana.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {PRIVACY_SECTIONS.map((section) => (
              <article
                key={section.title}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "28px 32px",
                }}
              >
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "14px", color: "var(--ink)" }}>
                  {section.title}
                </h3>
                {section.content.map((paragraph, index) => (
                  <p
                    key={index}
                    style={{
                      color: "var(--body)",
                      fontSize: "15px",
                      lineHeight: "1.65",
                      margin: index === 0 ? "0" : "12px 0 0",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div style={{ marginTop: "44px", display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href="/" className="button button-primary">
              Return Home
            </Link>
            <Link href="/contact" className="button button-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
