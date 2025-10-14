import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  name?: string;
  @IsEmail()
  email?: string;
  @IsString()
  @IsNotEmpty()
  password?: string;
  @IsEnum(['admin', 'user'], {
    message: 'valid role required',
  })
  role?: 'admin' | 'user';
}
