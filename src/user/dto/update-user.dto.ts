import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IUserDataUpdate } from "../user.model";

export class UpdateUserDto implements IUserDataUpdate {
  @IsOptional()
  @IsString()
  username: string;

  // @IsOptional()
  // @IsEmail()
  // email: string;

  @IsOptional()
  @IsString()
  password: string;
}