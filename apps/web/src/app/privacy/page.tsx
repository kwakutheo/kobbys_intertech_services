import { HeroSection } from "@/components/hero-section";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Kobby's Intertech Services",
  description:
    "Read how Kobby's Intertech Services collects, uses, stores and protects personal information in connection with our services in Ghana.",
};

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "Kobby’s Intertech Services may collect personal information that you provide when you contact us, request a quotation, book a service, submit a form or communicate with us by phone, email or WhatsApp. This may include your name, telephone number, email address and preferred contact method.",
      "Depending on the service requested, we may also collect your property address or digital address, location details, site photographs, installation requirements, equipment information, appointment preferences and relevant service history. We aim to collect only information reasonably necessary for the purpose concerned.",
      "If you make an enquiry or booking on behalf of a company, school, landlord or another person, please ensure you are authorised to provide any contact or property information relating to them.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use your information to respond to enquiries, understand your requirements, prepare quotations, arrange site assessments, schedule installations, deliver agreed services, issue invoices or receipts, and provide customer support.",
      "We may use relevant service records to investigate faults, discuss maintenance, handle complaints, manage payments and meet applicable legal or accounting obligations. We may also use information to protect our staff, customers, equipment and business against fraud, misuse or unauthorised access where permitted by law.",
      "We will not use your personal information for an unrelated purpose without an appropriate lawful basis. Where we rely on your consent, you may withdraw it, although this will not affect processing already lawfully carried out or processing supported by another lawful basis.",
    ],
  },
  {
    title: "3. Lawful and Fair Use of Personal Data",
    content: [
      "We aim to handle personal information lawfully, fairly and transparently in accordance with Ghana’s Data Protection Act, 2012 (Act 843), and other applicable requirements.",
      "Depending on the circumstances, information may be processed to take steps you request before entering into a service arrangement, perform an agreed service, meet a legal obligation, protect legitimate business interests where permitted by law, or act on valid consent.",
      "When we request information, we will explain its purpose where appropriate. Some details may be necessary to assess a job, prepare a quotation or arrange a site visit. If you choose not to provide necessary information, we may be unable to complete that step or provide the requested service.",
    ],
  },
  {
    title: "4. Sharing Information with Third Parties",
    content: [
      "We do not sell your personal information. We may share relevant information with staff, technicians or authorised service partners who need it to respond to your enquiry or carry out agreed work.",
      "Where necessary, information may also be processed by service providers that support our operations, such as website hosting, database, email, communications, cloud storage or payment providers. These providers may process information on our behalf or under their own privacy terms, depending on the service they provide.",
      "We may disclose information where required by applicable law, a lawful request from an authorised authority, or where reasonably necessary to establish, exercise or defend legal claims. We aim to limit any disclosure to information relevant to the purpose.",
      "Some service providers may store or process information outside Ghana. Where this occurs, we will take the steps required by applicable data protection law for the relevant transfer and processing.",
    ],
  },
  {
    title: "5. WhatsApp, Email and Other Communication Channels",
    content: [
      "If you contact us through WhatsApp, email, telephone or another external platform, the relevant platform provider may process your information under its own terms and privacy policy. Information sent through these channels may include your contact details, messages, photographs or documents.",
      "Please avoid sending passwords, payment card details, identity documents or other sensitive information through ordinary messages unless there is a genuine need and we have agreed on an appropriate way to provide it.",
      "We may retain relevant communications to manage your enquiry, confirm agreed work, resolve disputes or maintain necessary business records.",
    ],
  },
  {
    title: "6. CCTV, Site Photographs and Property Information",
    content: [
      "For CCTV, GPS tracking, networking and other site-based services, we may need property details, installation photographs, equipment identifiers or system configuration information to assess or complete the requested work.",
      "Where a customer’s CCTV system records images or sound, the customer or organisation operating that system will generally be responsible for determining how the recordings are used and who may access them. Our access to footage, recordings or system accounts should be limited to what is necessary and authorised for the agreed work.",
      "Customers should ensure that their use of CCTV, GPS tracking and other monitoring systems complies with applicable privacy and data protection requirements, including providing any notices or obtaining any permissions that may be required. We do not promise that installing a system alone makes its use legally compliant.",
    ],
  },
  {
    title: "7. Data Security and Storage",
    content: [
      "We aim to protect personal information using reasonable technical and organisational measures appropriate to the nature of the information and the way it is handled. Depending on the systems in use, these measures may include access restrictions, account security, controlled sharing and appropriate storage practices.",
      "No website, internet connection, messaging platform or electronic storage system can be guaranteed to be completely secure. Please contact us if you believe that information you provided to us has been exposed, accessed or used without authorisation.",
      "Access to personal information should be limited to people who need it for legitimate work purposes. We will take reasonable steps to address suspected unauthorised access, loss or disclosure and to meet any applicable legal reporting obligations.",
    ],
  },
  {
    title: "8. How Long We Keep Information",
    content: [
      "We keep personal information only for as long as reasonably necessary for the purpose for which it was collected, including managing enquiries, completing services, maintaining relevant service records, resolving complaints and meeting legal or accounting requirements.",
      "Retention periods may differ depending on the type of record, whether work was carried out, any applicable legal obligations and whether a dispute or outstanding matter remains unresolved. We do not promise that every record will be retained for the same period.",
      "When information is no longer required, we will take reasonable steps to delete it, securely dispose of it or remove identifying details, subject to applicable legal obligations and legitimate record-retention needs.",
    ],
  },
  {
    title: "9. Your Privacy Rights and Choices",
    content: [
      "Subject to applicable law and the circumstances of the request, you may ask us about the personal information we hold about you, request access to it, ask for inaccurate or incomplete details to be corrected, or raise an objection to particular processing.",
      "You may also request that certain processing be stopped or restricted, or ask for information to be deleted where applicable. These requests are assessed under the relevant legal requirements; deletion is not always possible where information must be retained for legal, contractual, accounting or dispute-related reasons.",
      "Where processing relies on consent, you may withdraw that consent. You may also object to direct marketing and ask us not to use your details for that purpose. We will not use personal information for direct marketing where the required consent has not been obtained.",
      "To protect your information, we may need to verify your identity or ask for details that help us locate the relevant records before responding. We will handle requests in accordance with applicable legal requirements.",
    ],
  },
  {
    title: "10. Cookies and Website Services",
    content: [
      "Our website and the services used to operate it may use cookies or similar technologies where they are implemented. These technologies may be necessary for website functionality, security or other disclosed purposes.",
      "The types of cookies or similar technologies used depend on the website features and third-party services enabled. If analytics, advertising or other optional tracking technologies are introduced, the relevant information and choices should be made available where required.",
      "You can manage cookies through your browser settings, although blocking certain cookies may affect how parts of a website function.",
    ],
  },
  {
    title: "11. Children’s Information",
    content: [
      "Our services are generally intended for individuals and organisations arranging technical work for homes, properties or businesses. If personal information about a child is provided in connection with a service, it should be limited to what is necessary and provided by an appropriately authorised person where required.",
      "If you believe that a child’s personal information has been provided to us unnecessarily or handled inappropriately, please contact us so that we can review the matter.",
    ],
  },
  {
    title: "12. Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy when our services, website features, data-handling practices or legal obligations change. The latest version will be published on this page with an updated revision date.",
      "We encourage you to review this page periodically so you can understand how we handle personal information.",
    ],
  },
  {
    title: "13. Contact Us About Privacy",
    content: [
      "For questions about this Privacy Policy, requests concerning your personal information or concerns about how we have handled your data, please contact us using the details below. Please describe your concern clearly and avoid including unnecessary sensitive information in your message.",
      "Phone: +233 24 348 7160\nEmail: kobbysintertech@gmail.com\nLocation: Achimota, Accra, Ghana",
      "If you are not satisfied with how a privacy concern is handled, you may contact Ghana’s Data Protection Commission for information about making a complaint. Visit https://dpc.gov.gh/ for official guidance and contact details.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["LEGAL", "PRIVACY POLICY", "DATA PROTECTION"]}
        title={
          <>
            Your privacy and trust <br className="hero-br" />
            matter to us.
          </>
        }
        lead="Learn how we handle personal information when you contact us, request a quotation, book a technical service or communicate with our team."
        cardRows={[
          {
            value: "Privacy Policy",
          },
        ]}
      />

      <section className="about-values-section" style={{ maxWidth: "1240px", margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ maxWidth: "860px" }}>
          <p className="eyebrow" style={{ marginBottom: "12px" }}>Transparency &amp; Data Protection</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.03em", marginBottom: "20px" }}>
            How we handle your information
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}>
            Last updated: 23 October 2026. This policy explains our intended approach to handling personal information in connection with our services and website in Ghana. It should be read alongside any relevant service terms or notices provided when you submit information.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {PRIVACY_SECTIONS.map((section) => (
              <article
                key={section.title}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "28px 32px",
                }}
              >
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "14px", color: "var(--ink)" }}>
                  {section.title}
                </h3>
                {section.content.map((paragraph, index) => (
                  <p
                    key={index}
                    style={{
                      color: "var(--body)",
                      fontSize: "15px",
                      lineHeight: "1.65",
                      margin: index === 0 ? "0" : "12px 0 0",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div style={{ marginTop: "44px", display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href="/" className="button button-primary">
              Return Home
            </Link>
            <Link href="/contact" className="button button-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}