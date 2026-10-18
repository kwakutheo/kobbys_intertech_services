"use client";

import { FormEvent, useRef, useState } from "react";
import { services } from "@/data/site";
import { getApiBaseUrl } from "@/lib/api-url";

type EnquiryFormProps = {
  mode: "booking" | "quote";
  initialServiceSlug?: string;
};

type SubmissionResult = { reference: string; status: string };

const apiUrl = getApiBaseUrl();

export function EnquiryForm({ mode, initialServiceSlug }: EnquiryFormProps) {
  const idempotencyKey = useRef<string | undefined>(undefined);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    const form = new FormData(formElement);
    idempotencyKey.current ??= crypto.randomUUID();
    const payload = Object.fromEntries(form.entries()) as Record<string, string | boolean>;
    payload.privacyAccepted = form.get("privacyAccepted") === "on";

    try {
      const response = await fetch(`${apiUrl}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as SubmissionResult | { message?: string | string[] };
      if (!response.ok) {
        const errorBody = body as { message?: string | string[] };
        const message = Array.isArray(errorBody.message) ? errorBody.message[0] : errorBody.message;
        throw new Error(message ?? "We could not send your request. Please try again.");
      }
      setResult(body as SubmissionResult);
      formElement.reset();
      idempotencyKey.current = undefined;
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not send your request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isBooking = mode === "booking";

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Full name<input name="fullName" autoComplete="name" required minLength={2} maxLength={120} /></label>
        <label>Organisation <span>(optional)</span><input name="organisationName" autoComplete="organization" maxLength={160} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Telephone number<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} /></label>
        <label>Service<select name="serviceSlug" required defaultValue={initialServiceSlug ?? ""}><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select></label>
        <label>Preferred contact method<select name="preferredContactMethod" defaultValue="PHONE"><option value="PHONE">Phone call</option><option value="WHATSAPP">WhatsApp</option><option value="EMAIL">Email</option></select></label>
        <label className="form-wide">What do you need?<textarea name="description" required minLength={10} maxLength={5000} rows={5} placeholder="Tell us about the installation, support or event service you need." /></label>
        <label className="form-wide">Property or service location<textarea name="address" required minLength={3} maxLength={500} rows={2} placeholder="Town, area and any useful location details" /></label>
        <label>GhanaPost GPS address <span>(optional)</span><input name="gpsAddress" maxLength={100} /></label>
        <label>{isBooking ? "Preferred date" : "Preferred assessment date"}<input name="preferredDate" type="date" /></label>
        <label>Preferred time window <span>(optional)</span><input name="timeWindow" maxLength={100} placeholder="e.g. Morning, 9:00–12:00" /></label>
      </div>
      <label className="consent"><input name="privacyAccepted" type="checkbox" required /> <span>I agree that Kobby&apos;s Intertech Services may use these details to respond to this {isBooking ? "booking" : "quotation"} request.</span></label>
      <p className="form-note">Your request will be reviewed before an appointment or quotation is confirmed.</p>
      {error && <p className="form-message form-error" role="alert">{error}</p>}
      {result && <div className="form-message form-success" role="status"><strong>Request received.</strong><span>Your tracking reference is <b>{result.reference}</b>. Please keep it for your records.</span></div>}
      <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending request…" : isBooking ? "Send booking request" : "Request quotation"}</button>
    </form>
  );
}
