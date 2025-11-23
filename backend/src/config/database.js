import pg from 'pg';
import { env } from './environment.js';
import dns from 'node:dns';

// Force IPv4 to fix "connect ENETUNREACH" errors on Render/Supabase
// Must be here because this file initializes the pool immediately
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { Pool } = pg;

const needsSSL = env.databaseUrl?.includes('supabase') || env.node !== 'development';

if (needsSSL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: needsSSL ? { rejectUnauthorized: false } : false
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error', error);
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);
