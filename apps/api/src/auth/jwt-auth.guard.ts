import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import { AccessTokenPayload } from './auth.types.js';

export type AuthenticatedRequest = Request & { user: AccessTokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('A valid access token is required.');

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          email: true,
          accountStatus: true,
          roles: { select: { role: { select: { name: true } } } },
        },
      });
      if (!user || user.accountStatus !== AccountStatus.ACTIVE) {
        throw new UnauthorizedException('Your account is no longer active.');
      }

      // Roles are resolved from the database on every protected request. This
      // makes suspensions and permission changes effective immediately instead
      // of waiting for a previously issued access token to expire.
      request.user = {
        ...payload,
        email: user.email,
        roles: user.roles.map(({ role }) => role.name),
      };
      return true;
    } catch {
      throw new UnauthorizedException('A valid access token is required.');
    }
  }
}
