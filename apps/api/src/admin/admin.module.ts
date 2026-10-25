import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { PrismaModule } from '../database/prisma.module.js';
import { AdminAccessController } from './admin-access.controller.js';
import { AdminAccessService } from './admin-access.service.js';
import { AdminBootstrapService } from './admin-bootstrap.service.js';
import { AdminDashboardController } from './admin-dashboard.controller.js';
import { AdminDashboardService } from './admin-dashboard.service.js';

@Module({
  imports: [AuthModule, NotificationsModule, PrismaModule],
  controllers: [AdminAccessController, AdminDashboardController],
  providers: [AdminAccessService, AdminBootstrapService, AdminDashboardService],
})
export class AdminModule {}
