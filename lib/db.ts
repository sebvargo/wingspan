import { neon } from '@neondatabase/serverless';
import postgresClient from 'postgres';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}
const resolvedDatabaseUrl = databaseUrl;

function createSqlClient() {
  // Neon serverless URLs should use the Neon HTTP driver.
  if (resolvedDatabaseUrl.includes('neon.tech') || resolvedDatabaseUrl.includes('neon.')) {
    return neon(resolvedDatabaseUrl);
  }

  // Local/standard Postgres connections should use Postgres.js.
  return postgresClient(resolvedDatabaseUrl);
}

type SqlTag = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown[]>;

const sqlClient = createSqlClient() as unknown as SqlTag;

export const sql: SqlTag = (strings, ...values) => {
  return sqlClient(strings, ...values) as Promise<unknown[]>;
};
