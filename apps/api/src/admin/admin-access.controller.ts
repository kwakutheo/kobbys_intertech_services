import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { throttleByIdentity } from '../auth/throttle-trackers.js';
import { STAFF_ROLES } from '../auth/admin-roles.js';
import { AdminAccessService } from './admin-access.service.js';
import { ChangeOwnPasswordDto, CreateStaffDto, ForgotStaffPasswordDto, InviteStaffDto, SetStaffPasswordDto, UpdateStaffDto } from './dto/invite-staff.dto.js';

@Controller({ path: 'admin/staff', version: '1' })
export class AdminAccessController {
  constructor(private readonly adminAccessService: AdminAccessService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  listStaff() {
    return this.adminAccessService.listStaff();
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Throttle({ default: { limit: 30, ttl: 60 * 60_000 } })
  invite(@Req() request: AuthenticatedRequest, @Body() input: InviteStaffDto) {
    return this.adminAccessService.inviteStaff(request.user.sub, input);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Throttle({ default: { limit: 30, ttl: 60 * 60_000 } })
  create(@Req() request: AuthenticatedRequest, @Body() input: CreateStaffDto) {
    return this.adminAccessService.createStaff(request.user.sub, input);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Throttle({ default: { limit: 60, ttl: 60 * 60_000 } })
  update(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() input: UpdateStaffDto) {
    return this.adminAccessService.updateStaff(request.user.sub, id, input);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Throttle({ default: { limit: 30, ttl: 60 * 60_000 } })
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.adminAccessService.removeStaff(request.user.sub, id);
  }

  @Post(':id/password-reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Throttle({ default: { limit: 30, ttl: 60 * 60_000 } })
  passwordReset(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.adminAccessService.createPasswordReset(request.user.sub, id);
  }

  @Post('set-password')
  @Throttle({ default: { limit: 10, ttl: 60 * 60_000 } })
  setPassword(@Body() input: SetStaffPasswordDto) {
    return this.adminAccessService.setPassword(input.token, input.password);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60 * 60_000, getTracker: throttleByIdentity } })
  forgotPassword(@Body() input: ForgotStaffPasswordDto) {
    return this.adminAccessService.requestPasswordReset(input.email);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  @Throttle({ default: { limit: 10, ttl: 60 * 60_000 } })
  changeOwnPassword(@Req() request: AuthenticatedRequest, @Body() input: ChangeOwnPasswordDto) {
    return this.adminAccessService.changeOwnPassword(request.user.sub, input);
  }
}
