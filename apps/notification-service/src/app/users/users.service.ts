import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  async createAUserNotification(createUserDto: CreateUserDto) {
    console.log(
      `User created by Notification Service using REST and REDIS: The user name is: ${createUserDto.name}`
    );
  }
  async createAUserNotificationG(createUserDto: CreateUserDto) {
    console.log(
      `User created by Notification Service using GraphQL and REDIS: The user name is: ${createUserDto.name}`
    );
  }
}
