import { HeroSection } from "@/components/hero-section";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Kobby's Intertech Services",
  description:
    "Read the terms that govern use of Kobby's Intertech Services' website, service enquiries, bookings and technical services in Ghana.",
};

type TermsSection = {
  title: string;
  content: string[];
  items?: string[];
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "1. Introduction",
    content: [
      "Welcome to the website of Kobby’s Intertech Services (\"we,\" \"us,\" \"our,\" or \"the Company\"). We provide technology, security, communication, networking, internet connectivity, electrical installation and GPS vehicle-tracking services in Ghana.",
      "These Terms of Service govern your access to and use of our website, service enquiry forms, booking system, customer account features and related online services.",
      "By accessing our website, submitting an enquiry, requesting a quotation or making a booking, you agree to these Terms of Service. If you do not agree, please do not use the website or its booking services.",
    ],
  },
  {
    title: "2. Services We Provide",
    content: [
      "The availability of particular services depends on location, technical requirements, equipment availability and our operational capacity.",
      "We are based in Achimota, Accra, and may provide on-site services across Greater Accra and other parts of Ghana, subject to availability and any applicable travel or dispatch charges.",
    ],
    items: [
      "CCTV installation and security systems.",
      "Fibre optics, satellite internet and connectivity solutions.",
      "Network design, installation and infrastructure support.",
      "Satellite television installation and related services.",
      "Electrical installation and power solutions.",
      "GPS vehicle tracking and fleet management systems.",
      "Technical support, maintenance, inspections and related professional services.",
    ],
  },
  {
    title: "3. Website Use",
    content: [
      "You agree to use our website lawfully and responsibly.",
      "We may restrict or suspend access where reasonably necessary to protect our website, customers, personnel or business operations.",
    ],
    items: [
      "Submit false, misleading, fraudulent or unauthorised booking requests.",
      "Use the website to engage in unlawful activities.",
      "Attempt to gain unauthorised access to our systems, customer accounts or information.",
      "Interfere with the operation, security or availability of the website.",
      "Upload malicious software or content that could damage our systems.",
      "Use our contact forms or communication channels to harass, threaten or defraud others.",
    ],
  },
  {
    title: "4. Service Enquiries and Quotations",
    content: [
      "Submitting an enquiry through our website, telephone, email or other communication channels does not automatically create a service contract.",
      "We may request additional information, conduct an inspection, assess technical requirements or arrange a consultation before providing a quotation.",
      "Unless otherwise stated in writing, quotations are based on the information available at the time of preparation; prices may change if the scope of work, materials, site conditions or customer requirements change; any quotation validity period will be stated in the quotation; and additional work outside the agreed scope requires further discussion and approval.",
      "A quotation is not a confirmed appointment or booking unless we expressly confirm it.",
    ],
  },
  {
    title: "5. Booking and Appointment Policy",
    content: [
      "Our website may allow customers to request appointments, installations, inspections, maintenance visits or other services. A booking request is not confirmed until we communicate confirmation through an appropriate channel, such as email, telephone, SMS, WhatsApp or your customer account.",
      "When making a booking, you agree to provide accurate information, including your contact details, service location, requested service and relevant technical requirements.",
      "Appointment dates and arrival times may be affected by traffic, weather, equipment availability, emergencies or other circumstances beyond our reasonable control. Where possible, we will notify you of significant changes and arrange an alternative appointment.",
    ],
    items: [
      "Ensure that the service location is accessible at the agreed time.",
      "Obtain any necessary permission to access the premises.",
      "Provide accurate information about the installation environment.",
      "Ensure that an authorised person is available where required.",
      "Inform us promptly of any changes to the appointment.",
    ],
  },
  {
    title: "6. Customer Accounts and Booking Tracking",
    content: [
      "If our website provides customer accounts or booking-tracking functionality, you must provide accurate registration information and keep your login credentials confidential. You are responsible for activities performed through your account, except where applicable law provides otherwise.",
      "You agree to notify us promptly if you suspect unauthorised access to your account. Booking statuses, service updates, appointment information and notifications are provided to help you follow the progress of your request. A status displayed online does not replace a separate written agreement where one is required.",
      "We may update or correct booking information when necessary to reflect the actual status of a service request.",
    ],
  },
  {
    title: "7. Pricing, Deposits and Payments",
    content: [
      "The applicable price, deposit, payment schedule, taxes, transport charges and other fees will be communicated in the quotation, invoice or service agreement. Where a deposit or advance payment is required, we will communicate the amount and payment deadline before you are expected to pay.",
      "You agree to pay the amounts due under the applicable agreement. We will communicate any additional charges before proceeding with additional work, except where urgent action is reasonably necessary to prevent immediate damage or danger and applicable law permits it.",
      "Payment methods and payment confirmation procedures will be specified during the booking or invoicing process. Cancellation, refunds, deposits and payment deadlines must be stated clearly in your quotation or service agreement. No cancellation or refund restriction in these Terms overrides rights that cannot lawfully be excluded under applicable law.",
    ],
  },
  {
    title: "8. Customer Responsibilities",
    content: [
      "Before work begins, you must, where applicable, take the following reasonable steps.",
      "You must not request services that would unlawfully interfere with another person’s privacy, property, communications or security.",
    ],
    items: [
      "Provide accurate details of the requested work.",
      "Ensure lawful access to the premises, equipment or vehicles involved.",
      "Obtain consent from property owners or other authorised parties.",
      "Inform us of known electrical hazards, structural limitations, access restrictions or relevant safety concerns.",
      "Secure valuables and sensitive materials in the work area.",
      "Back up important data before work involving computers, networks, storage devices or other systems.",
      "Ensure that any equipment or information supplied by you may lawfully be used for the requested work.",
    ],
  },
  {
    title: "9. Installation, Equipment and Third-Party Services",
    content: [
      "Some services may involve equipment or platforms supplied by third parties, including internet service providers, satellite television providers, manufacturers, software vendors and telecommunications operators. Where applicable, those third parties may have their own terms, fees, warranties, installation requirements or service limitations.",
      "We are not responsible for outages, price changes, discontinuation or service failures caused by third parties to the extent that such matters are outside our reasonable control and applicable law permits that limitation.",
      "Ownership of supplied equipment, title transfer, installation warranties, manufacturer warranties and responsibility for defective products will be governed by the applicable quotation, invoice, warranty documentation or service agreement and applicable law.",
    ],
  },
  {
    title: "10. Warranties and Service Quality",
    content: [
      "We will perform agreed services with reasonable care and skill and in accordance with applicable legal requirements. Any workmanship warranty, equipment warranty, maintenance period or after-sales support arrangement will be specified in the applicable quotation, invoice, warranty document or service agreement.",
      "A warranty may not cover damage or faults caused by misuse, unauthorised modifications, accidental damage, external electrical events, environmental conditions, third-party interference or failure to follow reasonable operating instructions, where such exclusions are lawful and applicable.",
      "Nothing in these Terms excludes any consumer guarantee or other protection that cannot legally be excluded or restricted.",
    ],
  },
  {
    title: "11. Cancellations, Rescheduling and Delays",
    content: [
      "Customers who need to cancel or reschedule an appointment should contact us as soon as possible using our published contact details. Any applicable cancellation notice period, deposit treatment, refund entitlement or rescheduling fee will be communicated in the relevant quotation or service agreement.",
      "We may reschedule or cancel a service where necessary due to safety concerns, unavailable equipment, staff unavailability, inaccessible premises, non-payment or circumstances beyond our reasonable control.",
      "Where we cancel a confirmed appointment, we will communicate the cancellation and, where appropriate, offer rescheduling or explain the applicable refund arrangements.",
    ],
  },
  {
    title: "12. Limitation of Liability",
    content: [
      "To the extent permitted by applicable law, we will not be liable for indirect or consequential losses arising from the use of our website or a delay in providing a service where such losses are not reasonably foreseeable or are otherwise lawfully excludable.",
      "We do not guarantee that our website will always be available, uninterrupted, error-free or compatible with every device. We are not responsible for loss arising from inaccurate information supplied by a customer, unauthorised access caused by the customer’s failure to protect account credentials or third-party service interruptions, to the extent permitted by law.",
      "Nothing in these Terms excludes or limits liability for fraud, wilful misconduct, death or personal injury where liability cannot legally be excluded, or any other liability that applicable law does not permit us to exclude or limit.",
    ],
  },
  {
    title: "13. Privacy and Personal Information",
    content: [
      "We may collect and process information necessary to respond to enquiries, prepare quotations, manage bookings, communicate with customers, provide services, process payments, maintain records and improve our operations. Depending on the functionality you use, this information may include your name, telephone number, email address, service address, booking details, account information and relevant technical information.",
      "We will handle personal information in accordance with our Privacy Policy and applicable Ghanaian data protection law, including the Data Protection Act, 2012 (Act 843), where applicable.",
      "Please read our Privacy Policy before submitting personal information through the website.",
    ],
  },
  {
    title: "14. Intellectual Property",
    content: [
      "Unless otherwise stated, the website’s text, branding, logos, graphics, photographs, layouts and original content are owned by or licensed to Kobby’s Intertech Services. You may access and use the website for lawful personal or business enquiries.",
      "You must not reproduce, republish, distribute, commercially exploit or modify protected website content without our prior permission or another lawful basis. Third-party names, logos, trademarks and product images remain the property of their respective owners.",
    ],
  },
  {
    title: "15. Website Security and Availability",
    content: [
      "We take reasonable steps to maintain the security and availability of our website. However, no website or internet transmission can be guaranteed to be completely secure.",
      "We may temporarily suspend access for maintenance, security updates, technical repairs or circumstances outside our control. You must not attempt to bypass security controls, probe systems without authorisation or disrupt our website or booking platform.",
    ],
  },
  {
    title: "16. Changes to Services or These Terms",
    content: [
      "We may update our website, introduce or discontinue services, or revise these Terms of Service when reasonably necessary. Updated terms will be published on this page with a revised Last Updated date.",
      "Changes will apply from the stated effective date, subject to applicable law. Any material changes affecting an existing service agreement will be handled in accordance with that agreement and applicable legal requirements.",
    ],
  },
  {
    title: "17. Complaints and Dispute Resolution",
    content: [
      "If you have a complaint concerning a quotation, booking, installation, payment or other service, please contact us using the contact information published on our website. We will make reasonable efforts to investigate the matter and seek a practical resolution.",
      "Where a dispute cannot be resolved directly, the parties may pursue any available dispute-resolution process or legal remedy under applicable law. Nothing in this section prevents a customer from exercising statutory rights or approaching a competent regulatory or dispute-resolution authority.",
    ],
  },
  {
    title: "18. Governing Law",
    content: [
      "These Terms of Service are governed by the laws of the Republic of Ghana, subject to any mandatory legal protections that apply to a customer or transaction.",
      "Any dispute will be handled by a court or other competent authority with jurisdiction under applicable law.",
    ],
  },
  {
    title: "19. Contact Information",
    content: [
      "For questions about these Terms of Service, bookings, quotations or complaints, please contact us.",
      "Business Name: Kobby’s Intertech Services\nLocation: Achimota, Accra, Ghana\nEmail: kobbysintertech@gmail.com\nTelephone: +233 24 348 7160",
      "By using our website or submitting a service request, you acknowledge that you have had the opportunity to read these Terms of Service.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["LEGAL", "TERMS OF SERVICE", "CUSTOMER AGREEMENT"]}
        title={
          <>
            Clear terms for <br className="hero-br" />
            every service.
          </>
        }
        lead="Read the terms that apply when you use our website, request a quotation, make a booking or engage Kobby’s Intertech Services."
        cardRows={[{ value: "Terms of Service" }]}
      />

      <section className="about-values-section" style={{ maxWidth: "1240px", margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ maxWidth: "860px" }}>
          <p className="eyebrow" style={{ marginBottom: "12px" }}>Website &amp; Service Terms</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.03em", marginBottom: "20px" }}>
            Terms for working with us
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}>
            Effective date: 23 October 2026. Last updated: 23 October 2026. These Terms should be read alongside our Privacy Policy and any quotation, invoice, warranty document or service agreement that applies to your work.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {TERMS_SECTIONS.map((section) => (
              <article
                key={section.title}
                style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "12px", padding: "28px 32px" }}
              >
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "14px", color: "var(--ink)" }}>
                  {section.title}
                </h3>
                {section.content.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    style={{ color: "var(--body)", fontSize: "15px", lineHeight: "1.65", margin: index === 0 ? "0" : "12px 0 0", whiteSpace: "pre-line" }}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul style={{ color: "var(--body)", fontSize: "15px", lineHeight: "1.65", margin: "14px 0 0", paddingLeft: "22px" }}>
                    {section.items.map((item) => <li key={item} style={{ marginTop: "6px" }}>{item}</li>)}
                  </ul>
                )}
                {section.title.startsWith("13.") && (
                  <Link href="/privacy" className="text-link" style={{ display: "inline-flex", marginTop: "14px" }}>
                    Read our Privacy Policy <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div style={{ marginTop: "44px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" className="button button-primary">Return Home</Link>
            <Link href="/contact" className="button button-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
