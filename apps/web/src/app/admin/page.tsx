import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export const metadata: Metadata = {
  title: "Admin Portal | Kobby's Intertech Services",
  description: "Management dashboard for Kobby's Intertech Services staff and administrators.",
};

export default function AdminDashboardPage() {
  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <Link href="/admin" className="admin-topbar-logo">
          <div className="admin-topbar-logo-mark">KI</div>
          <span className="admin-topbar-name">Kobby&apos;s Intertech</span>
        </Link>
        <div className="admin-topbar-divider" />
        <span className="admin-topbar-section">Admin Portal</span>
        <div className="admin-topbar-spacer" />
        <Link href="/" className="admin-topbar-back">
          View Live Site ↗
        </Link>
        <AdminLogoutButton />
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Navigation</div>
          <Link href="/admin" className="admin-nav-link active">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/gallery" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </Link>
          <div className="admin-sidebar-label" style={{ marginTop: 12 }}>Public Pages</div>
          <Link href="/services" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
            Services
          </Link>
          <Link href="/book-service" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Book Service
          </Link>
          <Link href="/request-quote" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Request Quote
          </Link>
          <Link href="/contact" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact
          </Link>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Admin Portal</div>
            <h1 className="admin-page-title">Control Center</h1>
            <p className="admin-page-lead">
              Manage gallery media, review customer requests, and oversee Kobby&apos;s Intertech Services operations from a single dashboard.
            </p>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Portal Status</div>
              <div className="admin-stat-value" style={{ color: '#4ade80', fontSize: 22 }}>● Live</div>
              <div className="admin-stat-sub">All systems operational</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Modules</div>
              <div className="admin-stat-value">3</div>
              <div className="admin-stat-sub">management areas</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">API</div>
              <div className="admin-stat-value" style={{ fontSize: 18 }}>PostgreSQL</div>
              <div className="admin-stat-sub">connected at :4000</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Access</div>
              <div className="admin-stat-value" style={{ fontSize: 18 }}>Staff</div>
              <div className="admin-stat-sub">password-protected</div>
            </div>
          </div>

          {/* Module cards */}
          <div className="admin-section-title">Management Modules</div>

          <div className="admin-module-grid">
            {/* Gallery */}
            <Link href="/admin/gallery" className="admin-module-card">
              <div className="admin-module-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="admin-module-eyebrow">Media &amp; Showcase</div>
              <h2 className="admin-module-title">Photo Gallery</h2>
              <p className="admin-module-desc">
                Upload new installation photos, edit captions, or delete outdated showcase images. Changes reflect on the live website instantly.
              </p>
              <span className="admin-module-cta">
                Open Gallery Manager →
              </span>
            </Link>

            {/* Bookings */}
            <div className="admin-module-card">
              <div className="admin-module-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="admin-module-eyebrow">Operations</div>
              <h2 className="admin-module-title">Service Bookings</h2>
              <p className="admin-module-desc">
                Review incoming client bookings, site visit schedules, and job statuses submitted through the online booking form.
              </p>
              <Link href="/book-service" className="admin-module-cta">
                View Booking Form ↗
              </Link>
            </div>

            {/* Quotes */}
            <div className="admin-module-card">
              <div className="admin-module-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="admin-module-eyebrow">Customer Service</div>
              <h2 className="admin-module-title">Enquiries &amp; Quotes</h2>
              <p className="admin-module-desc">
                Manage customer contact enquiries and tailored quotation requests for residential and corporate clients across Ghana.
              </p>
              <Link href="/request-quote" className="admin-module-cta">
                View Quote Portal ↗
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

