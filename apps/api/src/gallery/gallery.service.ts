import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getGalleryDir(): string {
  if (process.env.GALLERY_DIR) {
    if (!fsSync.existsSync(process.env.GALLERY_DIR)) {
      fsSync.mkdirSync(process.env.GALLERY_DIR, { recursive: true });
    }
    return process.env.GALLERY_DIR;
  }
  const candidates = [
    path.resolve(process.cwd(), '..', 'web', 'public', 'gallery'),
    path.resolve(process.cwd(), 'apps', 'web', 'public', 'gallery'),
    path.resolve(__dirname, '..', '..', '..', 'web', 'public', 'gallery'),
    path.resolve(__dirname, '..', '..', '..', '..', 'apps', 'web', 'public', 'gallery'),
  ];
  for (const dir of candidates) {
    if (fsSync.existsSync(dir)) return dir;
  }
  const fallback = path.resolve(process.cwd(), '..', 'web', 'public', 'gallery');
  fsSync.mkdirSync(fallback, { recursive: true });
  return fallback;
}

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.galleryPhoto.findMany({
      orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    return photo;
  }

  async create(filename: string, caption?: string, sortOrder?: number) {
    return this.prisma.galleryPhoto.create({
      data: {
        filename,
        caption: caption ?? null,
        ...(sortOrder !== undefined ? { sortOrder } : {}),
      },
    });
  }

  async remove(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');

    // Delete physical file
    try {
      await fs.unlink(path.join(getGalleryDir(), photo.filename));
    } catch {
      // File may already be gone – proceed with DB deletion
    }

    return this.prisma.galleryPhoto.delete({ where: { id } });
  }

  async update(id: string, data: { caption?: string; sortOrder?: number }) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    return this.prisma.galleryPhoto.update({
      where: { id },
      data: {
        ...(data.caption !== undefined ? { caption: data.caption } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
  }
}
