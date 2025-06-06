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
  uuid,
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
  id: uuid().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  companyId: integer('company_id').references(() => companies.id, {
    onDelete: 'set null',
  }),
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

export const session = pgTable('session', {
  id: uuid().defaultRandom().primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export const account = pgTable('account', {
  id: uuid().defaultRandom().primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
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
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
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
    index('project_company_idx').on(t.companyId),
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
    assignedTo: uuid('user_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
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
    id: uuid().defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 256 }),
    role: teamRolesEnum('role').default('Developer').notNull(),
    department: varchar('department', { length: 256 }),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
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
    index('team_company_idx').on(t.companyId),
  ],
);

export const companies = pgTable(
  'company',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    company_password: text('company_password').notNull(),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('company_name_idx').on(t.name)],
);

// Junction table for many-to-many relationship between projects and teams
export const projectMembers = pgTable(
  'project_member',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
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
export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  company: one(companies, {
    fields: [user.companyId],
    references: [companies.id],
  }),
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

export const projectRelations = relations(projects, ({ many, one }) => ({
  issues: many(issues),
  members: many(projectMembers),
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
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

export const teamRelations = relations(teams, ({ many, one }) => ({
  projects: many(projectMembers),
  company: one(companies, {
    fields: [teams.companyId],
    references: [companies.id],
  }),
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

export const companyRelations = relations(companies, ({ many }) => ({
  users: many(user),
  projects: many(projects),
  teams: many(teams),
}));
