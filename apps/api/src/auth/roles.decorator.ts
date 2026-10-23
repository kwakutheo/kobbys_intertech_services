import { SetMetadata } from '@nestjs/common';
import type { StaffRole } from './admin-roles.js';

export const ROLES_KEY = 'staff_roles';
export const Roles = (...roles: StaffRole[]) => SetMetadata(ROLES_KEY, roles);
