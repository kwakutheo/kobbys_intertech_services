import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async listRequestsForUser(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!customer) return [];

    return this.prisma.serviceRequest.findMany({
      where: { customerId: customer.id },
      select: {
        reference: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        service: { select: { name: true, slug: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
