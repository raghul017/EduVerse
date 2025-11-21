import app from './src/app.js';
import { env } from './src/config/environment.js';

const server = app.listen(env.port, () => {
  console.log(`EduVerse API running on port ${env.port}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
