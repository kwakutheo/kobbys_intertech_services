import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { ServiceRequestsService } from './service-requests.service.js';
import { ServiceRequestStatus } from '@prisma/client';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller({ path: 'enquiries', version: '1' })
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  createEnquiry(
    @Body() input: CreateEnquiryDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.serviceRequestsService.createPublicEnquiry(input, idempotencyKey);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'BOOKINGS_MANAGER')
  findAll(
    @Query('status') status?: ServiceRequestStatus,
    @Query('search') search?: string,
  ) {
    return this.serviceRequestsService.findAll(status, search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'BOOKINGS_MANAGER')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'BOOKINGS_MANAGER')
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('status') status: ServiceRequestStatus,
    @Body('note') note?: string,
  ) {
    return this.serviceRequestsService.updateStatus(id, status, note, request.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.serviceRequestsService.remove(id, request.user.sub);
  }
}
