"use client";

import React, { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/data/site";
import { getApiBaseUrl } from "@/lib/api-url";

const apiUrl = getApiBaseUrl();

const WHATSAPP_NUMBER = "233243487160";
const EMAIL_ADDRESS = "kobbysintertech@gmail.com";
const GPS_ADDRESS = "E2-5656-7654";

const WHATSAPP_PRESETS = [
  {
    label: "CCTV & Security Quote",
    icon: "shield",
    message: "Hello Kobby's Intertech, I would like to enquire about CCTV & Security installation.",
  },
  {
    label: "Fibre & Internet Setup",
    icon: "globe",
    message: "Hello Kobby's Intertech, I need assistance with Fibre & Internet connectivity.",
  },
  {
    label: "Book On-Site Technician",
    icon: "tool",
    message: "Hello Kobby's Intertech, I would like to schedule an on-site technical inspection.",
  },
  {
    label: "General Technical Inquiry",
    icon: "chat",
    message: "Hello Kobby's Intertech, I have a general technical inquiry about your services.",
  },
];

export function ContactHub() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  // Form states
  const idempotencyKey = useRef<string | undefined>(undefined);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function copyToClipboard(text: string, type: "email" | "gps") {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (type === "email") {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2200);
        } else {
          setCopiedGps(true);
          setTimeout(() => setCopiedGps(false), 2200);
        }
      });
    }
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    const formData = new FormData(formElement);
    idempotencyKey.current ??= crypto.randomUUID();

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      serviceSlug: String(formData.get("serviceSlug") ?? services[0].slug),
      description: String(formData.get("description") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim() || "Achimota / Accra, Ghana (General Inquiry)",
      gpsAddress: String(formData.get("gpsAddress") ?? "").trim() || undefined,
      preferredContactMethod: String(formData.get("preferredContactMethod") ?? "WHATSAPP"),
      privacyAccepted: true,
    };

    try {
      const response = await fetch(`${apiUrl}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      if (!response.ok) {
        const message = Array.isArray(body.message) ? body.message[0] : body.message;
        throw new Error(message ?? "We could not send your message. Please try again.");
      }

      setResult(body);
      formElement.reset();
      idempotencyKey.current = undefined;
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send your message. Please try WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="contact-hub-wrapper">
      {/* ─── 1. Three Polished Contact Cards ─── */}
      <section className="contact-channels-section" aria-label="Direct contact channels">
        <div className="contact-channels-grid">
          {/* Channel 1: Phone & WhatsApp */}
          <article className="contact-card">
            <div className="contact-card-top">
              <div className="contact-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="contact-eyebrow">CALL OR WHATSAPP</span>
            </div>

            <h2 className="contact-main-value">+233 24 348 7160</h2>
            <p className="contact-card-sub">Mon–Sat: 7:30 am – 5:00 pm · Fast response</p>

            <div className="contact-card-actions">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.24-8.2 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              <a href="tel:+233243487160" className="btn-call">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Directly</span>
              </a>
            </div>
          </article>

          {/* Channel 2: Email */}
          <article className="contact-card">
            <div className="contact-card-top">
              <div className="contact-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="contact-eyebrow">OFFICIAL EMAIL</span>
            </div>

            <h2 className="contact-main-value email-value">{EMAIL_ADDRESS}</h2>
            <p className="contact-card-sub">Inquiries, quotations &amp; technical reports</p>

            <div className="contact-card-actions">
              <a href={`mailto:${EMAIL_ADDRESS}`} className="btn-email-primary">
                <span>Send an Email</span>
                <span aria-hidden="true">→</span>
              </a>

              <button
                type="button"
                onClick={() => copyToClipboard(EMAIL_ADDRESS, "email")}
                className="btn-copy"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <span className="copy-success">✓ Copied to clipboard</span>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </article>

          {/* Channel 3: Address & GPS */}
          <article className="contact-card">
            <div className="contact-card-top">
              <div className="contact-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="contact-eyebrow">PHYSICAL OFFICE</span>
            </div>

            <h2 className="contact-main-value">Achimota, Accra–Ghana</h2>
            <p className="contact-card-sub">
              P.O. Box 20 · Digital Address: <strong className="gps-code">{GPS_ADDRESS}</strong>
            </p>

            <div className="contact-card-actions">
              <a
                href="https://maps.google.com/?q=Achimota,+Accra,+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-map-primary"
              >
                <span>View on Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>

              <button
                type="button"
                onClick={() => copyToClipboard(GPS_ADDRESS, "gps")}
                className="btn-copy"
                aria-label="Copy GhanaPost GPS digital address"
              >
                {copiedGps ? (
                  <span className="copy-success">✓ Copied GPS code</span>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy GPS Code</span>
                  </>
                )}
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ─── 2. Split Section: Direct Message Form & Operating Hours ─── */}
      <section className="contact-main-section">
        <div className="contact-split-layout">
          {/* Left: Direct Inquiry Form */}
          <div className="contact-form-column">
            <div className="contact-section-header">
              <div className="contact-header-badge">
                <span className="badge-dot" aria-hidden="true" />
                <span className="eyebrow">SEND AN INQUIRY</span>
              </div>
              <h2 className="contact-section-title">Send a message to our team.</h2>
              <p className="contact-section-desc">
                Submit your project or service requirement. Our team will review the details and provide a swift, professional response.
              </p>
            </div>

            <form className="contact-direct-form" onSubmit={handleContactSubmit}>
              <div className="contact-form-grid">
                <label className="form-field">
                  <span className="field-label">Full Name *</span>
                  <input
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="e.g. Samuel Mensah"
                    className="form-input"
                  />
                </label>

                <label className="form-field">
                  <span className="field-label">Phone / WhatsApp Number *</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    minLength={7}
                    maxLength={30}
                    placeholder="e.g. +233 24 000 0000"
                    className="form-input"
                  />
                </label>

                <label className="form-field">
                  <span className="field-label">Email Address *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="e.g. name@example.com"
                    className="form-input"
                  />
                </label>

                <label className="form-field">
                  <span className="field-label">Service of Interest *</span>
                  <select name="serviceSlug" required defaultValue={services[0]?.slug} className="form-select">
                    {services.map((svc) => (
                      <option key={svc.slug} value={svc.slug}>
                        {svc.name}
                      </option>
                    ))}
                    <option value="networking">Other / General Technical Assistance</option>
                  </select>
                </label>

                <label className="form-field form-field-full">
                  <span className="field-label">Property or Service Location in Ghana *</span>
                  <input
                    name="address"
                    type="text"
                    required
                    minLength={3}
                    maxLength={300}
                    placeholder="e.g. East Legon, Accra / Tema Community 25 / Kumasi"
                    className="form-input"
                  />
                </label>

                <label className="form-field form-field-full">
                  <span className="field-label">How Can We Help You? *</span>
                  <textarea
                    name="description"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={4}
                    placeholder="Describe your site, installation needs, or technical issues you're experiencing."
                    className="form-textarea"
                  />
                </label>
              </div>

              {error && (
                <div className="contact-form-alert alert-error" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="contact-form-alert alert-success" role="status">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>Your tracking reference is <strong>{result.reference}</strong>. We will contact you shortly.</p>
                  </div>
                </div>
              )}

              <div className="contact-form-footer">
                <button type="submit" disabled={isSubmitting} className="btn-submit-contact">
                  {isSubmitting ? "Sending inquiry…" : "Send Message"}
                  <span aria-hidden="true">→</span>
                </button>
                <span className="form-privacy-note">
                  🔒 We respect your privacy. Details are solely used to answer your inquiry.
                </span>
              </div>
            </form>
          </div>

          {/* Right: Operational Details & Fast-Track WhatsApp */}
          <aside className="contact-info-sidebar">
            {/* Operating Hours Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div className="sidebar-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3>Operating Hours</h3>
              </div>

              <div className="hours-list">
                <div className="hours-row">
                  <span className="day-name">Monday – Friday</span>
                  <span className="day-time">7:30 am – 5:00 pm</span>
                </div>
                <div className="hours-row">
                  <span className="day-name">Saturday</span>
                  <span className="day-time">7:30 am – 5:00 pm</span>
                </div>
                <div className="hours-row closed-row">
                  <span className="day-name">Sunday</span>
                  <span className="day-tag">Emergency Dispatch Only</span>
                </div>
              </div>

              <div className="live-status-badge">
                <span className="status-ping" aria-hidden="true" />
                <span>Available across Greater Accra &amp; nationwide</span>
              </div>
            </div>

            {/* Fast-Track WhatsApp Presets */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div className="sidebar-icon whatsapp-icon-bg" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.24-8.2 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z" />
                  </svg>
                </div>
                <h3>Fast-Track on WhatsApp</h3>
              </div>
              <p className="sidebar-subtext">Tap any common request below to launch WhatsApp with your message ready:</p>

              <div className="whatsapp-presets-list">
                {WHATSAPP_PRESETS.map((preset) => (
                  <a
                    key={preset.label}
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(preset.message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preset-chip"
                  >
                    <span>{preset.label}</span>
                    <span className="preset-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Booking Bridge */}
            <div className="sidebar-card booking-cta-card">
              <div className="cta-content">
                <span className="cta-tag">PLANNING AN INSTALLATION?</span>
                <h4>Schedule a site visit directly online</h4>
                <p>Choose your preferred date and time window with our technician team.</p>
                <Link href="/book-service" className="btn-sidebar-book">
                  <span>Book a Service</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
