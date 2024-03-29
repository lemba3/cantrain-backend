import { User as PrismaUser } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export type IUser = PrismaUser;

export type IUserData = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'is_active' | 'req_pass_change'>;

export type IUserDataUpdate = Omit<IUserData, 'is_active'>;

export class User implements IUserData {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}