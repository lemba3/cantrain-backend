import { User as PrismaUser } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export type IUser = PrismaUser;

export type IUserData = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'is_active'>;

export type IUserDataUpdate = Omit<IUserData, 'is_active'>;

export class User implements IUserData {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}