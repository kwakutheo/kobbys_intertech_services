import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { R2Service } from './r2.service.js';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Resolves the legacy local gallery folder (used as fallback for existing photos). */
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async findAll(category?: string) {
    return this.prisma.galleryPhoto.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    return photo;
  }

  /**
   * Upload a photo buffer to Cloudflare R2, then persist the record in the DB.
   * Falls back to local disk storage if R2 credentials are not configured.
   */
  async create(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    caption?: string,
    sortOrder?: number,
    category?: string,
  ) {
    const r2Configured =
      process.env.CF_R2_ACCOUNT_ID &&
      process.env.CF_R2_ACCESS_KEY_ID &&
      process.env.CF_R2_SECRET_ACCESS_KEY &&
      process.env.CF_R2_PUBLIC_URL;

    let filename: string;
    let url: string | undefined;
    let r2Key: string | undefined;

    if (r2Configured) {
      // ── Cloud path: upload to R2 ──────────────────────────────────────────
      const result = await this.r2.upload(buffer, originalName, mimeType);
      r2Key = result.key;
      url = result.url;
      filename = result.key; // store the key as the unique identifier
    } else {
      // ── Local fallback: write to disk (development only) ──────────────────
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      filename = `photo_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
      await fs.writeFile(path.join(getGalleryDir(), filename), buffer);
    }

    return this.prisma.galleryPhoto.create({
      data: {
        filename,
        caption: caption ?? null,
        url: url ?? null,
        r2Key: r2Key ?? null,
        category: category ?? null,
        ...(sortOrder !== undefined ? { sortOrder } : {}),
      },
    });
  }

  async remove(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');

    const r2Key = photo.r2Key || (photo.url && photo.filename.includes('/') ? photo.filename : null);
    if (r2Key) {
      // ── Cloud path: delete from R2 ────────────────────────────────────────
      await this.r2.delete(r2Key);
    } else {
      // ── Local fallback: delete file from disk ─────────────────────────────
      try {
        await fs.unlink(path.join(getGalleryDir(), photo.filename));
      } catch {
        // File may already be gone – proceed with DB deletion
      }
    }

    return this.prisma.galleryPhoto.delete({ where: { id } });
  }

  async update(id: string, data: { caption?: string; sortOrder?: number; category?: string | null }) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    return this.prisma.galleryPhoto.update({
      where: { id },
      data: {
        ...(data.caption !== undefined ? { caption: data.caption } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
      },
    });
  }
}
