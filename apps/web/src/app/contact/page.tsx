import { HeroSection } from "@/components/hero-section";
import { ContactHub } from "@/components/contact-hub";

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
            value: "Contact Us",
          },
        ]}
      />

      <ContactHub />
    </main>
  );
}
