'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Kobby's Intertech Services home">
        <Image src="/brand/logo.png" alt="" width={42} height={42} priority />
        <span className="brand-wordmark">
          <span className="brand-name">
            <span>K</span><span>O</span><span>B</span><span>B</span><span>Y</span><span>&apos;</span><span>S</span>
          </span>
          <span className="brand-sub">INTERTECH SERVICES</span>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <div className="header-actions">
        <Link className="button button-small header-desktop-btn" href="/book-service">
          Book a service
        </Link>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-dropdown-menu">
          <nav aria-label="Mobile navigation" className="mobile-dropdown-links">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <div className="mobile-dropdown-cta">
              <Link className="button button-small" href="/book-service" onClick={() => setMenuOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
                Book a service
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
