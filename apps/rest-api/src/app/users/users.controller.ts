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
  OnModuleInit,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { GetUsersDto } from './dto';
import {
  ClientProxy,
  ClientKafka,
  ClientRedis,
  ClientGrpcProxy,
} from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../../constants';
import {
  USER_SERVICE_NAME,
  UserRequest,
  UserResponse,
  UserServiceClient,
} from '../../types/proto/users';
import { lastValueFrom } from 'rxjs';

/*
n NestJS, when you use a ClientGrpcProxy, you must wait until the module initializes to call getService() and store the service reference — you can’t call it inside the request handler every time.
*/
@UseGuards() //protect the route using AuthGuard using jwt strategy
@Controller('users') // It will handle /users route and sub-routes REST API
export class UsersController implements OnModuleInit {
  // Declare userService for gRPC to avoid typescipt error.
  private userService!: UserServiceClient;

  // Inject UserService methods into the controller
  /* This is instead of ---
     const userService = new UsersService */
  constructor(
    // Inject SYNC_SCORE_SERVICE_CLIENT for TCP
    @Inject(MICROSERVICES_CLIENTS.SYNC_SCORE_SERVICE_CLIENT)
    private readonly syncScoreServiceClient: ClientProxy,
    // Inject GSYNC_SCORE_SERVICE_CLIENT for gRPC
    @Inject(MICROSERVICES_CLIENTS.GSYNC_SCORE_SERVICE_CLIENT)
    private readonly gsyncScoreServiceClient: ClientGrpcProxy,
    // Inject ASYNC_SCORE_SERVICE_CLIENT for KAFKA
    @Inject(MICROSERVICES_CLIENTS.KAFKA_SERCVICE_CLIENT)
    private readonly asyncScoreServiceClient: ClientKafka,
    // Inject NOTIFICATION_SERVICE_CLIENT for REDIS
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

  // POST /users OR Create a user locally
  @Post()
  async createAUser(
    @Body(new ValidationPipe({ whitelist: true }))
    createUserDto: CreateUserDto
  ) {
    const newUser = this.usersService.createUser(createUserDto);
    return newUser;
  }

  //############ POST create a user on sync-score-service using TCP channel #############
  @Post('sync-score')
  async createAUserSyncScore(@Body() createUserDto: CreateUserDto) {
    const newUser = this.syncScoreServiceClient.send(
      'create-user',
      createUserDto
    );
    return newUser;
  }

  //############ For gRPC channel #############
  // Initialize gRPC client service
  // This ensures the getService() call is made after the module is initialized and the gRPC client connection is ready.
  onModuleInit() {
    this.userService =
      this.gsyncScoreServiceClient.getService<UserServiceClient>(
        USER_SERVICE_NAME
      );
  }

  // POST /users/gsync-score - Create a user via gRPC channel
  @Post('gsync-score')
  async createAUserGsyncScore(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto
  ) {
    // The gRPC method returns an Observable, so convert it to a Promise
    // The gRPC service returns an RxJS Observable. To use it in an async REST controller, convert it with:
    const response: UserResponse = await lastValueFrom(
      this.userService.createUser(createUserDto as UserRequest)
    );
    return response;
  }

  //############ POST create a user on async-score-service using KAFKA channel #############
  @Post('async-score')
  async createAUserAsyncScore(@Body() createUserDto: CreateUserDto) {
    const newUser = this.asyncScoreServiceClient.emit(
      'create-user',
      createUserDto
    );
    return newUser;
  }

  //############ POST create a user on notification-service using REDIS channel #############
  @Post('notification')
  async createAUserNotification(@Body() createUserDto: CreateUserDto) {
    const newUser = this.notificationServiceClient.emit(
      'create-user',
      createUserDto
    );
    return newUser;
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
