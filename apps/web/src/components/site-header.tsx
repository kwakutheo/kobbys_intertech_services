'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isLinkActive(link.href) ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isLinkActive(link.href) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
