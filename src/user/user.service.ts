import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserData } from './user.model';
import { HashService } from 'src/auth/hash/hash.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private hash: HashService
  ) {}
  
  async createUser(dto: IUserData) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if(user) {
      throw new ConflictException("Email already exist");
    }
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await this.hash.hashPassword(dto.password)
      }
    });
    const { password, ...result} = newUser;
    return result;
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
  }

  async findUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
  }

  async changePassword(dto: ChangePasswordDto) {
    const updatedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        password: await this.hash.hashPassword(dto.password),
        req_pass_change: false
      },
    });
    const { password, ...result} = updatedUser;
    return result;
  }

}
