import { EnquiryForm } from "@/components/enquiry-form";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "Request a quotation | Kobby's Intertech Services",
  description:
    "Request an itemised quotation for CCTV, fibre internet, networking, satellite, or electrical services across Ghana.",
};

export default function RequestQuotePage() {
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
            icon: "check",
            value: "Transparent",
            label: "tailored quotations",
          },
          {
            icon: "clock",
            value: "Rapid",
            label: "review & response",
          },
        ]}
      />

      <section className="section form-section">
        <EnquiryForm mode="quote" />
      </section>
    </main>
  );
}
