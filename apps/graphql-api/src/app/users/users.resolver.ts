import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Query(() => User)
  async getUser(@Args('id') id: string) {
    return await this.userService.getUser(id);
  }
}
