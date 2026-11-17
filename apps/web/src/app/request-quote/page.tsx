import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { HeroSection } from "@/components/hero-section";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description:
    "Request an itemised quotation for CCTV, fibre internet, networking, satellite, or electrical services across Ghana.",
  alternates: {
    canonical: "/request-quote",
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
