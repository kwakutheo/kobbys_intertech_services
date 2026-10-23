import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { AdminAccessService } from './admin-access.service.js';
import { ForgotStaffPasswordDto, InviteStaffDto, SetStaffPasswordDto, UpdateStaffDto } from './dto/invite-staff.dto.js';

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
  invite(@Req() request: AuthenticatedRequest, @Body() input: InviteStaffDto) {
    return this.adminAccessService.inviteStaff(request.user.sub, input);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  update(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() input: UpdateStaffDto) {
    return this.adminAccessService.updateStaff(request.user.sub, id, input);
  }

  @Post(':id/password-reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  passwordReset(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.adminAccessService.createPasswordReset(request.user.sub, id);
  }

  @Post('set-password')
  setPassword(@Body() input: SetStaffPasswordDto) {
    return this.adminAccessService.setPassword(input.token, input.password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotStaffPasswordDto) {
    return this.adminAccessService.requestPasswordReset(input.email);
  }
}
