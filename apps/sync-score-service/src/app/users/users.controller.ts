import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern('create-user')
  async createAUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createAUser(createUserDto);
    return newUser;
  }

  @MessagePattern('create-user-graphql')
  async createAUserG(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createAUserG(createUserDto);
    return newUser;
  }
}
