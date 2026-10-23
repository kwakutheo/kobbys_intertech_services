import { Injectable, OnModuleInit } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service.js';
import { STAFF_ROLES } from '../auth/admin-roles.js';

@Injectable()
export class AdminBootstrapService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await Promise.all(
      STAFF_ROLES.map((name) => this.prisma.role.upsert({ where: { name }, update: {}, create: { name, description: `${name.replace(/_/g, ' ')} staff access` } })),
    );

    const email = process.env.INITIAL_OWNER_EMAIL?.trim().toLowerCase();
    const password = process.env.INITIAL_OWNER_PASSWORD;
    if (!email || !password) return;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return;

    const ownerRole = await this.prisma.role.findUniqueOrThrow({ where: { name: 'OWNER' } });
    await this.prisma.user.create({
      data: {
        email,
        displayName: process.env.INITIAL_OWNER_NAME?.trim() || 'Account Owner',
        passwordHash: await hash(password, 12),
        accountStatus: 'ACTIVE',
        emailVerifiedAt: new Date(),
        roles: { create: { roleId: ownerRole.id } },
      },
    });
  }
}
