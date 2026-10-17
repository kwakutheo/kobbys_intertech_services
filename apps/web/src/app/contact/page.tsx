import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "Contact | Kobby's Intertech Services",
  description:
    "Get in touch with Kobby's Intertech Services for CCTV, fibre, networking, satellite, or electrical installations in Ghana. Call, WhatsApp, or visit us in Achimota, Accra.",
};

export default function ContactPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["CONTACT US", "DIRECT REACH", "ENQUIRIES"]}
        title={
          <>
            Let&apos;s discuss what <br className="hero-br" />
            you need.
          </>
        }
        lead="Get in touch for a quotation, booking, or technical advice. We are available across Ghana, Monday to Saturday from 7:30 am to 5:00 pm."
        primaryAction={{
          href: "https://wa.me/233243487160",
          label: "Start WhatsApp chat",
        }}
        secondaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        cardRows={[
          {
            icon: "clock",
            value: "Mon–Sat",
            label: "7:30 am–5:00 pm",
          },
          {
            icon: "pin",
            value: "Achimota",
            label: "Digital: E2-5656-7654",
          },
        ]}
      />

      <section className="section contact-grid">
        <article>
          <p className="eyebrow">Call or WhatsApp</p>
          <h2>+233 24 348 7160</h2>
          <a className="button" href="https://wa.me/233243487160" target="_blank" rel="noopener noreferrer">
            Start a WhatsApp chat
          </a>
        </article>
        <article>
          <p className="eyebrow">Email</p>
          <h2>kobbysintertech@gmail.com</h2>
          <a className="text-link" href="mailto:kobbysintertech@gmail.com">
            Send an email <span aria-hidden="true">→</span>
          </a>
        </article>
        <article>
          <p className="eyebrow">Address</p>
          <h2>Achimota, Accra–Ghana</h2>
          <p>
            P.O. Box 20<br />
            Digital address: E2-5656-7654
          </p>
        </article>
      </section>
    </main>
  );
}
