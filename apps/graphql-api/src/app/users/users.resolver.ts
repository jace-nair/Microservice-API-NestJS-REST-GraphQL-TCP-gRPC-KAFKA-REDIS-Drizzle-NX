import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { MICROSERVICES_CLIENTS } from '../../constants';
import { ClientKafka, ClientProxy, ClientRedis } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
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
    private readonly userService: UsersService
  ) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Query(() => User)
  async getUser(@Args('id') id: string) {
    return await this.userService.getUser(id);
  }

  // MUTATION. Create a user locally
  @Mutation(() => [User])
  async createAUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    const newUser = await this.userService.createAUser(createUserDto);
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
