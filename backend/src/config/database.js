import pg from 'pg';
import { env } from './environment.js';

const { Pool } = pg;

// Supabase requires SSL with rejectUnauthorized: false
const needsSSL = env.databaseUrl?.includes('supabase') || 
                 env.databaseUrl?.includes('pooler.supabase') ||
                 env.node === 'production';

// IMPORTANT: Strip sslmode from connection string because it conflicts with our ssl config
// The sslmode=require in URL forces strict SSL which rejects self-signed certs
// We need to use our own ssl config with rejectUnauthorized: false
const connectionString = env.databaseUrl?.replace(/[?&]sslmode=[^&]+/gi, '') || env.databaseUrl;

// Build SSL config for Supabase
const sslConfig = needsSSL ? {
  rejectUnauthorized: false,
} : false;

console.log('[Database] Connecting with SSL:', needsSSL ? 'enabled (self-signed allowed)' : 'disabled');

export const pool = new Pool({
  connectionString,
  ssl: sslConfig,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (error) => {
  console.error('[Database] Pool error:', error.message);
});

pool.on('connect', () => {
  console.log('[Database] New client connected');
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[Database] Slow query (${duration}ms):`, text.substring(0, 50));
    }
    return result;
  } catch (error) {
    console.error('[Database] Query error:', error.message);
    throw error;
  }
};

export const getDebugInfo = () => ({
  ssl: needsSSL ? 'enabled (rejectUnauthorized: false)' : 'disabled',
  poolSize: 5,
  message: "Using SSL with self-signed cert support for Supabase"
});

