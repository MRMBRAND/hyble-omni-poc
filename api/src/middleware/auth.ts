import { jwtVerify } from 'jose';
import { Context, Next } from 'hono';

const getJwksUrl = (domain: string) => `https://${domain}/.well-known/jwks.json`;

let cachedJwks: Record<string, any> = {};
let jwksCachetime = 0;
const JWKS_CACHE_DURATION = 3600000; // 1 hour

async function getJwks(domain: string) {
  const now = Date.now();
  if (cachedJwks && jwksCachetime > now) {
    return cachedJwks;
  }

  const response = await fetch(getJwksUrl(domain));
  cachedJwks = await response.json();
  jwksCachetime = now + JWKS_CACHE_DURATION;
  return cachedJwks;
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const auth0Audience = process.env.AUTH0_AUDIENCE;

  if (!auth0Domain || !auth0Audience) {
    console.error('Missing AUTH0_DOMAIN or AUTH0_AUDIENCE env vars');
    return c.json({ error: 'Internal Server Error' }, 500);
  }

  try {
    const jwks = await getJwks(auth0Domain);
    const decoded = await jwtVerify(token, async (header) => {
      const key = jwks.keys.find((k: any) => k.kid === header.kid);
      if (!key) throw new Error('Key not found');
      return key;
    });

    if (decoded.payload.aud !== auth0Audience && !Array.isArray(decoded.payload.aud)) {
      return c.json({ error: 'Invalid audience' }, 401);
    }

    if (Array.isArray(decoded.payload.aud) && !decoded.payload.aud.includes(auth0Audience)) {
      return c.json({ error: 'Invalid audience' }, 401);
    }

    c.set('user', decoded.payload);
    await next();
  } catch (error) {
    console.error('Auth error:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
}
