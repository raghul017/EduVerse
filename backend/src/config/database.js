import pg from 'pg';
import { env } from './environment.js';
import dns from 'node:dns/promises';

const { Pool } = pg;

const needsSSL = env.databaseUrl?.includes('supabase') || env.node !== 'development';

if (needsSSL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Debug state
let debugState = {
  originalHost: null,
  resolvedIp: null,
  resolutionError: null,
  usingFallback: false
};

// Helper to get IPv4 connection string
const getIPv4ConnectionString = async () => {
  try {
    if (!env.databaseUrl) return '';
    
    // Parse the URL
    const url = new URL(env.databaseUrl);
    const hostname = url.hostname;
    debugState.originalHost = hostname;
    
    // If it's already an IP, return as is
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      debugState.resolvedIp = hostname;
      return env.databaseUrl;
    }

    console.log(`[Database] Looking up IPv4 for ${hostname}...`);
    // Use lookup instead of resolve4 (uses OS resolver, more reliable)
    const { address } = await dns.lookup(hostname, { family: 4 });
    
    if (address) {
      console.log(`[Database] Resolved to ${address}`);
      debugState.resolvedIp = address;
      url.hostname = address;
      return url.toString();
    }
  } catch (error) {
    console.error('[Database] DNS Lookup failed:', error);
    debugState.resolutionError = error.message;
    debugState.usingFallback = true;
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
    // Don't exit, just log. Exiting causes restart loops.
  });

  return pool;
};

export const query = async (text, params) => {
  const p = await getPool();
  return p.query(text, params);
};

export const getDebugInfo = () => debugState;
