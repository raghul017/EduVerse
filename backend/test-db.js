import { pool } from './src/config/database.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('Successfully connected to database!');
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables found:', res.rows.map(r => r.table_name).join(', '));
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

testConnection();
