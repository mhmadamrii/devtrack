import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Read the DATABASE_URL from .env file
import fs from 'fs';
const envContent = fs.readFileSync('.env', 'utf8');
const databaseUrl = envContent
  .split('\n')
  .find((line) => line.startsWith('DATABASE_URL='))
  ?.split('=')[1]
  ?.trim();

if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env file');
  process.exit(1);
}

// Remove quotes if present
const cleanUrl = databaseUrl.replace(/^["'](.*)["']$/, '$1');

const sql = postgres(cleanUrl, { max: 1, ssl: { rejectUnauthorized: false } });
const db = drizzle(sql);

// Run migrations
console.log('Running migrations...');
migrate(db, { migrationsFolder: './drizzle' })
  .then(() => {
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
