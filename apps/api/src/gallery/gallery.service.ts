import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Photos are served from apps/web/public/gallery/
const GALLERY_DIR = path.resolve('..', 'web', 'public', 'gallery');

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.galleryPhoto.findMany({
      orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    });
  }

  async create(filename: string, caption?: string) {
    return this.prisma.galleryPhoto.create({
      data: { filename, caption: caption ?? null },
    });
  }

  async remove(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');

    // Delete physical file
    try {
      await fs.unlink(path.join(GALLERY_DIR, photo.filename));
    } catch {
      // File may already be gone – proceed with DB deletion
    }

    return this.prisma.galleryPhoto.delete({ where: { id } });
  }

  async updateCaption(id: string, caption: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    return this.prisma.galleryPhoto.update({ where: { id }, data: { caption } });
  }
}
