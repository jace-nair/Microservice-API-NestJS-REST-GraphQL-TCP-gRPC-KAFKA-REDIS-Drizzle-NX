import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersService {
  async getUsers() {
    return [
      {
        name: 'test1',
        email: 'test1@email.com',
        password: 'test1password',
        role: 'admin',
      },
      {
        name: 'test2',
        email: 'test2@email.com',
        password: 'test2password',
        role: 'user',
      },
    ];
  }

  async getUser(id: string) {
    return [
      {
        name: 'test1',
        email: 'test1@email.com',
        password: 'test1password',
        role: 'admin',
      },
    ];
  }
}
