import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern('create-user')
  async createAUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createAUser(createUserDto);
  }
}
