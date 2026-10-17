import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  listActiveServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, name: true, description: true },
      orderBy: { displayOrder: 'asc' },
    });
  }
}
