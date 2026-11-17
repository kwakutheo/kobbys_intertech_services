import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { HeroSection } from "@/components/hero-section";

export const metadata: Metadata = {
  title: "Request an Itemised Quotation",
  description:
    "Request a transparent, itemised quotation for equipment and installation labor tailored to your home or commercial property in Ghana.",
  alternates: {
    canonical: "/request-quote",
  },
  openGraph: {
    title: "Request an Itemised Quotation | Kobby's Intertech Services",
    description:
      "Request a transparent, itemised quotation for equipment and installation labor tailored to your home or commercial property in Ghana.",
    url: "/request-quote",
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Request a Quotation - Kobby's Intertech Services Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Request an Itemised Quotation | Kobby's Intertech Services",
    description:
      "Request a transparent, itemised quotation for equipment and installation labor tailored to your home or commercial property in Ghana.",
    images: ["/hero_section_background.jpg"],
  },
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <main>
      <HeroSection
        eyebrowParts={["QUOTATION", "CUSTOM ESTIMATE"]}
        title={
          <>
            Start with the details of <br className="hero-br" />
            your project requirement.
          </>
        }
        lead="We will review your requirements and site details before preparing an itemised, professional quotation."
        primaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        secondaryAction={{
          href: "/services",
          label: "Explore services",
        }}
        cardRows={[
          {
            value: "Request Quote",
          },
        ]}
      />

      <section className="section form-section">
        <EnquiryForm mode="quote" initialServiceSlug={service} />
      </section>
    </main>
  );
}
