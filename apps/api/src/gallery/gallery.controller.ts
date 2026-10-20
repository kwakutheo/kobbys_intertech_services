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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GalleryService } from './gallery.service.js';

const storage = memoryStorage();

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  /** GET /api/v1/gallery — public listing (optional ?category= filter) */
  @Get()
  findAll(@Query('category') category?: string) {
    return this.galleryService.findAll(category);
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
      limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif|avif|heic|heif)$/i;
        if (!allowed.test(file.originalname) && !file.mimetype?.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed (JPG, PNG, WebP, GIF, AVIF, HEIC)'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
    @Body('sortOrder') sortOrder?: string | number,
    @Body('category') category?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const parsedSort = sortOrder !== undefined ? parseInt(String(sortOrder), 10) : undefined;
    return this.galleryService.create(
      file.buffer,
      file.originalname,
      file.mimetype,
      caption,
      Number.isNaN(parsedSort) ? undefined : parsedSort,
      category || undefined,
    );
  }

  /** PATCH /api/v1/gallery/:id — update photo caption / sortOrder / category */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('caption') caption?: string,
    @Body('sortOrder') sortOrder?: string | number,
    @Body('category') category?: string,
  ) {
    const parsedSort = sortOrder !== undefined ? parseInt(String(sortOrder), 10) : undefined;
    return this.galleryService.update(id, {
      caption,
      sortOrder: Number.isNaN(parsedSort) ? undefined : parsedSort,
      category: category !== undefined ? (category || null) : undefined,
    });
  }

  /** DELETE /api/v1/gallery/:id */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.galleryService.remove(id);
  }
}
