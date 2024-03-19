import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserData } from './user.model';
import { HashService } from 'src/auth/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private hash: HashService
  ) {}
  
  async createUser(dto: IUserData) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username
      }
    });
    if(user) {
      throw new ConflictException("Username already exist");
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

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: username
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

}
