import { Controller } from '@nestjs/common';
import {
  UserRequest,
  UserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '../../types/proto/users';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Controller('users')
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}
  createUser(
    request: UserRequest
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse {
    return this.usersService.createUser(request);
  }
}
