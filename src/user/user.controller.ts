import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(id);
  }

  @Put('/update-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.userService.changePassword(dto);
  }
}
