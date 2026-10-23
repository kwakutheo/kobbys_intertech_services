import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, Prisma, StaffAccessTokenPurpose } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { STAFF_ROLES, type StaffRole } from '../auth/admin-roles.js';
import type { InviteStaffDto, UpdateStaffDto } from './dto/invite-staff.dto.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const STAFF_ROLE_NAMES = [...STAFF_ROLES];

const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

@Injectable()
export class AdminAccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async listStaff() {
    const users = await this.prisma.user.findMany({
      where: { roles: { some: { role: { name: { in: STAFF_ROLE_NAMES } } } } },
      select: {
        id: true,
        email: true,
        displayName: true,
        accountStatus: true,
        lastLoginAt: true,
        createdAt: true,
        roles: { select: { role: { select: { name: true } } } },
      },
      orderBy: [{ accountStatus: 'asc' }, { createdAt: 'desc' }],
    });
    return users.map((user) => ({ ...user, roles: user.roles.map(({ role }) => role.name) }));
  }

  async inviteStaff(actorUserId: string, input: InviteStaffDto) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account already exists for this email address.');

    const role = await this.getRole(input.role);
    const rawToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    const unusablePassword = await hash(randomBytes(32).toString('base64url'), 12);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          displayName: input.displayName.trim(),
          passwordHash: unusablePassword,
          accountStatus: AccountStatus.INVITED,
          roles: { create: { roleId: role.id } },
        },
      });
      await tx.staffAccessToken.create({
        data: { userId: created.id, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.INVITATION, expiresAt },
      });
      await this.audit(tx, actorUserId, 'STAFF_INVITED', 'User', created.id, { email, role: input.role });
      return created;
    });

    return { user: { id: user.id, email: user.email, displayName: user.displayName }, activationUrl: this.tokenUrl('/admin/activate', rawToken) };
  }

  async updateStaff(actorUserId: string, userId: string, input: UpdateStaffDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('Staff account not found.');
    if (!user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) throw new BadRequestException('This account is not a staff account.');

    const existingRole = user.roles.find(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))?.role.name as StaffRole | undefined;
    if (input.role && input.role !== existingRole && existingRole === 'OWNER') await this.ensureAnotherOwner(user.id);
    if (input.accountStatus && input.accountStatus !== 'ACTIVE' && existingRole === 'OWNER') await this.ensureAnotherOwner(user.id);

    const updated = await this.prisma.$transaction(async (tx) => {
      if (input.role && input.role !== existingRole) {
        const role = await this.getRole(input.role, tx);
        await tx.userRole.deleteMany({ where: { userId, role: { name: { in: STAFF_ROLE_NAMES } } } });
        await tx.userRole.create({ data: { userId, roleId: role.id } });
      }
      const result = await tx.user.update({
        where: { id: userId },
        data: {
          ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
          ...(input.accountStatus ? { accountStatus: input.accountStatus as AccountStatus } : {}),
        },
      });
      await this.audit(tx, actorUserId, 'STAFF_UPDATED', 'User', userId, input as Prisma.InputJsonValue);
      return result;
    });
    return updated;
  }

  async createPasswordReset(actorUserId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
    if (!user || !user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) throw new NotFoundException('Staff account not found.');
    if (user.accountStatus !== AccountStatus.ACTIVE) throw new BadRequestException('Only active staff accounts can reset a password.');

    const rawToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    await this.prisma.$transaction(async (tx) => {
      await tx.staffAccessToken.updateMany({ where: { userId, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, consumedAt: null }, data: { consumedAt: new Date() } });
      await tx.staffAccessToken.create({ data: { userId, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.PASSWORD_RESET, expiresAt } });
      await this.audit(tx, actorUserId, 'STAFF_PASSWORD_RESET_ISSUED', 'User', userId);
    });
    return { resetUrl: this.tokenUrl('/admin/activate', rawToken) };
  }

  async requestPasswordReset(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } });
    const genericResponse = { success: true, message: 'If an active staff account matches that email address, a password-reset link will be sent shortly.' };
    if (!user || user.accountStatus !== AccountStatus.ACTIVE || !user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) return genericResponse;

    const throttled = await this.prisma.staffAccessToken.findFirst({
      where: { userId: user.id, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, createdAt: { gte: new Date(Date.now() - 60_000) } },
    });
    if (throttled) return genericResponse;

    const rawToken = randomBytes(32).toString('base64url');
    const resetUrl = this.tokenUrl('/admin/activate', rawToken);
    const sent = await this.notificationsService.sendStaffPasswordResetEmail(user.email, resetUrl);
    if (!sent) return genericResponse;

    await this.prisma.$transaction(async (tx) => {
      await tx.staffAccessToken.updateMany({ where: { userId: user.id, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, consumedAt: null }, data: { consumedAt: new Date() } });
      await tx.staffAccessToken.create({ data: { userId: user.id, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.PASSWORD_RESET, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) } });
      await this.audit(tx, user.id, 'STAFF_PASSWORD_RESET_REQUESTED', 'User', user.id);
    });
    return genericResponse;
  }

  async setPassword(token: string, password: string) {
    const record = await this.prisma.staffAccessToken.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } });
    if (!record || record.consumedAt || record.expiresAt <= new Date()) throw new BadRequestException('This access link is invalid or has expired.');
    if (record.user.accountStatus === AccountStatus.SUSPENDED || record.user.accountStatus === AccountStatus.DEACTIVATED) throw new BadRequestException('This account is not available.');

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: record.userId }, data: { passwordHash: await hash(password, 12), accountStatus: AccountStatus.ACTIVE, emailVerifiedAt: new Date() } });
      await tx.staffAccessToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
      await this.audit(tx, record.userId, record.purpose === StaffAccessTokenPurpose.INVITATION ? 'STAFF_INVITATION_ACCEPTED' : 'STAFF_PASSWORD_RESET_COMPLETED', 'User', record.userId);
    });
    return { success: true };
  }

  private async ensureAnotherOwner(excludingUserId: string) {
    const owners = await this.prisma.user.count({ where: { id: { not: excludingUserId }, accountStatus: AccountStatus.ACTIVE, roles: { some: { role: { name: 'OWNER' } } } } });
    if (!owners) throw new BadRequestException('You cannot remove or suspend the last active Owner account.');
  }

  private async getRole(name: string, client: PrismaService | Prisma.TransactionClient = this.prisma) {
    return client.role.upsert({ where: { name }, update: {}, create: { name, description: `${name.replace(/_/g, ' ')} staff access` } });
  }

  private async audit(client: PrismaService | Prisma.TransactionClient, actorUserId: string, action: string, entityType: string, entityId: string, metadata?: Prisma.InputJsonValue) {
    return client.auditLog.create({ data: { actorUserId, action, entityType, entityId, ...(metadata !== undefined ? { metadata } : {}) } });
  }

  private tokenUrl(path: string, token: string) {
    const baseUrl = (process.env.ADMIN_APP_URL || process.env.WEB_URL || 'http://localhost:3000').replace(/\/$/, '');
    return `${baseUrl}${path}?token=${encodeURIComponent(token)}`;
  }
}
