import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('trainee').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const traineeApplications = pgTable('trainee_applications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  cityZip: text('city_zip'),
  programTrack: text('program_track').default('Transitional Jobs (Activity 220)').notNull(),
  careerCenter: text('career_center').default('Valley Career Center').notNull(),
  status: text('status').default('Submitted').notNull(),
  currentStage: integer('current_stage').default(1).notNull(),
  wioaVerified: boolean('wioa_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceActivityLogs = pgTable('workspace_activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  service: text('service').notNull(), // docs, tasks, keep, contacts, slides, chat, meet, sheets, classroom
  action: text('action').notNull(),
  resourceId: text('resource_id'),
  resourceTitle: text('resource_title'),
  resourceUrl: text('resource_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
