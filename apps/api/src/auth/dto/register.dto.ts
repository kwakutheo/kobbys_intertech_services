import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Matches(/^[+0-9()\-\s]{7,30}$/)
  phone!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
