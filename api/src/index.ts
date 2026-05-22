import 'dotenv/config';
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

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  }
);
