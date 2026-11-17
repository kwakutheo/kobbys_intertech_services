'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { resetAdminSignOutFlag } from '@/lib/admin-roles';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  // Only allow internal redirects
  const destination = rawFrom && rawFrom.startsWith('/') ? rawFrom : '/admin';
  const expired = searchParams.get('expired') === '1';
  const changed = searchParams.get('changed') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid staff email address or password.');
        setSubmitting(false);
        return;
      }

      // A new session is live, so later 401s must be allowed to redirect again.
      resetAdminSignOutFlag();
      router.push(destination);
      router.refresh();
    } catch {
      setError('Connection error. Please check your internet connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Control Center</h1>
        <p className="admin-login-sub">
          Sign in with your staff account to manage website media, bookings, and services.
        </p>

        {changed && !error && (
          <p className="admin-login-error" role="status">
            Your password has been changed. Please sign in with your new password.
          </p>
        )}

        {expired && !changed && !error && (
          <p className="admin-login-error" role="status">
            Your session timed out for security reasons after 15 minutes of inactivity. Please sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="admin-login-label" htmlFor="admin-portal-email">
            Work email
          </label>
          <input
            id="admin-portal-email"
            className="admin-login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            autoFocus
            disabled={submitting}
            placeholder="name@company.com"
          />
          <label className="admin-login-label" htmlFor="admin-portal-password">
            Password
          </label>
          <div className="admin-password-wrapper">
            <input
              id="admin-portal-password"
              className="admin-login-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            className="admin-login-btn"
            type="submit"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Verifying access…' : 'Sign in →'}
          </button>
        </form>

        <Link href="/admin/forgot-password" className="admin-forgot-password">
          Forgot password?
        </Link>

        <Link href="/" className="admin-login-back">
          ← Return to Live Website
        </Link>
      </div>
    </div>
  );
}
