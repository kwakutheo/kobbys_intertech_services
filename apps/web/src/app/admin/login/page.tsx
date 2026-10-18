import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AdminLoginForm } from './admin-login-form';

export const metadata: Metadata = {
  title: "Admin Sign In | Kobby's Intertech Services",
  description: "Secure login portal for Kobby's Intertech Services staff and administrators.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login-shell">
          <div className="admin-login-card" style={{ textAlign: 'center', color: 'var(--admin-muted)' }}>
            <div className="admin-login-logo">KI</div>
            <p>Loading security portal…</p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
