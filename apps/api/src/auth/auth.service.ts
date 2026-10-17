import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AccessTokenPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('An account already exists for this email address.');

    const passwordHash = await hash(input.password, 12);
    const user = await this.prisma.$transaction(async (tx) => {
      const customerRole = await tx.role.upsert({
        where: { name: 'CUSTOMER' },
        update: {},
        create: { name: 'CUSTOMER', description: 'Customer portal access' },
      });

      return tx.user.create({
        data: {
          email,
          passwordHash,
          accountStatus: 'ACTIVE',
          roles: { create: { roleId: customerRole.id } },
          customer: {
            create: {
              fullName: input.fullName.trim(),
              email,
              phone: input.phone.trim(),
            },
          },
        },
        include: { roles: { include: { role: { select: { name: true } } } } },
      });
    });

    return this.createAccessToken(user.id, user.email, user.roles.map(({ role }) => role.name));
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
      include: { roles: { include: { role: { select: { name: true } } } }, customer: true },
    });
    if (!user || user.accountStatus !== 'ACTIVE' || !(await compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email address or password.');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.createAccessToken(user.id, user.email, user.roles.map(({ role }) => role.name));
  }

  private async createAccessToken(userId: string, email: string, roles: string[]) {
    const payload: AccessTokenPayload = { sub: userId, email, roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: 900,
      user: { email, roles },
    };
  }
}
