import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = { title: "Request a quotation | Kobby's Intertech Services" };

export default function RequestQuotePage() {
  return <main><section className="page-hero"><p className="eyebrow">Request a quotation</p><h1>Start with the details of your project or service requirement.</h1><p>We will review your request and contact you if we need more information before preparing a quotation.</p></section><section className="section form-section"><EnquiryForm mode="quote" /></section></main>;
}
