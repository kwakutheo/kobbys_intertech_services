import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller.js';
import { GalleryService } from './gallery.service.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
