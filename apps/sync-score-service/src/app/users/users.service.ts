import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUser(createUserDto: CreateUserDto) {
    return {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
    };
  }

  async createAUserG(createUserDto: CreateUserDto) {
    return {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
    };
  }
}
