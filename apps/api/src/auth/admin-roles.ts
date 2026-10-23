export const STAFF_ROLES = ['OWNER', 'ADMIN', 'BOOKINGS_MANAGER', 'CONTENT_EDITOR'] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const isStaffRole = (role: string): role is StaffRole =>
  STAFF_ROLES.includes(role as StaffRole);
