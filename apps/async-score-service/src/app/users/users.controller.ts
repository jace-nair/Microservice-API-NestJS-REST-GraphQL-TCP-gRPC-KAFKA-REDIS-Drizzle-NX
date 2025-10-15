import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @EventPattern('create-user')
  async createAUserAsyncScore(@Body() createUserDto: CreateUserDto) {
    this.userService.createAUserAsyncScore(createUserDto);
  }

  @EventPattern('create-user-graphql')
  async createAUserAsyncScoreG(@Body() createUserDto: CreateUserDto) {
    this.userService.createAUserAsyncScoreG(createUserDto);
  }
}
