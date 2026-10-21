import Link from "next/link";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "FAQ | Kobby's Intertech Services",
  description:
    "Find answers to common questions about CCTV, internet, networking, satellite TV, GPS tracking, electrical works and technical services in Ghana.",
};

const FAQ_ITEMS = [
  {
    question: "Which areas in Ghana do you serve?",
    answer:
      "We are based in Achimota, Accra, and serve customers in Greater Accra. For requests from other parts of Ghana, contact us with your town or location and the service you need. We will confirm whether we can undertake the work and discuss any applicable transport or site-visit costs before making arrangements.",
  },
  {
    question: "How does the quotation and site assessment work?",
    answer:
      "Tell us the service you need, your location and any relevant details about the property or equipment. We may ask for photos, measurements or other information to understand the job. Where an on-site assessment is necessary, we will discuss the arrangements and any applicable fee with you. We then provide a quotation for your review before work begins.",
  },
  {
    question: "Do you offer fixed prices?",
    answer:
      "The cost depends on the type of service, equipment required, size of the property and complexity of the installation. Some jobs may be quoted using the information you provide, while others require a site assessment. Your quotation will explain the proposed work and applicable costs. Any additional work should be discussed and agreed upon before it is carried out.",
  },
  {
    question: "Do you offer emergency or weekend support?",
    answer:
      "Our regular business hours are Monday to Saturday, 7:30 am to 5:00 pm. You can contact us about urgent issues outside these hours, but emergency attendance and after-hours support are not guaranteed. We will review your request and let you know whether assistance is available and when we can attend.",
  },
  {
    question: "How quickly will your team respond to my message?",
    answer:
      "We aim to respond to enquiries as soon as reasonably possible during business hours. Response times may vary depending on the number of enquiries, ongoing installations, network availability and the nature of your request. If your matter is urgent, please call or WhatsApp us and briefly explain the problem.",
  },
  {
    question: "How can I reach the team directly?",
    answer:
      "You can call or WhatsApp +233 24 348 7160, or email kobbysintertech@gmail.com. When contacting us, please describe the service you need and your location so we can understand your request and advise you on the next steps.",
  },
  {
    question: "Do you provide ongoing maintenance after installation?",
    answer:
      "Maintenance and troubleshooting can be discussed for CCTV systems, internet and network installations, satellite TV equipment, GPS tracking devices and other services we provide. The available support, service charges and visit arrangements depend on the equipment and the work required. Please contact us with details of your installation so we can advise you on suitable maintenance options.",
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
        lead="Find answers to common questions about our service coverage, quotations, site visits, working hours and technical support. If you have a specific requirement, contact us so we can discuss the next steps."
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
              <p>Tell us what you need, and we will help you understand the available options and next steps.</p>
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