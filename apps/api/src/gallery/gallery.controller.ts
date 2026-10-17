import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { GalleryService } from './gallery.service.js';

const GALLERY_DIR = path.resolve('..', 'web', 'public', 'gallery');

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, GALLERY_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = `photo_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    cb(null, name);
  },
});

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  /** GET /api/v1/gallery — public listing */
  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  /** POST /api/v1/gallery — upload a new photo (multipart/form-data) */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
        if (!allowed.test(file.originalname)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.galleryService.create(file.filename, caption);
  }

  /** PATCH /api/v1/gallery/:id — update caption */
  @Patch(':id')
  updateCaption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('caption') caption: string,
  ) {
    return this.galleryService.updateCaption(id, caption);
  }

  /** DELETE /api/v1/gallery/:id */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.remove(id);
  }
}
