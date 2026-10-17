import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = { title: "Book a service | Kobby's Intertech Services" };

export default function BookServicePage() {
  return <main><section className="page-hero"><p className="eyebrow">Book a service</p><h1>Tell us what you need and when you are available.</h1><p>Submit a service request and our team will review the details before confirming the next step.</p></section><section className="section form-section"><EnquiryForm mode="booking" /></section></main>;
}
