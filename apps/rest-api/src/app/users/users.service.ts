import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../drizzle/drizzle';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}
  async getAllUsers() {
    const dbUsers = await this.db.select().from(schema.user);
    return dbUsers;
  }

  // Get all admin users with query parameter
  async getAllUsersWithQuery(role?: 'admin' | 'user') {
    if (role) {
      const dbUser = await this.db
        .select()
        .from(schema.user)
        .where(eq(schema.user.role, role));
      if (dbUser.length === 0)
        throw new NotFoundException(`User with ${role} role not found`);
      return dbUser[0];
    }
    return this.getAllUsers();
  }

  // Get a user by id
  async getUserById(id: string) {
    const dbUser = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, id));
    if (!dbUser[0]) throw new NotFoundException('User Not Found');
    return dbUser[0];
  }

  // Create a user
  async createUser(createUserDto: CreateUserDto) {
    const dbUser = await this.db
      .insert(schema.user)
      .values({ ...createUserDto });
    return dbUser;
  }

  // Update a user
  async updateUser(id: string, { name, email, password, role }: UpdateUserDto) {
    return await this.db
      .update(schema.user)
      .set({
        name: name,
        email: email,
        password: password,
        role: role,
      })
      .where(eq(schema.user.id, id));
  }

  // Delete a user-----YES-----
  async deleteUser(id: string) {
    await this.db.delete(schema.user).where(eq(schema.user.id, id));
  }
}
