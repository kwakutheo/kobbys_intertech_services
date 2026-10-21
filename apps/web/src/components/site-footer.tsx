'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "CCTV & Security", href: "/services/cctv-security" },
  { label: "Fibre & Satellite Internet", href: "/services/fibre-internet" },
  { label: "Network Infrastructure", href: "/services/networking" },
  { label: "Satellite TV", href: "/services/satellite" },
  { label: "Electrical Works", href: "/services/electrical-works" },
  { label: "GPS Tracking", href: "/services/gps-tracking" },
];

export function SiteFooter() {
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="site-footer">
      {/* Top bar */}
      <div className="footer-top">
        <div className="footer-brand-col">
          <Link href="/" className="footer-brand-link">
            <Image src="/brand/footer_logo.png" alt="Kobby's Intertech Services logo" width={56} height={56} style={{ mixBlendMode: 'screen' }} />
            <span className="footer-wordmark">
              <span className="footer-brand-name">
                <span>K</span><span>O</span><span>B</span><span>B</span><span>Y</span><span>&apos;</span><span>S</span>
              </span>
              <span className="footer-brand-sub">INTERTECH SERVICES</span>
            </span>
          </Link>
          <p className="footer-tagline">
          </p>
          {/* Contact block */}
          <ul className="footer-contact-list">
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Achimota, Accra – Ghana</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.6 16h.32z"/></svg>
              <a href="tel:+233243487160">+233 24 348 7160</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:kobbysintertech@gmail.com">kobbysintertech@gmail.com</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Mon – Sat &nbsp;·&nbsp; 7:30 am – 5:00 pm</span>
            </li>
          </ul>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-col-heading">Quick Links</h4>
          <ul className="footer-nav-list">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-col-heading">Services Menu</h4>
          <ul className="footer-nav-list">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-cta-col">
          <h4 className="footer-col-heading">Get Started</h4>
          <p className="footer-cta-text">Ready to upgrade your property? Contact us or book a service today.</p>
          <div className="footer-cta-btns">
            <Link href="/contact" className="footer-btn-primary">Contact Us</Link>
            <Link href="/book-service" className="footer-btn-secondary">Book a Service</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">
            <span>© {year} Kobby&apos;s Intertech Services. All rights reserved.</span>
            <span className="footer-sep">·</span>
            <Link href="/privacy" className="footer-privacy-link">| Privacy Policy |</Link>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-back-to-top"
            aria-label="Back to top"
          >
            <span> | Back to top </span>
            <span aria-hidden="true">↑ |</span>
          </button>
        </div>
      </div>

    </footer>
  );
}
