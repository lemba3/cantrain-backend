import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { IUserData } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post('register')
  async registerUser(@Body() dto: IUserData) {
    return await this.userService.createUser(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.authService.changePassword(dto);
  }
}
