import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.warn(`⚠️  Could not load .env.local: ${result.error.message}`);
} else {
  console.log(`✓ Loaded environment from ${envPath}`);
}

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import analyticsRoutes from './routes/analytics';

const app = new Hono();

// CORS middleware - allow requests from frontend origins
const frontendOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(
  cors({
    origin: frontendOrigins,
    credentials: true,
  })
);

// Health check endpoint (no auth required)
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Auth middleware for API routes
app.use('/api/*', authMiddleware);

// Register analytics routes
app.route('', analyticsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Start server
const port = parseInt(process.env.PORT || '3001', 10);

// Debug: Log environment variables status
console.log('\nEnvironment Variables Status:');
console.log(`  AUTH0_DOMAIN: ${process.env.AUTH0_DOMAIN ? '✓' : '✗ MISSING'}`);
console.log(`  AUTH0_AUDIENCE: ${process.env.AUTH0_AUDIENCE ? '✓' : '✗ MISSING'}`);
console.log(`  OMNI_BASE_URL: ${process.env.OMNI_BASE_URL ? '✓' : '✗ MISSING'}`);
console.log(`  OMNI_EMBED_SECRET: ${process.env.OMNI_EMBED_SECRET ? '✓' : '✗ MISSING'}`);
console.log(`  OMNI_CONTENT_PATH: ${process.env.OMNI_CONTENT_PATH ? '✓' : '✗ MISSING'}\n`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  }
);
