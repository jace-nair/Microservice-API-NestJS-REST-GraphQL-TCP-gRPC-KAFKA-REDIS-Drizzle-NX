import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUserAsyncScore(createUserDto: CreateUserDto) {
    console.log(
      `User created by ASyncScore Service using REST and KAFKA: The user name is: ${createUserDto.name}`
    );
  }

  async createAUserAsyncScoreG(createUserDto: CreateUserDto) {
    console.log(
      `User created by ASyncScore Service using GraphQL and KAFKA: The user name is: ${createUserDto.name}`
    );
  }
}
