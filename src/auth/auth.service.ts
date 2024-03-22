import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '../user/dto/change-password.dto';

const TOKEN_EXPIRY = "300s";
const REFRESH_TOKEN_EXPIRY = "7d";
const EXPIRE_TIME = 300 * 1000; // when expiry is set to 300s

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hash: HashService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    // make user change password
    const backendTokens = await this.generateBackendTokens(user)
    return {
      user,
      backendTokens: backendTokens,
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findUserByEmail(dto.email);

    if(user && (await this.hash.comparePasswords(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException("username or password error");
  }

  async refreshToken(user: any) {
    const backendTokens = await this.generateBackendTokens(user);
    return backendTokens;
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.userService.changePassword(dto);
    // const backendTokens = await this.generateBackendTokens(user);
    // return {
    //   user,
    //   backendTokens: backendTokens
    // }
    return user;
  }

  async generateBackendTokens(user: any) {
    const payload = { user: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: TOKEN_EXPIRY,
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    }
  }

}
