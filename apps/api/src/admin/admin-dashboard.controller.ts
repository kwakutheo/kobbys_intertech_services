import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { STAFF_ROLES } from '../auth/admin-roles.js';
import { AdminDashboardService } from './admin-dashboard.service.js';

@Controller({ path: 'admin/dashboard', version: '1' })
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  /** GET /api/v1/admin/dashboard/stats — live dashboard counters (any staff role) */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  getStats() {
    return this.adminDashboardService.getDashboardStats();
  }
}
