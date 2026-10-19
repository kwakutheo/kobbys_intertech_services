import Link from "next/link";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "FAQ | Kobby's Intertech Services",
  description:
    "Find answers to common questions about our security, internet, networking, satellite, and technical services in Ghana.",
};

const FAQ_ITEMS = [
  {
    question: "Which areas in Ghana do you serve?",
    answer:
      "Kobby’s Intertech Services is based in Achimota, Accra and provides on-site installations across Greater Accra, with certified technician dispatch nationwide across Ghana.",
  },
  {
    question: "How does the quotation and site assessment work?",
    answer:
      "Tell us what you need and your property location. We evaluate the project requirements, schedule an on-site survey where appropriate, and provide a clear, itemised quotation before work begins.",
  },
  {
    question: "Do you offer fixed prices?",
    answer:
      "Requirements vary by service, site scale, and equipment specifications. Quotations are tailored after technical details are evaluated to ensure you receive the most cost-effective and dependable setup.",
  },
  {
    question: "Do you offer emergency or weekend support?",
    answer:
      "Our core operational hours are Monday to Saturday, 7:30 am to 5:00 pm. For urgent security or network breakdowns, you can reach out via WhatsApp for fast priority scheduling.",
  },
  {
    question: "How quickly will your team respond to my message?",
    answer:
      "WhatsApp chats are typically answered within 15 to 30 minutes during business hours. Online contact form submissions and emails are reviewed within 2 to 4 business hours.",
  },
  {
    question: "How can I reach the team directly?",
    answer:
      "You can call or WhatsApp +233 24 348 7160, or email kobbysintertech@gmail.com directly. Our team is always ready to guide you.",
  },
  {
    question: "Do you provide ongoing maintenance after installation?",
    answer:
      "Yes. We provide scheduled servicing, equipment upgrades, CCTV storage maintenance, and technical troubleshooting for all our residential and commercial installations.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["FAQ", "HELP & SUPPORT", "ANSWERS"]}
        title={
          <>
            Helpful answers before <br className="hero-br" />
            you get started.
          </>
        }
        lead="Find answers to common questions about our service coverage, booking process, quotations, and scheduling. If you need something more specific, our team is ready to help."
        primaryAction={{
          href: "/contact",
          label: "Contact our team",
        }}
        secondaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        cardRows={[
          {
            value: "FAQ",
          },
        ]}
      />

      <section className="faq-page-section">
        <div className="faq-container-inner">
          <div className="faq-header">
            <div className="faq-badge">
              <span className="badge-dot" aria-hidden="true" />
              <span className="eyebrow">COMMON QUESTIONS &amp; ANSWERS</span>
            </div>
            <h2 className="faq-title">Helpful answers to common questions.</h2>
          </div>

          <div className="contact-faq-grid">
            {FAQ_ITEMS.map((faq) => (
              <details key={faq.question} className="contact-faq-item">
                <summary className="contact-faq-summary">
                  <span>{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </summary>
                <div className="contact-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="faq-bottom-cta">
            <div>
              <h3>Still have questions?</h3>
              <p>Can&apos;t find what you&apos;re looking for? Reach out to our technical team directly.</p>
            </div>
            <div className="faq-cta-buttons">
              <Link href="/contact" className="button button-small">
                Contact Us
              </Link>
              <a
                href="https://wa.me/233243487160"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
