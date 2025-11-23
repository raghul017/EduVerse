import 'dotenv/config'; // Load .env before anything else

import app from './src/app.js';
import { env } from './src/config/environment.js';
import dns from 'node:dns';

// Force IPv4 to fix "connect ENETUNREACH" errors on Render/Supabase
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const server = app.listen(env.port, () => {
  console.log(`EduVerse API running on port ${env.port}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
