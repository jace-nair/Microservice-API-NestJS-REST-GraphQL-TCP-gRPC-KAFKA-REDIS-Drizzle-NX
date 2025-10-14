import {
  pgEnum,
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from '..';
export const postStatusEnum = pgEnum('status', [
  'draft',
  'archived',
  'published',
]);
// Schema Table
export const post = pgTable('post', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: text('slug').notNull(),
  images: text('images').array().notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  banner: text('banner'),
  status: postStatusEnum('status').notNull().default('draft'),
  shortDescription: text('short_description'),
  content: text('content').notNull(),
  contentJson: jsonb('content_jsonb').notNull(), // Lexical JSON state
  contentHtml: text('content_html').notNull(), // Renderable HTML
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
// Schema Relations
export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));
