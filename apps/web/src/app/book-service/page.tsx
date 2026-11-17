import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { HeroSection } from "@/components/hero-section";

export const metadata: Metadata = {
  title: "Book a Service",
  description:
    "Book an installation, maintenance, or repair service online with Kobby's Intertech Services in Ghana.",
  alternates: {
    canonical: "/book-service",
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
