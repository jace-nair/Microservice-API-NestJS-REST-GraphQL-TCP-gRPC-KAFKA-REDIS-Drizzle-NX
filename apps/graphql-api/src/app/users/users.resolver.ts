import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { MICROSERVICES_CLIENTS } from '../../constants';
import {
  ClientGrpcProxy,
  ClientKafka,
  ClientProxy,
  ClientRedis,
} from '@nestjs/microservices';
import { Inject, OnModuleInit, UsePipes, ValidationPipe } from '@nestjs/common';
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
@Resolver(() => User)
export class UsersResolver implements OnModuleInit {
  // Declare userService for gRPC to avoid typescipt error.
  private userService!: UserServiceClient;

  constructor(
    // Inject SYNC_SCORE_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.SYNC_SCORE_SERVICE_CLIENT)
    private readonly syncScoreServiceClient: ClientProxy,
    // Inject GSYNC_SCORE_SERVICE_CLIENT for gRPC
    @Inject(MICROSERVICES_CLIENTS.GSYNC_SCORE_SERVICE_CLIENT)
    private readonly gsyncScoreServiceClient: ClientGrpcProxy,
    // Inject ASYNC_SCORE_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.KAFKA_SERCVICE_CLIENT)
    private readonly asyncScoreServiceClient: ClientKafka,
    // Inject NOTIFICATION_SERVICE_CLIENT
    @Inject(MICROSERVICES_CLIENTS.REDIS_SERVICE_CLIENT)
    private readonly notificationServiceClient: ClientRedis,
    private readonly usersService: UsersService
  ) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Query(() => User)
  async getUser(@Args('id') id: string) {
    return await this.usersService.getUser(id);
  }

  // MUTATION. Create a user locally
  @Mutation(() => [User])
  async createAUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createAUser(createUserDto);
    return newUser;
  }

  //############ MUTATION. Create a user on sync-score-service using TCP channel #############
  @Mutation(() => User)
  async createAUserSyncScore(
    @Args('createUserDto') createUserDto: CreateUserDto
  ) {
    const newUser = this.syncScoreServiceClient.send(
      'create-user-graphql',
      createUserDto
    );
    return newUser;
  }

  //############ MUTATION. Create a user on gsync-score-service using gRPC channel #############
  //############ For gRPC channel #############
  // Initialize gRPC client service
  // This ensures the getService() call is made after the module is initialized and the gRPC client connection is ready.
  onModuleInit() {
    this.userService =
      this.gsyncScoreServiceClient.getService<UserServiceClient>(
        USER_SERVICE_NAME
      );
  }

  // MUTATATION for gRPC channel
  @Mutation(() => User)
  // GraphQL response comes directly from your gRPC call — likely a plain JavaScript object without Nest serialization.
  // UsePipes for cleaner output (GraphQL skips NestJS niceties(pipes, interceptors, DTO transformation etc.) unless explicity added).
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAUserGsyncScore(
    @Args('createUserDto', { type: () => CreateUserDto })
    createUserDto: CreateUserDto
  ) {
    // The gRPC method returns an Observable, so convert it to a Promise
    // The gRPC service returns an RxJS Observable. To use it in an async REST controller, convert it with:
    const response: UserResponse = await lastValueFrom(
      this.userService.createUser(createUserDto as UserRequest)
    );
    return response;
  }

  /*
  Example Mutation Query:
  mutation {
  createAUserGsyncScore(
    createUserDto: {
      name: "test22"
      email: "test20@email.com"
      password: "test20password"
      role: "admin"
    }
  ) {
    name
    email
    password
    role
  }
} 
  */

  //############ MUTATION. Create a user on async-score-service using KAFKA channel #############
  @Mutation(() => Boolean)
  async createAUserAsyncScore(
    @Args('createUserDto') createUserDto: CreateUserDto
  ) {
    this.asyncScoreServiceClient.emit('create-user-graphql', createUserDto);
    return true;
  }

  //############ MUTATION. Create a user on async-score-service using REDIS channel #############
  @Mutation(() => Boolean)
  async createAUserNotification(
    @Args('createUserDto') createUserDto: CreateUserDto
  ) {
    this.notificationServiceClient.emit('create-user-graphql', createUserDto);
    return true;
  }
}
