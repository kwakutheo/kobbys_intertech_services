'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  // Only allow internal redirects
  const destination = rawFrom && rawFrom.startsWith('/') ? rawFrom : '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.error || 'Incorrect administrator password.');
        setSubmitting(false);
        return;
      }

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
        <div className="admin-login-logo">KI</div>
        <h1 className="admin-login-title">Admin Control Center</h1>
        <p className="admin-login-sub">
          Enter your administrator credentials to manage website media, bookings, and services.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="admin-login-label" htmlFor="admin-portal-password">
            Password
          </label>
          <input
            id="admin-portal-password"
            className="admin-login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            autoFocus
            disabled={submitting}
            placeholder="Enter admin password"
          />

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

        <Link href="/" className="admin-login-back">
          ← Return to Live Website
        </Link>
      </div>
    </div>
  );
}
