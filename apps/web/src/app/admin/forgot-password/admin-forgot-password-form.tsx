'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-url';

export function AdminForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/staff/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Unable to submit your request. Please try again.');
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Reset your password</h1>
        <p className="admin-login-sub">
          Enter your staff email address and we will send a secure password-reset link if an active account matches it.
        </p>

        {submitted ? (
          <div className="admin-activation-success">
            <p>If the email belongs to an active staff account, a reset link is on its way. Check your inbox and spam folder.</p>
            <Link href="/admin/login" className="admin-login-btn">Return to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="admin-login-label" htmlFor="staff-reset-email">Work email</label>
            <input
              id="staff-reset-email"
              className="admin-login-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@company.com"
              required
              autoFocus
              disabled={submitting}
            />
            {error && <p className="admin-login-error">{error}</p>}
            <button className="admin-login-btn" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        {!submitted && <Link href="/admin/login" className="admin-login-back">← Return to sign in</Link>}
      </div>
    </main>
  );
}
