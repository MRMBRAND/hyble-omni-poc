import { Hono } from 'hono';
import { randomUUID } from 'crypto';

const app = new Hono();

interface OmniEmbedUrlResponse {
  url: string;
}

interface OmniApiRequest {
  contentPath: string;
  externalId: string;
  name: string;
  secret: string;
  nonce: string;
  userAttributes: string;
}

interface OmniApiResponse {
  url: string;
}

app.get('/api/v4/analytics/omni-embed-url', async (c) => {
  // Validate required configuration
  const omniBaseUrl = process.env.OMNI_BASE_URL;
  const omniEmbedSecret = process.env.OMNI_EMBED_SECRET;
  const omniContentPath = process.env.OMNI_CONTENT_PATH;

  if (!omniBaseUrl) {
    console.error('OMNI_BASE_URL not configured');
    return c.json({ error: 'Omni base URL not configured' }, 503);
  }

  if (!omniEmbedSecret) {
    console.error('OMNI_EMBED_SECRET not configured');
    return c.json({ error: 'Omni embed secret not configured' }, 503);
  }

  if (!omniContentPath) {
    console.error('OMNI_CONTENT_PATH not configured');
    return c.json({ error: 'Omni content path not configured' }, 503);
  }

  // Extract user claims from JWT
  const user = c.get('user') as any;

  // Extract claims using mrmglobal.com namespace
  const externalId = user?.['https://mrmglobal.com/unique_id'];
  const userEmail = user?.['https://mrmglobal.com/unique_name'];

  if (!externalId || !userEmail) {
    console.error('Missing required user claims:');
    console.error(`  - unique_id (externalId): ${externalId ? '✓' : '✗'}`);
    console.error(`  - unique_name (email): ${userEmail ? '✓' : '✗'}`);
    return c.json({ error: 'Missing user claims' }, 401);
  }

  // Build user attributes (only include non-null values)
  const userAttributes: Record<string, any> = {
    userId: externalId,
  };

  // Add optional claims if present and not zero/null
  const roleArray = user?.['https://mrmglobal.com/role'];
  if (roleArray && Array.isArray(roleArray) && roleArray.length > 0) {
    // If it's an array, take the first element
    userAttributes.role = roleArray[0];
  } else if (roleArray && typeof roleArray === 'string') {
    userAttributes.role = roleArray;
  }

  const marketId = user?.['https://mrmglobal.com/market_id'];
  if (marketId && marketId !== 0 && marketId !== '0') {
    userAttributes.marketId = parseInt(marketId, 10);
  }

  const brandId = user?.['https://mrmglobal.com/brand_id'];
  if (brandId && brandId !== 0 && brandId !== '0') {
    userAttributes.brandId = parseInt(brandId, 10);
  }

  // URL-encode user attributes as JSON
  const encodedUserAttributes = encodeURIComponent(JSON.stringify(userAttributes));

  // Generate nonce
  const nonce = randomUUID();

  // Build Omni API request
  const omniRequest: OmniApiRequest = {
    contentPath: omniContentPath,
    externalId,
    name: userEmail,
    secret: omniEmbedSecret,
    nonce,
    userAttributes: encodedUserAttributes,
  };

  try {
    // Call Omni API to generate embed URL
    const omniUrl = new URL('/embed/sso/generate-url', omniBaseUrl).toString();
    const response = await fetch(omniUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(omniRequest),
    });

    if (!response.ok) {
      console.error(`Omni API error: ${response.status} ${response.statusText}`);
      return c.json({ error: 'Omni embed URL generation failed' }, 503);
    }

    const omniResponse = (await response.json()) as OmniApiResponse;

    if (!omniResponse.url) {
      console.error('Omni returned an empty embed URL');
      return c.json({ error: 'Omni returned an empty embed URL' }, 503);
    }

    return c.json<OmniEmbedUrlResponse>({ url: omniResponse.url });
  } catch (error) {
    console.error('Error calling Omni API:', error);
    return c.json({ error: 'Omni embed URL generation failed' }, 503);
  }
});

export default app;
