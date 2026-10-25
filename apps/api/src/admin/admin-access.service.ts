import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountStatus, Prisma, StaffAccessTokenPurpose, User } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { STAFF_ROLES, type StaffRole } from '../auth/admin-roles.js';
import type { ChangeOwnPasswordDto, CreateStaffDto, InviteStaffDto, UpdateStaffDto } from './dto/invite-staff.dto.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_EMAIL_THROTTLE_MS = 60_000;
const RESET_EMAIL_DAILY_LIMIT = 5;
const STAFF_ROLE_NAMES = [...STAFF_ROLES];

// Staff rows are never returned whole: `passwordHash` must not leave the
// database, let alone be serialised into an API response.
const STAFF_PUBLIC_FIELDS = {
  id: true,
  email: true,
  displayName: true,
  accountStatus: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

@Injectable()
export class AdminAccessService {
  private readonly logger = new Logger(AdminAccessService.name);

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

    let user: Pick<User, 'id' | 'email' | 'displayName'>;
    try {
      user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            displayName: input.displayName.trim(),
            passwordHash: unusablePassword,
            accountStatus: AccountStatus.INVITED,
            roles: { create: { roleId: role.id } },
          },
          select: { id: true, email: true, displayName: true },
        });
        await tx.staffAccessToken.create({
          data: { userId: created.id, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.INVITATION, expiresAt },
        });
        await this.audit(tx, actorUserId, 'STAFF_INVITED', 'User', created.id, { email, role: input.role });
        return created;
      });
    } catch (error) {
      // Two concurrent invites can both pass the pre-check; the unique index on
      // email is the real guard, and the rolled-back transaction leaves no token.
      throw this.translateEmailConflict(error);
    }

    const activationUrl = this.tokenUrl('/admin/activate', rawToken);
    // The activation link is the only way the invitee can reach the account, so
    // an undeliverable one must be reported loudly - and retired, so no stray
    // link outlives the invitation the owner is being told to redo.
    const sent = await this.notificationsService.sendStaffInvitationEmail(email, activationUrl);
    if (!sent) {
      await this.prisma.staffAccessToken.update({ where: { tokenHash: tokenHash(rawToken) }, data: { consumedAt: new Date() } });
      throw new BadRequestException(`${email} was added as staff, but the activation email could not be sent. Fix the mail configuration, then use "Reset password" on this account to issue a fresh activation link.`);
    }

    return { user, emailSent: true };
  }

  async createStaff(actorUserId: string, input: CreateStaffDto) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account already exists for this email address.');

    const role = await this.assignableStaffRole(input.role);
    const passwordHash = await hash(input.password, 12);
    let user: Pick<User, 'id' | 'email' | 'displayName'>;
    try {
      user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            displayName: input.displayName.trim(),
            passwordHash,
            accountStatus: AccountStatus.ACTIVE,
            emailVerifiedAt: new Date(),
            roles: { create: { roleId: role.id } },
          },
          select: { id: true, email: true, displayName: true },
        });
        await this.audit(tx, actorUserId, 'STAFF_ACCOUNT_CREATED', 'User', created.id, { email, role: input.role });
        return created;
      });
    } catch (error) {
      // Two concurrent requests can both pass the pre-check above; the unique
      // index on email is the real guard, so translate its violation.
      throw this.translateEmailConflict(error);
    }

    return user;
  }

  async updateStaff(actorUserId: string, userId: string, input: UpdateStaffDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('Staff account not found.');
    if (!user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) throw new BadRequestException('This account is not a staff account.');

    // An owner may rename themselves, but never change their own role or put
    // their own account out of service - that is how every admin surface ends up
    // locked with nobody left holding the key.
    const cuttingOwnAccess = input.accountStatus !== undefined && input.accountStatus !== AccountStatus.ACTIVE;
    if (userId === actorUserId && (input.role !== undefined || cuttingOwnAccess)) {
      throw new BadRequestException(cuttingOwnAccess
        ? 'You cannot suspend or deactivate your own account.'
        : 'You cannot change your own role. Ask another Owner to do it so your access cannot be cut off accidentally.');
    }

    const existingRole = user.roles.find(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))?.role.name as StaffRole | undefined;
    if (input.role !== undefined && input.role !== existingRole) {
      this.assertKnownStaffRole(input.role);
      // OWNER is the highest privilege and may only be handed to an account that
      // is already inside the staff hierarchy - `role` is not part of the public
      // vocabulary (every staff row also carries CUSTOMER), so relying on the
      // held roles is what keeps a customer from being crowned by accident.
      if (input.role === 'OWNER' && !existingRole) {
        throw new BadRequestException('The Owner role can only be given to an existing staff account.');
      }
    }
    const losingOwnership = existingRole === 'OWNER' && ((input.role !== undefined && input.role !== 'OWNER') || (input.accountStatus !== undefined && input.accountStatus !== AccountStatus.ACTIVE));
    if (losingOwnership) {
      // A surviving owner must be able to sign in to use the privileges being
      // withdrawn; an owner still holding an unconsumed invitation link is only
      // an acceptable fallback while the account itself is being suspended.
      const demoting = input.role !== undefined && input.role !== 'OWNER';
      await this.ensureAnotherOwner(user.id, demoting ? 'usable' : 'reachable');
    }
    // Resolving the role before the write means an invalid promotion never
    // leaves a half-applied update behind.
    const promotedRole = input.role && input.role !== existingRole ? await this.getRole(input.role) : undefined;

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (promotedRole && input.role) {
          await tx.userRole.deleteMany({ where: { userId, role: { name: { in: STAFF_ROLE_NAMES } } } });
          await tx.userRole.create({ data: { userId, roleId: promotedRole.id } });
        }
        const result = await tx.user.update({
          where: { id: userId },
          data: {
            ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
            ...(input.accountStatus ? { accountStatus: input.accountStatus as AccountStatus } : {}),
          },
          select: STAFF_PUBLIC_FIELDS,
        });
        await this.audit(tx, actorUserId, 'STAFF_UPDATED', 'User', userId, input as Prisma.InputJsonValue);
        return result;
      });
    } catch (error) {
      throw this.translateEmailConflict(error);
    }
  }

  async removeStaff(actorUserId: string, userId: string) {
    if (userId === actorUserId) {
      throw new BadRequestException('You cannot remove your own account.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('Staff account not found.');
    if (!user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) {
      throw new BadRequestException('This account is not a staff account.');
    }

    // If the target is an owner, ensure another usable owner remains.
    const isOwner = user.roles.some(({ role }) => role.name === 'OWNER');
    if (isOwner) {
      await this.ensureAnotherOwner(userId, 'usable');
    }

    await this.prisma.$transaction(async (tx) => {
      // Strip all staff roles so the account disappears from the team list.
      await tx.userRole.deleteMany({ where: { userId, role: { name: { in: STAFF_ROLE_NAMES } } } });
      // Deactivate so any outstanding JWT is rejected by the auth guard.
      await tx.user.update({ where: { id: userId }, data: { accountStatus: AccountStatus.DEACTIVATED } });
      // Invalidate every unredeemed invitation or reset token.
      await tx.staffAccessToken.updateMany({ where: { userId, consumedAt: null }, data: { consumedAt: new Date() } });
      await this.audit(tx, actorUserId, 'STAFF_REMOVED', 'User', userId, { email: user.email });
    });

    return { success: true };
  }

  async createPasswordReset(actorUserId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
    if (!user || !user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) throw new NotFoundException('Staff account not found.');
    // Active accounts use this to reset a forgotten password; invited ones use
    // it to recover an activation email that never arrived. Suspended and
    // deactivated accounts must be restored explicitly, not handed a link.
    if (user.accountStatus !== AccountStatus.ACTIVE && user.accountStatus !== AccountStatus.INVITED) {
      throw new BadRequestException('Only active or invited staff accounts can be sent an access link.');
    }

    const rawToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    await this.prisma.$transaction(async (tx) => {
      await tx.staffAccessToken.updateMany({ where: { userId, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, consumedAt: null }, data: { consumedAt: new Date() } });
      await tx.staffAccessToken.create({ data: { userId, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.PASSWORD_RESET, expiresAt } });
      await this.audit(tx, actorUserId, 'STAFF_PASSWORD_RESET_ISSUED', 'User', userId);
    });

    const resetUrl = this.tokenUrl('/admin/activate', rawToken);
    // The owner cannot hand over a link the staff member never received, and
    // the previous link is already consumed - so deliver it or fail loudly.
    const sent = await this.notificationsService.sendStaffPasswordResetEmail(user.email, resetUrl);
    if (!sent) {
      await this.prisma.staffAccessToken.update({ where: { tokenHash: tokenHash(rawToken) }, data: { consumedAt: new Date() } });
      throw new BadRequestException(`${user.email} was prepared for a password reset, but the reset email could not be sent. Check that RESEND_API_KEY is configured, then try again.`);
    }

    return { emailSent: true, recipient: user.email };
  }

  async requestPasswordReset(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } });
    const genericResponse = { success: true, message: 'If an active staff account matches that email address, a password-reset link will be sent shortly.' };
    if (!user || user.accountStatus !== AccountStatus.ACTIVE || !user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) return genericResponse;

    // Rate limits bind the account, not the caller: an attacker guessing other
    // people's emails must not be able to reset them for free, and a real user
    // on a shared network keeps their own allowance.
    const windowStart = new Date(Date.now() - RESET_EMAIL_THROTTLE_MS);
    const recentIssued = await this.prisma.staffAccessToken.count({
      where: { userId: user.id, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, createdAt: { gte: windowStart } },
    });
    if (recentIssued > 0) return genericResponse;

    const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyIssued = await this.prisma.auditLog.count({
      where: { actorUserId: user.id, action: 'STAFF_PASSWORD_RESET_REQUESTED', createdAt: { gte: dayStart } },
    });
    if (dailyIssued >= RESET_EMAIL_DAILY_LIMIT) return genericResponse;

    const rawToken = randomBytes(32).toString('base64url');
    const resetUrl = this.tokenUrl('/admin/activate', rawToken);
    const accessToken = await this.prisma.$transaction(async (tx) => {
      await tx.staffAccessToken.updateMany({ where: { userId: user.id, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, consumedAt: null }, data: { consumedAt: new Date() } });
      const created = await tx.staffAccessToken.create({ data: { userId: user.id, tokenHash: tokenHash(rawToken), purpose: StaffAccessTokenPurpose.PASSWORD_RESET, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) } });
      await this.audit(tx, user.id, 'STAFF_PASSWORD_RESET_REQUESTED', 'User', user.id);
      return created;
    });

    const sent = await this.notificationsService.sendStaffPasswordResetEmail(user.email, resetUrl);
    if (!sent) {
      await this.prisma.staffAccessToken.update({ where: { id: accessToken.id }, data: { consumedAt: new Date() } });
      // The caller always receives the same generic reply, so a broken mail
      // configuration has to be visible somewhere other than the request.
      this.logger.error(`Password-reset link for ${user.email} could not be emailed. Check RESEND_API_KEY and the sender domain.`);
    }
    return genericResponse;
  }

  async setPassword(token: string, password: string) {
    const record = await this.prisma.staffAccessToken.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: { select: { accountStatus: true } } } });
    if (!record || record.consumedAt || record.expiresAt <= new Date()) throw new BadRequestException('This access link is invalid or has expired.');
    // Only an invited or already-active account may set a password. Without
    // this check a stale invitation link would quietly reopen a suspended or
    // deactivated account.
    if (record.user.accountStatus !== AccountStatus.ACTIVE && record.user.accountStatus !== AccountStatus.INVITED) {
      throw new BadRequestException('This account is not available.');
    }

    const passwordHash = await hash(password, 12);
    const consumed = await this.prisma.$transaction(async (tx) => {
      // Consume first and claim the token atomically, so two submissions of the
      // same link cannot both get through.
      const claimed = await tx.staffAccessToken.updateMany({
        where: { id: record.id, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      if (claimed.count !== 1) return false;
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash, accountStatus: AccountStatus.ACTIVE, emailVerifiedAt: new Date() },
      });
      await tx.staffAccessToken.updateMany({ where: { userId: record.userId, purpose: StaffAccessTokenPurpose.PASSWORD_RESET, consumedAt: null }, data: { consumedAt: new Date() } });
      await this.audit(tx, record.userId, record.purpose === StaffAccessTokenPurpose.INVITATION ? 'STAFF_INVITATION_ACCEPTED' : 'STAFF_PASSWORD_RESET_COMPLETED', 'User', record.userId);
      return true;
    });
    if (!consumed) throw new BadRequestException('This access link has already been used. Request a new one.');
    return { success: true };
  }

  async changeOwnPassword(userId: string, input: ChangeOwnPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
    if (!user || user.accountStatus !== AccountStatus.ACTIVE || !user.roles.some(({ role }) => STAFF_ROLE_NAMES.includes(role.name as StaffRole))) {
      throw new NotFoundException('Active staff account not found.');
    }
    if (!(await compare(input.currentPassword, user.passwordHash))) throw new BadRequestException('Your current password is incorrect.');
    if (await compare(input.newPassword, user.passwordHash)) throw new BadRequestException('Choose a password that differs from your current password.');

    const newPasswordHash = await hash(input.newPassword, 12);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { passwordHash: newPasswordHash } });
      // Changing the password is often a response to a suspected leak, so every
      // outstanding invitation or reset link for this account is revoked too.
      await tx.staffAccessToken.updateMany({ where: { userId, consumedAt: null }, data: { consumedAt: new Date() } });
      await this.audit(tx, userId, 'STAFF_PASSWORD_CHANGED', 'User', userId);
    });
    return { success: true };
  }

  /**
   * The `email` column is the real guard against duplicate accounts. Surface an
   * index violation as the same 409 the pre-check returns, instead of a 500.
   */
  private translateEmailConflict(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new ConflictException('An account already exists for this email address.');
    }
    return error;
  }

  /**
   * OWNER is the highest privilege in the system, so it is never granted while
   * an account is created - only handed over between existing staff accounts.
   */
  private async assignableStaffRole(name: string) {
    this.assertKnownStaffRole(name);
    if (name === 'OWNER') {
      throw new BadRequestException('The Owner role cannot be assigned here. Promote an existing staff account instead.');
    }
    return this.getRole(name);
  }

  /**
   * `role` is not part of the public vocabulary, so an unknown name must be
   * rejected rather than quietly upserted into a brand-new role.
   */
  private assertKnownStaffRole(name: string) {
    if (!STAFF_ROLE_NAMES.includes(name as StaffRole)) {
      throw new BadRequestException(`Unknown staff role "${name}". Nothing was changed.`);
    }
  }

  /**
   * `usable` - at least one other owner who can sign in right now (required when
   * ownership itself is being taken away). `reachable` - at least one other owner
   * who could be sent a fresh access link (enough when an account is merely being
   * suspended, since un-suspending it is one click away).
   */
  private async ensureAnotherOwner(excludingUserId: string, requirement: 'usable' | 'reachable') {
    const owners = await this.prisma.user.count({
      where: {
        id: { not: excludingUserId },
        accountStatus: requirement === 'usable' ? AccountStatus.ACTIVE : { in: [AccountStatus.ACTIVE, AccountStatus.INVITED] },
        roles: { some: { role: { name: 'OWNER' } } },
      },
    });
    if (!owners) {
      throw new BadRequestException(requirement === 'usable'
        ? 'You cannot remove the Owner role from the last account able to sign in as Owner.'
        : 'You cannot suspend the last Owner account.');
    }
  }

  private async getRole(name: string, client: PrismaService | Prisma.TransactionClient = this.prisma) {
    return client.role.upsert({ where: { name }, update: {}, create: { name, description: `${name.replace(/_/g, ' ')} staff access` } });
  }

  private async audit(client: PrismaService | Prisma.TransactionClient, actorUserId: string, action: string, entityType: string, entityId: string, metadata?: Prisma.InputJsonValue) {
    return client.auditLog.create({ data: { actorUserId, action, entityType, entityId, ...(metadata !== undefined ? { metadata } : {}) } });
  }

  private tokenUrl(path: string, token: string) {
    const configuredUrl = process.env.ADMIN_APP_URL || process.env.WEB_URL || 'http://localhost:3000';
    let baseUrl = configuredUrl.replace(/\/$/, '');
    try {
      const url = new URL(configuredUrl);
      // ADMIN_APP_URL is the site origin. Tolerate the common accidental
      // `/admin` suffix so reset links cannot become `/admin/admin/activate`.
      url.pathname = url.pathname.replace(/\/admin\/?$/, '') || '/';
      url.search = '';
      url.hash = '';
      baseUrl = url.toString().replace(/\/$/, '');
    } catch {
      // Keep the configured value for local/non-standard development URLs.
    }
    return `${baseUrl}${path}?token=${encodeURIComponent(token)}`;
  }
}
