import { writeFileSync } from 'fs';

const required = [
  'AUTH0_AUDIENCE',
  'AUTH0_CLIENT_ID',
  'AUTH0_DOMAIN',
  'POSTHOG_KEY',
  'POSTHOG_HOST',
  'ORDERS_HOST',
  'ANALYTICS_API_HOST',
  'TOOLKIT_HOMEPAGE_URL',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const config = {
  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN,
  },
  keys: {
    posthogKey: process.env.POSTHOG_KEY,
    posthogHost: process.env.POSTHOG_HOST,
  },
  hosts: {
    orders: process.env.ORDERS_HOST,
    analyticsApi: process.env.ANALYTICS_API_HOST,
  },
  urls: {
    toolkitHomepage: process.env.TOOLKIT_HOMEPAGE_URL,
  },
};

writeFileSync(
  'public/env.js',
  `window.ENV_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
);
console.log('Generated public/env.js');
