import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const feedback = sqliteTable('feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  feedbackText: text('feedback_text').notNull(),
  createdAt: text('created_at').notNull(),
});