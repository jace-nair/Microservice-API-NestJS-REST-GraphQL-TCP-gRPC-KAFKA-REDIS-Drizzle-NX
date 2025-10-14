import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUserAsyncScore(createUserDto: CreateUserDto) {
    console.log(
      `User created by ASyncScore Service using KAFKA: The user name is: ${createUserDto.name}`
    );
  }
}
