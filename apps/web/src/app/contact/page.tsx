import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ContactHub } from "@/components/contact-hub";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kobby's Intertech Services in Achimota, Accra. Call or WhatsApp +233 24 348 7160 for technical inquiries, site visits, and project consultations in Ghana.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Kobby's Intertech Services",
    description:
      "Get in touch with Kobby's Intertech Services in Achimota, Accra. Call or WhatsApp +233 24 348 7160 for technical inquiries, site visits, and project consultations in Ghana.",
    url: "/contact",
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Kobby's Intertech Services in Achimota, Accra, Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Kobby's Intertech Services",
    description:
      "Get in touch with Kobby's Intertech Services in Achimota, Accra. Call or WhatsApp +233 24 348 7160 for technical inquiries, site visits, and project consultations in Ghana.",
    images: ["/hero_section_background.jpg"],
  },
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
