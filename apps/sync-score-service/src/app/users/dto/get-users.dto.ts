// dto/get-users.dto.ts
import { IsEnum, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'role must be either admin or user' })
  role?: 'admin' | 'user';
}
