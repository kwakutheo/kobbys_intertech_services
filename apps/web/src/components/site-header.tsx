'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SERVICES_LIST = [
  { href: "/services/cctv-security", label: "CCTV & Security" },
  { href: "/services/fibre-internet", label: "Fibre & Internet" },
  { href: "/services/networking", label: "Networks" },
  { href: "/services/satellite", label: "Satellite Support" },
  { href: "/services/electrical-works", label: "Electrical Works" },
  { href: "/services/gps-tracking", label: "GPS Tracking" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={`site-header${menuOpen ? " menu-is-open" : ""}`}>
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
        <Link href="/" className={isLinkActive("/") ? "active" : ""}>
          Home
        </Link>

        {/* 'Our Services' Dropdown */}
        <div className="nav-dropdown-item">
          <Link
            href="/services"
            className={isLinkActive("/services") ? "active" : ""}
          >
            Our Services <span className="nav-chevron" aria-hidden="true">▾</span>
          </Link>
          <div className="nav-dropdown-menu" role="menu">
            {SERVICES_LIST.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                role="menuitem"
                className={`nav-dropdown-link ${pathname === svc.href ? "active-sublink" : ""}`}
              >
                {svc.label}
              </Link>
            ))}
            <div className="nav-dropdown-divider" />
            <Link href="/services" className="nav-dropdown-all">
              All services overview <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <Link href="/gallery" className={isLinkActive("/gallery") ? "active" : ""}>
          Gallery
        </Link>
        <Link href="/about" className={isLinkActive("/about") ? "active" : ""}>
          About Us
        </Link>
        <Link href="/contact" className={isLinkActive("/contact") ? "active" : ""}>
          Contact Us
        </Link>
        <Link href="/faq" className={isLinkActive("/faq") ? "active" : ""}>
          FAQ
        </Link>
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
          aria-controls="mobile-navigation"
          onTouchEnd={(e) => {
            e.preventDefault();
            toggleMenu();
          }}
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav — always in DOM; visibility driven by .menu-is-open on <header> */}
      <div
        className="mobile-dropdown-menu"
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="mobile-dropdown-links">
          <Link href="/" className={isLinkActive("/") ? "active" : ""} onClick={closeMenu}>
            Home
          </Link>

          <div className="mobile-nav-group">
            <div className="mobile-nav-header">
              <Link
                href="/services"
                className={isLinkActive("/services") ? "active" : ""}
                onClick={closeMenu}
              >
                Our Services
              </Link>
              <button
                type="button"
                className="mobile-subnav-toggle"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-label="Toggle services list"
                aria-expanded={mobileServicesOpen}
              >
                <span className="chevron">{mobileServicesOpen ? "▴" : "▾"}</span>
              </button>
            </div>
            {mobileServicesOpen && (
              <div className="mobile-sublinks">
                {SERVICES_LIST.map((svc) => (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    className={`mobile-sublink ${pathname === svc.href ? "active" : ""}`}
                    onClick={closeMenu}
                  >
                    {svc.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/gallery" className={isLinkActive("/gallery") ? "active" : ""} onClick={closeMenu}>
            Gallery
          </Link>
          <Link href="/about" className={isLinkActive("/about") ? "active" : ""} onClick={closeMenu}>
            About Us
          </Link>
          <Link href="/contact" className={isLinkActive("/contact") ? "active" : ""} onClick={closeMenu}>
            Contact Us
          </Link>
          <Link href="/faq" className={isLinkActive("/faq") ? "active" : ""} onClick={closeMenu}>
            FAQ
          </Link>

          <div className="mobile-dropdown-cta">
            <Link
              className="button button-small"
              href="/book-service"
              onClick={closeMenu}
              style={{ width: "100%", textAlign: "center" }}
            >
              Book a service
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
