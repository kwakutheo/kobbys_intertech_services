'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { adminFetch } from '@/lib/admin-roles';

type StaffMember = {
  id: string;
  email: string;
  displayName: string | null;
  accountStatus: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DEACTIVATED';
  lastLoginAt: string | null;
  createdAt: string;
  roles: string[];
};

/** Roles an owner may hand out. OWNER itself is only reassigned via succession. */
const grantableRoles = [
  ['ADMIN', 'Administrator'],
  ['BOOKINGS_MANAGER', 'Bookings Manager'],
  ['CONTENT_EDITOR', 'Content Editor'],
] as const;

const backendMessage = async (response: Response, fallback: string) => {
  const data = await response.json().catch(() => null);
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return fallback;
};

export default function AdminTeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newStaff, setNewStaff] = useState({ displayName: '', email: '', role: 'BOOKINGS_MANAGER' });
  const [submitting, setSubmitting] = useState(false);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/backend/admin/staff', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setStaff(Array.isArray(data) ? data : []);
      } else {
        setError(await backendMessage(response, 'You do not have permission to view team access.'));
      }
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadStaff(); }, [loadStaff]);

  const submitStaffAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const response = await adminFetch('/api/admin/backend/admin/staff/invite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          displayName: newStaff.displayName,
          email: newStaff.email,
          role: newStaff.role,
        }),
      });
      if (!response.ok) {
        setError(await backendMessage(response, 'Unable to invite this staff member.'));
        return;
      }
      setNewStaff({ displayName: '', email: '', role: 'BOOKINGS_MANAGER' });
      setMessage(`An activation link has been emailed to ${newStaff.email}. It expires in 24 hours.`);
      await loadStaff();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStaff = async (member: StaffMember, patch: Record<string, string>) => {
    setError('');
    try {
      const response = await adminFetch(`/api/admin/backend/admin/staff/${member.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
      });
      if (!response.ok) {
        setError(await backendMessage(response, 'Unable to update this staff account.'));
        return;
      }
      setMessage(`${member.displayName || member.email} updated.`);
      await loadStaff();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    }
  };

  const resetPassword = async (member: StaffMember) => {
    setError('');
    try {
      const response = await adminFetch(`/api/admin/backend/admin/staff/${member.id}/password-reset`, { method: 'POST' });
      if (!response.ok) {
        setError(await backendMessage(response, 'Unable to send an access link.'));
        return;
      }
      // The API emails the link to the staff member, so report where it went
      // rather than leaving a link on screen that nobody can retrieve.
      setMessage(`An access link has been emailed to ${member.displayName || member.email}. It expires in 24 hours.`);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    }
  };

  const removeStaff = async (member: StaffMember) => {
    if (!confirm(`Remove ${member.displayName || member.email} from the team? They will lose all access immediately.`)) return;
    setError('');
    try {
      const response = await adminFetch(`/api/admin/backend/admin/staff/${member.id}`, { method: 'DELETE' });
      if (!response.ok) {
        setError(await backendMessage(response, 'Unable to remove this staff member.'));
        return;
      }
      setMessage(`${member.displayName || member.email} has been removed from the team.`);
      await loadStaff();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    }
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
              <h2>Invite a staff member</h2>
              <p>An activation link will be emailed to the address below. The invitee sets their own password to activate the account.</p>
              <label>Full name<input required value={newStaff.displayName} onChange={(event) => setNewStaff({ ...newStaff, displayName: event.target.value })} placeholder="e.g. Ama Mensah" /></label>
              <label>Work email<input required type="email" value={newStaff.email} onChange={(event) => setNewStaff({ ...newStaff, email: event.target.value })} placeholder="ama@company.com" /></label>
              <label>Role<select value={newStaff.role} onChange={(event) => setNewStaff({ ...newStaff, role: event.target.value })}>{grantableRoles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <button className="admin-login-btn" type="submit" disabled={submitting}>{submitting ? 'Sending invitation…' : 'Send activation link'}</button>
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


          {loading ? <section className="admin-team-list"><div className="admin-loading">Loading staff accounts…</div></section> : (() => {
            const owners = staff.filter((m) => m.roles.some((r) => r === 'OWNER'));
            const team = staff.filter((m) => !m.roles.some((r) => r === 'OWNER'));
            return <>
              {owners.length > 0 && <section className="admin-team-list">
                <div className="admin-section-title">Owner</div>
                {owners.map((member) => (
                  <article className="admin-team-member admin-team-member--owner" key={member.id}>
                    <div className="admin-team-member-info"><strong>{member.displayName || 'Unnamed owner'}</strong><span>{member.email}</span><small>Last sign-in: {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString('en-GB') : 'Never'}</small></div>
                    <div className="admin-team-member-controls"><span className={`admin-account-status admin-account-status--${member.accountStatus.toLowerCase()}`}>{member.accountStatus.toLowerCase()}</span>
                      <button type="button" className="admin-btn-action" title={member.accountStatus === 'INVITED' ? 'Email a fresh activation link' : 'Email a password-reset link'} disabled={member.accountStatus !== 'ACTIVE' && member.accountStatus !== 'INVITED'} onClick={() => void resetPassword(member)}>Send access link</button>
                    </div>
                  </article>
                ))}
              </section>}
              <section className="admin-team-list">
                <div className="admin-section-title">Team members</div>
                {team.length === 0 ? <p className="admin-team-empty">No team members yet. Invite someone above to get started.</p> : team.map((member) => {
                  const role = member.roles.find((item) => item !== 'CUSTOMER') || 'STAFF';
                  return <article className="admin-team-member" key={member.id}>
                    <div className="admin-team-member-info"><strong>{member.displayName || 'Unnamed staff member'}</strong><span>{member.email}</span><small>Last sign-in: {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString('en-GB') : 'Never'}</small></div>
                    <div className="admin-team-member-controls"><span className={`admin-account-status admin-account-status--${member.accountStatus.toLowerCase()}`}>{member.accountStatus.toLowerCase()}</span>
                      <select value={role} onChange={(event) => void updateStaff(member, { role: event.target.value })}>{grantableRoles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                      <button type="button" className="admin-btn-action" title={member.accountStatus === 'INVITED' ? 'Email a fresh activation link' : 'Email a password-reset link'} disabled={member.accountStatus !== 'ACTIVE' && member.accountStatus !== 'INVITED'} onClick={() => void resetPassword(member)}>Send access link</button>
                      <button type="button" className="admin-btn-action admin-btn-danger" onClick={() => void updateStaff(member, { accountStatus: member.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' })}>{member.accountStatus === 'SUSPENDED' ? 'Restore' : 'Suspend'}</button>
                      <button type="button" className="admin-btn-action admin-btn-danger" onClick={() => void removeStaff(member)}>Remove</button>
                    </div>
                  </article>;
                })}
              </section>
            </>;
          })()}
        </main>
      </div>
    </div>
  );
}
