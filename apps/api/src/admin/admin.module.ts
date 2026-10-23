import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminAccessController } from './admin-access.controller.js';
import { AdminAccessService } from './admin-access.service.js';
import { AdminBootstrapService } from './admin-bootstrap.service.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminAccessController],
  providers: [AdminAccessService, AdminBootstrapService],
})
export class AdminModule {}
