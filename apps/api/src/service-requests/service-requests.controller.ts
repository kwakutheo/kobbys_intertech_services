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
} from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { ServiceRequestsService } from './service-requests.service.js';
import { ServiceRequestStatus } from '@prisma/client';

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
  findAll(
    @Query('status') status?: ServiceRequestStatus,
    @Query('search') search?: string,
  ) {
    return this.serviceRequestsService.findAll(status, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ServiceRequestStatus,
    @Body('note') note?: string,
  ) {
    return this.serviceRequestsService.updateStatus(id, status, note);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
}

