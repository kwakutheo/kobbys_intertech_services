export const STAFF_ROLES = ['OWNER', 'ADMIN', 'BOOKINGS_MANAGER', 'CONTENT_EDITOR'] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const isStaffRole = (role: string): role is StaffRole =>
  (STAFF_ROLES as readonly string[]).includes(role);

/** Roles an owner may hand out. OWNER itself is only reassigned, never issued. */
export const GRANTABLE_STAFF_ROLES: Array<[StaffRole, string]> = [
  ['ADMIN', 'Administrator'],
  ['BOOKINGS_MANAGER', 'Bookings Manager'],
  ['CONTENT_EDITOR', 'Content Editor'],
];

export const OWNER_ROLE: StaffRole = 'OWNER';

/**
 * The `/api/admin/backend` proxy authenticates with the server-side session
 * cookie, so a 401 only ever means that session no longer maps to a live
 * backend token. Left unnoticed, every admin panel reports that as a
 * permissions problem on a perfectly valid account - so sign the visitor out
 * and send them back to the login screen instead.
 */
export async function adminFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401 && !isSigningOut()) {
    beginSigningOut();
    redirectToIntendedPage();
  }
  return response;
}

const SIGN_OUT_FLAG = 'kis-admin-signing-out';

function isSigningOut(): boolean {
  if (typeof window === 'undefined') return true;
  return window.sessionStorage.getItem(SIGN_OUT_FLAG) === '1';
}

function beginSigningOut(): void {
  if (typeof window === 'undefined') return;
  // One redirect per page load: a dashboard that fires several requests at once
  // must not queue up a redirect storm when the session is gone.
  window.sessionStorage.setItem(SIGN_OUT_FLAG, '1');
}

function redirectToIntendedPage(): void {
  if (typeof window === 'undefined') return;
  const loginUrl = new URL('/admin/login', window.location.origin);
  const current = new URL(window.location.href);
  if (current.pathname !== '/admin') {
    loginUrl.searchParams.set('from', `${current.pathname}${current.search}`);
  }
  loginUrl.searchParams.set('expired', '1');
  window.location.replace(loginUrl.toString());
}

/** Clears the redirect latch once a fresh sign-in has completed. */
export function resetAdminSignOutFlag(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SIGN_OUT_FLAG);
}
