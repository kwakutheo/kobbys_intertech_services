import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { getAdminSession, SESSION_COOKIE } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: "Admin Portal | Kobby's Intertech Services",
  description: "Management dashboard for Kobby's Intertech Services staff and administrators.",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession((await cookies()).get(SESSION_COOKIE)?.value);
  const isOwner = session?.user.roles.includes('OWNER') ?? false;

  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
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
          <Link href="/admin/bookings" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Service Bookings
          </Link>
          <Link href="/admin/gallery" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </Link>
          {isOwner && <Link href="/admin/team" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Team &amp; Access
          </Link>}
          <Link href="/admin/account" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            My Account
          </Link>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Admin Portal</div>
            <h1 className="admin-page-title">Control Center</h1>
            <p className="admin-page-lead">
              Manage gallery media, review customer requests, and oversee Kobby&apos;s Intertech Services operations from here.
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
              <div className="admin-stat-sub">connected to API</div>
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
            {isOwner && <Link href="/admin/team" className="admin-module-card">
            <div className="admin-module-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
            </div>
            <div className="admin-module-eyebrow">Security &amp; Staff</div>
            <h2 className="admin-module-title">Team &amp; Access</h2>
            <p className="admin-module-desc">Invite staff, assign roles, and manage secure account access.</p>
            <span className="admin-module-cta">
              Open Team Manager →
            </span>
          </Link>}
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
            <Link href="/admin/bookings" className="admin-module-card">
              <div className="admin-module-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="admin-module-eyebrow">Operations &amp; Schedule</div>
              <h2 className="admin-module-title">Service Bookings &amp; Quotes</h2>
              <p className="admin-module-desc">
                Review incoming client bookings, manage site visit schedules, update job statuses, and contact customers via WhatsApp or Phone.
              </p>
              <span className="admin-module-cta">
                Open Bookings Manager →
              </span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
