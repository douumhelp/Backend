import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthPFDto } from './dto/register-authPF.dto';
import { RegisterAuthPJDto } from './dto/register-authPJ.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/pf')
  async registerPF(@Body() registerAuthPFDto: RegisterAuthPFDto) {
    return this.authService.registerPF(registerAuthPFDto);
  }

  @Post('register/pj')
  async registerPJ(@Body() registerAuthPJDto: RegisterAuthPJDto) {
    return this.authService.registerPJ(registerAuthPJDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
