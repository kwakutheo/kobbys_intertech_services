import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { HeroSection } from "@/components/hero-section";

export const metadata: Metadata = {
  title: "Book a Service Technician",
  description:
    "Schedule an on-site technical inspection, repair, or new installation for CCTV, internet, networking, satellite, or electrical works in Ghana.",
  alternates: {
    canonical: "/book-service",
  },
  openGraph: {
    title: "Book a Service Technician | Kobby's Intertech Services",
    description:
      "Schedule an on-site technical inspection, repair, or new installation for CCTV, internet, networking, satellite, or electrical works in Ghana.",
    url: "/book-service",
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Book a Service Technician - Kobby's Intertech Services Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Service Technician | Kobby's Intertech Services",
    description:
      "Schedule an on-site technical inspection, repair, or new installation for CCTV, internet, networking, satellite, or electrical works in Ghana.",
    images: ["/hero_section_background.jpg"],
  },
};

export default async function BookServicePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <main>
      <HeroSection
        eyebrowParts={["ONLINE BOOKING", "SERVICE REQUEST"]}
        title={
          <>
            Tell us what you need and <br className="hero-br" />
            when you are available.
          </>
        }
        lead="Submit a service request and our team will review the details before confirming the next step with you."
        primaryAction={{
          href: "/request-quote",
          label: "Request quote instead",
        }}
        secondaryAction={{
          href: "/services",
          label: "Explore services",
        }}
        cardRows={[
          {
            value: "Book a service",
          },
        ]}
      />

      <section className="section form-section">
        <EnquiryForm mode="booking" initialServiceSlug={service} />
      </section>
    </main>
  );
}
