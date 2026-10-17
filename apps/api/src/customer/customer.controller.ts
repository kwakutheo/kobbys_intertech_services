import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { CustomerService } from './customer.service.js';

@Controller({ path: 'customer', version: '1' })
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('requests')
  listMyRequests(@Req() request: AuthenticatedRequest) {
    return this.customerService.listRequestsForUser(request.user.sub);
  }
}
