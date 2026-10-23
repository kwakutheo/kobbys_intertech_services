'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export function AdminAccountManager() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8) return setError('Use a new password of at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('The new password confirmation does not match.');

    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/backend/admin/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'Unable to change your password.');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Your password has been changed successfully.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to change your password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar"><div className="admin-topbar-divider" /><span className="admin-topbar-section">My Account</span><div className="admin-topbar-spacer" /><AdminLogoutButton /></header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Navigation</div>
          <Link href="/admin" className="admin-nav-link">Dashboard</Link>
          <Link href="/admin/bookings" className="admin-nav-link">Service Bookings</Link>
          <Link href="/admin/gallery" className="admin-nav-link">Gallery</Link>
          <Link href="/admin/team" className="admin-nav-link">Team &amp; Access</Link>
          <Link href="/admin/account" className="admin-nav-link active">My Account</Link>
        </aside>
        <main className="admin-main">
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Account Security</div>
            <h1 className="admin-page-title">My Account</h1>
            <p className="admin-page-lead">Change your own staff password. Your current password is required to protect your account.</p>
          </div>

          {error && <div className="admin-flash admin-flash--err">{error}</div>}
          {message && <div className="admin-flash admin-flash--ok">{message}</div>}

          <form className="admin-team-card admin-account-card" onSubmit={submit}>
            <h2>Change password</h2>
            <p>Use at least 8 characters and choose a password you do not use elsewhere.</p>
            <label>Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
            <label>New password<input required type="password" minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" /></label>
            <label>Confirm new password<input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            <button className="admin-login-btn" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Change password'}</button>
          </form>
        </main>
      </div>
    </div>
  );
}
