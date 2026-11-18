import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import { SQL_CONFIG } from '../config/env.js';
import 'dotenv/config';

const { Pool } = pg;

// MANDATORY: Use the Object Method to handle special characters safely
const pool = new Pool({
  host: SQL_CONFIG.host,
  user: SQL_CONFIG.user,
  password: SQL_CONFIG.password,
  database: SQL_CONFIG.database,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

// MANDATORY: Prevent crashes when scale-to-zero drops idle connections
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
