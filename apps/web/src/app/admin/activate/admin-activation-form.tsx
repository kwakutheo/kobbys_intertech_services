'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-url';

export function AdminActivationForm() {
  const token = useSearchParams().get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return setError('This access link is missing or invalid. Request a new link from an account owner.');
    if (password.length < 12) return setError('Use at least 12 characters for your password.');
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
            <input id="staff-password" className="admin-login-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={12} required disabled={submitting} />
            <label className="admin-login-label" htmlFor="staff-password-confirm">Confirm password</label>
            <input id="staff-password-confirm" className="admin-login-input" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} required disabled={submitting} />
            {error && <p className="admin-login-error">{error}</p>}
            <button className="admin-login-btn" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Set password'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
