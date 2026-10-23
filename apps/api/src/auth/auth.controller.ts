import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { throttleByIdentity } from './throttle-trackers.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 15 * 60_000, getTracker: throttleByIdentity } })
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000, getTracker: throttleByIdentity } })
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }
}
