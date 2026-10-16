import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './services.service.js';

@Controller({ path: 'services', version: '1' })
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  listActiveServices() {
    return this.servicesService.listActiveServices();
  }
}
