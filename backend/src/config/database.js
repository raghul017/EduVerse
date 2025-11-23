import pg from 'pg';
import { env } from './environment.js';
import dns from 'node:dns';
import util from 'node:util';

const { Pool } = pg;
const resolve4 = util.promisify(dns.resolve4);

const needsSSL = env.databaseUrl?.includes('supabase') || env.node !== 'development';

if (needsSSL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Helper to get IPv4 connection string
const getIPv4ConnectionString = async () => {
  try {
    if (!env.databaseUrl) return '';
    
    // Parse the URL
    const url = new URL(env.databaseUrl);
    const hostname = url.hostname;
    
    // If it's already an IP, return as is
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return env.databaseUrl;
    }

    console.log(`[Database] Resolving IPv4 for ${hostname}...`);
    const addresses = await resolve4(hostname);
    
    if (addresses && addresses.length > 0) {
      console.log(`[Database] Resolved to ${addresses[0]}`);
      url.hostname = addresses[0];
      return url.toString();
    }
  } catch (error) {
    console.error('[Database] DNS Resolution failed:', error);
  }
  return env.databaseUrl; // Fallback to original
};

// Create a wrapper for the pool to handle async initialization
let pool = null;

const getPool = async () => {
  if (pool) return pool;
  
  const connectionString = await getIPv4ConnectionString();
  
  pool = new Pool({
    connectionString,
    ssl: needsSSL ? { rejectUnauthorized: false } : false
  });

  pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL error', error);
    process.exit(1);
  });

  return pool;
};

export const query = async (text, params) => {
  const p = await getPool();
  return p.query(text, params);
};
