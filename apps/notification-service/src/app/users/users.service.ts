import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUserNotification(createUserDto: CreateUserDto) {
    console.log(
      `User created by Notification Service using REDIS: The user name is: ${createUserDto.name}`
    );
  }
}
