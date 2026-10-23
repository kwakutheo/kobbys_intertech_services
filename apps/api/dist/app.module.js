var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map