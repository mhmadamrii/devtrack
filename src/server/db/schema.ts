import { sql } from 'drizzle-orm';
import {
  index,
  pgTableCreator,
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  serial,
  integer,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `devtrack_${name}`);

// --- ENUMS ---
export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'in_progress',
  'completed',
  'pending',
]);
export const issuePriorityEnum = pgEnum('issue_priority', [
  'low',
  'medium',
  'high',
]);
export const issueStatusEnum = pgEnum('issue_status', [
  'open',
  'in_progress',
  'closed',
]);
export const teamRolesEnum = pgEnum('team_role', [
  'Developer',
  'Designer',
  'QA Engineer',
  'Project Manager',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Other',
]);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const projects = pgTable(
  'project',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: projectStatusEnum('status').default('planning').notNull(),
    progress: integer('progress').default(0), // 0-100 percentage
    dueDate: timestamp('due_date'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('project_name_idx').on(t.name)],
);

export const issues = pgTable(
  'issue',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    assignedTo: text('assigned_to').references(() => user.id, {
      onDelete: 'set null',
    }),
    priority: issuePriorityEnum('priority').default('medium').notNull(),
    status: issueStatusEnum('status').default('open').notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('issue_name_idx').on(t.name),
    index('issue_project_idx').on(t.projectId),
  ],
);

export const teams = pgTable(
  'team',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    email: d.varchar({ length: 256 }),
    phone: d.varchar({ length: 256 }),
    role: teamRolesEnum('role').default('Developer').notNull(),
    department: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index('team_name_idx').on(t.name)],
);
