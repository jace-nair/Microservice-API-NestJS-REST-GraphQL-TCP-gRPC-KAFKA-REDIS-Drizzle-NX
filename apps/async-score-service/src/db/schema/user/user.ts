import {
  integer,
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  json,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { post } from '..';
export const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum('userRoles', userRoles);
// Schema Table
export const user = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull().default('no name'),
    age: integer('age').notNull().default(18),
    email: varchar('email', { length: 255 }).notNull().unique(),
    image: text('image'),
    password: varchar('password', { length: 255 }).notNull(),
    refreshToken: varchar('refresh_token', { length: 255 }),
    role: text('role').notNull().default('user'),
    address: json('address'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('user_email_idx').on(table.email)],
);

// Schema Relations
export const userRelations = relations(user, ({ many }) => ({
  post: many(post),
}));
