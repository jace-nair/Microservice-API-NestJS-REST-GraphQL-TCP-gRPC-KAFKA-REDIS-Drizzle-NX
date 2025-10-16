import { Injectable } from '@nestjs/common';
import { UserRequest, UserResponse } from '../../types/proto/users';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  createUser(
    request: UserRequest
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse {
    return {
      name: request.name,
      email: request.email,
      password: request.password,
      role: request.role,
    };
  }
}
