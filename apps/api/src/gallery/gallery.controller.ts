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
import { GalleryService, getGalleryDir } from './gallery.service.js';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    try {
      const dir = getGalleryDir();
      cb(null, dir);
    } catch (err) {
      cb(err as Error, '');
    }
  },
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

  /** GET /api/v1/gallery/:id — get single photo */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.findOne(id);
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
    @Body('sortOrder') sortOrder?: string | number,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const parsedSort = sortOrder !== undefined ? parseInt(String(sortOrder), 10) : undefined;
    return this.galleryService.create(file.filename, caption, Number.isNaN(parsedSort) ? undefined : parsedSort);
  }

  /** PATCH /api/v1/gallery/:id — update photo caption / sortOrder */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('caption') caption?: string,
    @Body('sortOrder') sortOrder?: string | number,
  ) {
    const parsedSort = sortOrder !== undefined ? parseInt(String(sortOrder), 10) : undefined;
    return this.galleryService.update(id, {
      caption,
      sortOrder: Number.isNaN(parsedSort) ? undefined : parsedSort,
    });
  }

  /** DELETE /api/v1/gallery/:id */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.remove(id);
  }
}
