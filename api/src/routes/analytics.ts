import { Hono } from 'hono';

const app = new Hono();

interface OmniEmbedUrlResponse {
  url: string;
}

app.get('/api/v4/analytics/omni-embed-url', async (c) => {
  // TODO: Implement Omni embed URL generation
  // This endpoint should:
  // 1. Call the Omni API using OMNI_API_KEY (or similar credential)
  // 2. Generate a signed/authenticated embed URL
  // 3. Return { url: string }
  //
  // The user from the JWT is available in c.get('user')
  // Environment variables available: process.env.OMNI_API_KEY, etc.

  return c.json<OmniEmbedUrlResponse>(
    { url: '' },
    501 // Not Implemented
  );
});

export default app;
