import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const contactMethods = ['EMAIL', 'PHONE', 'WHATSAPP'] as const;

export class CreateEnquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  organisationName?: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Matches(/^[+0-9()\-\s]{7,30}$/)
  phone!: string;

  @IsString()
  @Matches(/^[a-z0-9-]{2,80}$/)
  serviceSlug!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  address!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gpsAddress?: string;

  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timeWindow?: string;

  @IsOptional()
  @IsIn(contactMethods)
  preferredContactMethod?: (typeof contactMethods)[number];

  @IsBoolean()
  privacyAccepted!: boolean;
}
