import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './database/prisma.module.js';
import { ServiceRequestsModule } from './service-requests/service-requests.module.js';
import { ServicesController } from './services/services.controller.js';
import { ServicesService } from './services/services.service.js';

@Module({
  imports: [PrismaModule, ServiceRequestsModule],
  controllers: [AppController, ServicesController],
  providers: [AppService, ServicesService],
})
export class AppModule {}
