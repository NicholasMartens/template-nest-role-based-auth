import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/users.entity';

import { IAuthUser } from '../../interfaces';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<IAuthUser> {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Body() user: CreateUserDto): Promise<IAuthUser> {
    const authUser = await this.authService.register(user);
    delete authUser.user.password;
    delete authUser.user.roles;
    return authUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Get user from request with:
    // req.user
    return req.user;
  }
}
