import { relations, sql } from 'drizzle-orm';

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
  varchar,
  primaryKey,
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
  onboarded: boolean('onboarded').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

// Relations will be defined after all tables

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
    dueDate: integer('due_date').default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('project_name_idx').on(t.name),
    index('project_status_idx').on(t.status),
  ],
);

export const issues = pgTable(
  'issue',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    assignedTo: integer('assigned_to').references(() => teams.id, {
      onDelete: 'set null',
    }),
    priority: issuePriorityEnum('priority').default('medium').notNull(),
    status: issueStatusEnum('status').default('in_progress').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('issue_name_idx').on(t.name),
    index('issue_project_idx').on(t.projectId),
    index('issue_assigned_to_idx').on(t.assignedTo),
  ],
);

export const teams = pgTable(
  'team',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 256 }),
    role: teamRolesEnum('role').default('Developer').notNull(),
    department: varchar('department', { length: 256 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('team_name_idx').on(t.name),
    index('team_email_idx').on(t.email),
  ],
);

// Junction table for many-to-many relationship between projects and teams
export const projectMembers = pgTable(
  'project_member',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    teamId: integer('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.teamId] }),
    index('project_member_project_idx').on(t.projectId),
    index('project_member_team_idx').on(t.teamId),
  ],
);

// Define relations for better type safety and easier joins

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(projects, ({ many }) => ({
  issues: many(issues),
  members: many(projectMembers),
}));

export const issueRelations = relations(issues, ({ one }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
  assignee: one(teams, {
    fields: [issues.assignedTo],
    references: [teams.id],
  }),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  projects: many(projectMembers),
  assignedIssues: many(issues, { relationName: 'assignee' }),
}));

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  team: one(teams, {
    fields: [projectMembers.teamId],
    references: [teams.id],
  }),
}));
