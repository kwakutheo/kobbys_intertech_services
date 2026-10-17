import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { ServiceRequestsService } from './service-requests.service.js';

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
}
