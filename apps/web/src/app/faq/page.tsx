import { faqs } from "@/data/site";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "FAQ | Kobby's Intertech Services",
  description:
    "Find answers to common questions about our security, internet, networking, satellite, and technical services in Ghana.",
};

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
          label: "Ask a question",
        }}
        secondaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        cardRows={[
          {
            icon: "pin",
            value: "Ghana",
            label: "nationwide availability",
          },
          {
            icon: "phone",
            value: "Direct Help",
            label: "+233 24 348 7160",
          },
        ]}
      />

      <section className="section faq-list">
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
