import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CustomerModule } from './customer/customer.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { GalleryModule } from './gallery/gallery.module.js';
import { ServiceRequestsModule } from './service-requests/service-requests.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { ServicesController } from './services/services.controller.js';
import { ServicesService } from './services/services.service.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    // Lenient global ceiling per IP. Sensitive routes tighten this with
    // @Throttle(), so normal browsing and dashboard polling are never limited.
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 300, ttl: 60_000 }],
      errorMessage: 'Too many attempts. Please wait a moment before trying again.',
    }),
    PrismaModule,
    AuthModule,
    CustomerModule,
    ServiceRequestsModule,
    GalleryModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController, ServicesController],
  providers: [AppService, ServicesService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
