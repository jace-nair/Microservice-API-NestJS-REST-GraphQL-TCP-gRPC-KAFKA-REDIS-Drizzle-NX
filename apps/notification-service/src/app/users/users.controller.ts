import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @EventPattern('create-user')
  async createAUserNotification(@Body() createUserDto: CreateUserDto) {
    this.userService.createAUserNotification(createUserDto);
  }

  @EventPattern('create-user-graphql')
  async createAUserNotificationG(@Body() createUserDto: CreateUserDto) {
    this.userService.createAUserNotificationG(createUserDto);
  }
}
