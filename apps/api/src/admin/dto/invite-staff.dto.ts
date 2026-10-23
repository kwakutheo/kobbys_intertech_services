import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { STAFF_ROLES } from '../../auth/admin-roles.js';

export class InviteStaffDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName!: string;

  @IsIn(STAFF_ROLES.filter((role) => role !== 'OWNER'))
  role!: Exclude<(typeof STAFF_ROLES)[number], 'OWNER'>;
}

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsIn(STAFF_ROLES)
  role?: (typeof STAFF_ROLES)[number];

  @IsOptional()
  @IsIn(['ACTIVE', 'SUSPENDED', 'DEACTIVATED'])
  accountStatus?: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
}

export class SetStaffPasswordDto {
  @IsString()
  @MinLength(32)
  @MaxLength(256)
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class ForgotStaffPasswordDto {
  @IsEmail()
  email!: string;
}
