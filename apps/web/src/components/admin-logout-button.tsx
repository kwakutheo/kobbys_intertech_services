'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <>
      <Link href="/admin/account" className="admin-topbar-back" title="Manage your account">
        Account
      </Link>
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="admin-topbar-back admin-topbar-logout"
      style={{
        background: 'transparent',
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit',
      }}
      title="Sign out of Admin Portal"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
    </>
  );
}
