import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { GetUsersDto } from './dto';
import { ClientProxy, ClientKafka, ClientRedis } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../../constants';

@UseGuards() //protect the route using AuthGuard using jwt strategy
@Controller('users') // It will handle /users route and sub-routes REST API
export class UsersController {
  // Inject UserService methods into the controller
  /* This is instead of ---
     const userService = new UsersService */
  constructor(
    // Inject SYNC_SCORE_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.SYNC_SCORE_SERVICE_CLIENT)
    private readonly syncScoreServiceClient: ClientProxy,
    // Inject ASYNC_SCORE_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.KAFKA_SERCVICE_CLIENT)
    private readonly asyncScoreServiceClient: ClientKafka,
    // Inject NOTIFICATION_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.REDIS_SERVICE_CLIENT)
    private readonly notificationServiceClient: ClientRedis,
    private readonly usersService: UsersService
  ) {}

  // Different route handler methods
  // GET /users
  /*@Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }*/

  // GET /users/admin- sub-route - Static route
  //@UseGuards(JwtGuard) //protect the route using AuthGuard using jwt strategy
  @Get('admin')
  getAdmin() {
    return [];
  }

  // GET /users/?role=value&age=value - Query parameter static route
  // GET /users/?role=admin - Get all users whose role is admin as optional query parameter - Static route
  @Get()
  async getAllAdminUsersWithQuery(@Query() query: GetUsersDto) {
    return this.usersService.getAllUsersWithQuery(query.role);
  }

  // GET /users/:id - Dynamic route
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // POST /users OR Create a user
  @Post()
  async createAUser(
    @Body(new ValidationPipe({ whitelist: true }))
    createUserDto: CreateUserDto
  ) {
    return this.usersService.createUser(createUserDto);
  }

  //############ POST create a user on sync-score-service using TCP channel #############
  @Post('sync-score')
  async createAUserSyncScore(@Body() createUserDto: CreateUserDto) {
    return this.syncScoreServiceClient.send('create-user', createUserDto);
  }

  //############ POST create a user on async-score-service using KAFKA channel #############
  @Post('async-score')
  async createAUserAsyncScore(@Body() createUserDto: CreateUserDto) {
    return this.asyncScoreServiceClient.emit('create-user', createUserDto);
  }

  //############ POST create a user on notification-service using REDIS channel #############
  @Post('notification')
  async createAUserNotification(@Body() createUserDto: CreateUserDto) {
    return this.notificationServiceClient.emit('create-user', createUserDto);
  }

  // PATCH /users/:id
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // DELETE /users/:id
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
