'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-url';

export function AdminActivationForm() {
  const token = useSearchParams().get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return setError('This access link is missing or invalid. Request a new link from an account owner.');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirmPassword) return setError('Your passwords do not match.');
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/staff/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'Unable to set your password.');
      setComplete(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to set your password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Set your staff password</h1>
        <p className="admin-login-sub">Create a secure password to activate your account or complete a password reset.</p>
        {complete ? (
          <div className="admin-activation-success">
            <p>Your password has been set. You can now sign in.</p>
            <Link href="/admin/login" className="admin-login-btn">Go to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="admin-login-label" htmlFor="staff-password">New password</label>
            <div className="admin-password-wrapper">
              <input
                id="staff-password"
                className="admin-login-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={submitting}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <label className="admin-login-label" htmlFor="staff-password-confirm">Confirm password</label>
            <div className="admin-password-wrapper">
              <input
                id="staff-password-confirm"
                className="admin-login-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="admin-login-error">{error}</p>}
            <button className="admin-login-btn" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Set password'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
