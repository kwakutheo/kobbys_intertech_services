'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminLogoutButton } from '@/components/admin-logout-button';

type StaffMember = {
  id: string;
  email: string;
  displayName: string | null;
  accountStatus: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DEACTIVATED';
  lastLoginAt: string | null;
  createdAt: string;
  roles: string[];
};

const roles = [
  ['ADMIN', 'Administrator'],
  ['BOOKINGS_MANAGER', 'Bookings Manager'],
  ['CONTENT_EDITOR', 'Content Editor'],
] as const;

const labelRole = (role: string) => role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AdminTeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newStaff, setNewStaff] = useState({ displayName: '', email: '', role: 'BOOKINGS_MANAGER', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [accessLink, setAccessLink] = useState('');

  const loadStaff = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/admin/backend/admin/staff', { cache: 'no-store' });
    const data = await response.json().catch(() => null);
    if (response.ok) setStaff(Array.isArray(data) ? data : []);
    else setError(data?.message || 'You do not have permission to view team access.');
    setLoading(false);
  }, []);

  useEffect(() => { void loadStaff(); }, [loadStaff]);

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage('Secure access link copied. Share it only with the intended staff member.');
    } catch {
      setAccessLink(link);
    }
  };

  const submitStaffAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newStaff.password.length < 8) return setError('Use an initial password of at least 8 characters.');
    if (newStaff.password !== newStaff.confirmPassword) return setError('The password confirmation does not match.');
    setSubmitting(true);
    setError('');
    setMessage('');
    const response = await fetch('/api/admin/backend/admin/staff/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        displayName: newStaff.displayName,
        email: newStaff.email,
        role: newStaff.role,
        password: newStaff.password,
      }),
    });
    const data = await response.json().catch(() => null);
    setSubmitting(false);
    if (!response.ok) return setError(data?.message || 'Unable to create this staff account.');
    setNewStaff({ displayName: '', email: '', role: 'BOOKINGS_MANAGER', password: '', confirmPassword: '' });
    setMessage('Staff account created. Share the email address and initial password with the staff member through a trusted channel.');
    await loadStaff();
  };

  const updateStaff = async (member: StaffMember, patch: Record<string, string>) => {
    setError('');
    const response = await fetch(`/api/admin/backend/admin/staff/${member.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setError(data?.message || 'Unable to update this staff account.');
    setMessage(`${member.displayName || member.email} updated.`);
    await loadStaff();
  };

  const resetPassword = async (member: StaffMember) => {
    setError('');
    const response = await fetch(`/api/admin/backend/admin/staff/${member.id}/password-reset`, { method: 'POST' });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setError(data?.message || 'Unable to generate a reset link.');
    setAccessLink(data.resetUrl || '');
    await copyLink(data.resetUrl);
    setMessage(`A reset link for ${member.displayName || member.email} is ready to share.`);
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar"><div className="admin-topbar-divider" /><span className="admin-topbar-section">Team &amp; Access</span><div className="admin-topbar-spacer" /><AdminLogoutButton /></header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Navigation</div>
          <Link href="/admin" className="admin-nav-link">Dashboard</Link>
          <Link href="/admin/bookings" className="admin-nav-link">Service Bookings</Link>
          <Link href="/admin/gallery" className="admin-nav-link">Gallery</Link>
          <Link href="/admin/team" className="admin-nav-link active">Team &amp; Access</Link>
          <Link href="/admin/account" className="admin-nav-link">My Account</Link>
        </aside>
        <main className="admin-main">
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Security &amp; Staff Management</div>
            <h1 className="admin-page-title">Team &amp; Access</h1>
            <p className="admin-page-lead">Create individual staff accounts, apply least-privilege roles, and suspend access when necessary. Staff can securely change their own password from their account.</p>
          </div>

          {error && <div className="admin-flash admin-flash--err">{error}</div>}
          {message && <div className="admin-flash admin-flash--ok">{message}</div>}

          <section className="admin-team-grid">
            <form className="admin-team-card" onSubmit={submitStaffAccount}>
              <h2>Create staff account</h2>
              <p>Set a secure initial password here. It is stored securely and staff can change it later from their account.</p>
              <label>Full name<input required value={newStaff.displayName} onChange={(event) => setNewStaff({ ...newStaff, displayName: event.target.value })} placeholder="e.g. Ama Mensah" /></label>
              <label>Work email<input required type="email" value={newStaff.email} onChange={(event) => setNewStaff({ ...newStaff, email: event.target.value })} placeholder="ama@company.com" /></label>
              <label>Role<select value={newStaff.role} onChange={(event) => setNewStaff({ ...newStaff, role: event.target.value })}>{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label>Initial password<input required type="password" minLength={8} autoComplete="new-password" value={newStaff.password} onChange={(event) => setNewStaff({ ...newStaff, password: event.target.value })} placeholder="At least 8 characters" /></label>
              <label>Confirm initial password<input required type="password" minLength={8} autoComplete="new-password" value={newStaff.confirmPassword} onChange={(event) => setNewStaff({ ...newStaff, confirmPassword: event.target.value })} placeholder="Re-enter the password" /></label>
              <button className="admin-login-btn" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create staff account'}</button>
            </form>

            <section className="admin-team-card admin-role-guide">
              <h2>Role access</h2>
              <dl>
                <div><dt>Owner</dt><dd>Full access, including team management and protected deletions.</dd></div>
                <div><dt>Administrator</dt><dd>Manage bookings, gallery and operational records.</dd></div>
                <div><dt>Bookings Manager</dt><dd>Review customer bookings and update service statuses.</dd></div>
                <div><dt>Content Editor</dt><dd>Upload and edit gallery content; cannot delete media or view bookings.</dd></div>
              </dl>
            </section>
          </section>

          {accessLink && <section className="admin-access-link"><strong>Secure link ready</strong><p>Copy this private, one-time link and send it through a trusted channel. It expires in 24 hours.</p><div><code>{accessLink}</code><button type="button" className="admin-btn-action" onClick={() => void copyLink(accessLink)}>Copy link</button></div></section>}

          <section className="admin-team-list"><div className="admin-section-title">Staff accounts</div>
            {loading ? <div className="admin-loading">Loading staff accounts…</div> : staff.map((member) => {
              const role = member.roles.find((item) => item !== 'CUSTOMER') || 'STAFF';
              const isOwner = role === 'OWNER';
              return <article className="admin-team-member" key={member.id}>
                <div className="admin-team-member-info"><strong>{member.displayName || 'Unnamed staff member'}</strong><span>{member.email}</span><small>Last sign-in: {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString('en-GB') : 'Never'}</small></div>
                <div className="admin-team-member-controls"><span className={`admin-account-status admin-account-status--${member.accountStatus.toLowerCase()}`}>{member.accountStatus.toLowerCase()}</span>
                  <select value={role} disabled={isOwner} onChange={(event) => void updateStaff(member, { role: event.target.value })}>{isOwner ? <option value="OWNER">Owner</option> : roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                  <button type="button" className="admin-btn-action" disabled={member.accountStatus !== 'ACTIVE'} onClick={() => void resetPassword(member)}>Reset password</button>
                  {!isOwner && <button type="button" className="admin-btn-action admin-btn-danger" onClick={() => void updateStaff(member, { accountStatus: member.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' })}>{member.accountStatus === 'SUSPENDED' ? 'Restore' : 'Suspend'}</button>}
                </div>
              </article>;
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
