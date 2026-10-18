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

  if (result) {
    return (
      <div className="enquiry-success-card">
        <div className="enquiry-success-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#16a34a" opacity="0.12" />
            <circle cx="16" cy="16" r="12" fill="#16a34a" opacity="0.18" />
            <circle cx="16" cy="16" r="8" fill="#16a34a" />
            <path d="M11 16.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="enquiry-success-title">Request received!</h3>
        <p className="enquiry-success-body">
          Thank you. Our team will review your {isBooking ? "booking" : "quotation"} request and get back to you shortly.
        </p>
        <div className="enquiry-success-ref">
          Your tracking reference is{" "}
          <span className="enquiry-ref-code">{result.reference}</span>.
          <br />
          Please keep it for your records.
        </div>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="enquiry-form-header">
        <span className="enquiry-form-badge">
          {isBooking ? "Service Booking" : "Quote Request"}
        </span>
        <p className="enquiry-form-lead">
          {isBooking
            ? "Fill in the details below and we\u2019ll confirm your appointment within one business day."
            : "Describe your project and we\u2019ll prepare a transparent, itemised quotation for you."}
        </p>
      </div>

      <div className="form-grid">
        <label>
          Full name
          <input name="fullName" autoComplete="name" required minLength={2} maxLength={120} placeholder="e.g. Kwabena Asante" />
        </label>
        <label>
          Organisation <span>(optional)</span>
          <input name="organisationName" autoComplete="organization" maxLength={160} placeholder="Company or school name" />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" />
        </label>
        <label>
          Telephone number
          <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} placeholder="+233 24 000 0000" />
        </label>
        <label>
          Service
          <select name="serviceSlug" required defaultValue={initialServiceSlug ?? ""}>
            <option value="" disabled>Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>{service.name}</option>
            ))}
          </select>
        </label>
        <label>
          Preferred contact method
          <select name="preferredContactMethod" defaultValue="PHONE">
            <option value="PHONE">Phone call</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Email</option>
          </select>
        </label>
        <label className="form-wide">
          What do you need?
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder={
              isBooking
                ? "Describe the installation, maintenance, or repair service you need."
                : "Describe your project \u2014 scope, scale, any existing equipment, and what you\u2019re hoping to achieve."
            }
          />
        </label>
        <label className="form-wide">
          Property or service location
          <textarea
            name="address"
            required
            minLength={3}
            maxLength={500}
            rows={2}
            placeholder="Town, area and any useful landmark details"
          />
        </label>
        <label>
          GhanaPost GPS address <span>(optional)</span>
          <input name="gpsAddress" maxLength={100} placeholder="e.g. GA-123-4567" />
        </label>
        <label>
          {isBooking ? "Preferred date" : "Preferred assessment date"}
          <input name="preferredDate" type="date" />
        </label>
        <label>
          Preferred time window <span>(optional)</span>
          <input name="timeWindow" maxLength={100} placeholder="e.g. Morning, 9:00\u201312:00" />
        </label>
      </div>

      <label className="consent">
        <input name="privacyAccepted" type="checkbox" required />
        <span>
          I agree that Kobby&apos;s Intertech Services may use these details to respond to this{" "}
          {isBooking ? "booking" : "quotation"} request.
        </span>
      </label>

      <p className="form-note">
        Your request will be reviewed before an appointment or quotation is confirmed. We typically respond within one business day.
      </p>

      {error && (
        <p className="form-message form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg className="form-btn-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
              <path d="M8 2a6 6 0 0 1 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Sending\u2026
          </>
        ) : (
          isBooking ? "Send booking request" : "Request quotation"
        )}
      </button>
    </form>
  );
}

