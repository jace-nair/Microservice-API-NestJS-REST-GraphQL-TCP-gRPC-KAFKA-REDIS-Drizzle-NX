import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
@Injectable()
export class UsersService {
  async getUsers() {
    return [
      {
        name: 'test1',
        email: 'test1@email.com',
        password: 'test1password',
        role: 'admin',
      },
      {
        name: 'test2',
        email: 'test2@email.com',
        password: 'test2password',
        role: 'user',
      },
    ];
  }

  async getUser(userId: string) {
    return [
      {
        id: userId,
        name: 'test1',
        email: 'test1@email.com',
        password: 'test1password',
        role: 'admin',
      },
    ];
  }

  async createAUser(createUserDto: CreateUserDto) {
    return [
      {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.name,
        role: createUserDto.role,
      },
    ];
  }
}
