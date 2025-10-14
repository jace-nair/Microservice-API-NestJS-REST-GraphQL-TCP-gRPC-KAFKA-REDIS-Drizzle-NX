import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUser(createUserDto: CreateUserDto) {
    return `User created using TCP channel in SyncScore Service. The user name is: ${createUserDto.name}`;
  }
}
