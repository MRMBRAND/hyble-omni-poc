# Hyble Omni POC API

Lightweight Node.js/Hono API server providing the Omni embed URL endpoint for the frontend.

## Project Structure

```
api/
├── src/
│   ├── index.ts           # Hono app setup and server
│   ├── middleware/
│   │   └── auth.ts        # Auth0 JWT validation
│   └── routes/
│       └── analytics.ts   # Analytics endpoints
├── package.json
├── tsconfig.json
└── railway.toml           # Railway.app deployment config
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Server starts on `http://localhost:3001` by default (configurable via `PORT` env var).

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check (No Auth Required)

```
GET /health
```

Returns `{ status: "ok" }`

### Get Omni Embed URL (Auth Required)

```
GET /api/v4/analytics/omni-embed-url
Authorization: Bearer <Auth0 JWT>
```

Returns `{ url: string }` with the signed Omni embed URL.

**Status:** Currently returns 501 Not Implemented. Needs Omni API integration.

## Environment Variables

### Auth0 (Required)
- `AUTH0_DOMAIN` - Auth0 tenant domain (e.g. `mrmglobal-dev.eu.auth0.com`)
- `AUTH0_AUDIENCE` - Auth0 API audience identifier

### Omni (Required for embed URL endpoint)
- `OMNI_BASE_URL` - Omni instance base URL (e.g. `https://yourorg.omniapp.co`)
- `OMNI_EMBED_SECRET` - Secret key for SSO URL generation
- `OMNI_CONTENT_PATH` - Default dashboard path (e.g. `/dashboards/home`)

### Server (Optional)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend origin for CORS (optional, for non-local deployments)

### Custom Claims in Auth0 JWT

The API expects the following custom claims in the Auth0 JWT (namespace: `https://toolkit.hyble.app/`):
- `role` - User role (optional, passed to Omni)
- `marketId` - Market ID (optional, passed to Omni if non-zero)
- `brandId` - Brand ID (optional, passed to Omni if non-zero)
- `email` - User email (used as the "name" field for Omni)

Standard Auth0 claims used:
- `sub` - User ID (used as externalId for Omni)

## Implementation Details

### Omni Embed URL Generation

The `/api/v4/analytics/omni-embed-url` endpoint:

1. Validates Auth0 JWT and extracts user claims (subject, email, custom claims)
2. Validates required Omni configuration (BaseUrl, EmbedSecret, ContentPath)
3. Builds user attributes object with userId and optional role/marketId/brandId
4. Generates a unique nonce (UUID)
5. Makes a POST request to Omni's `/embed/sso/generate-url` endpoint with:
   - contentPath
   - externalId (user ID)
   - name (user email)
   - secret (Omni embed secret)
   - nonce
   - userAttributes (URL-encoded JSON)
6. Returns the signed embed URL from Omni

**Error Handling:**
- 401 Unauthorized - Missing user claims
- 503 Service Unavailable - Missing configuration or Omni API errors

## Deployment (Railway)

The API is deployed as a separate Railway service:

1. In Railway dashboard, create a new service pointing to this repo with root directory: `api/`
2. Set environment variables:
   - **Auth0:** `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`
   - **Omni:** `OMNI_BASE_URL`, `OMNI_EMBED_SECRET`, `OMNI_CONTENT_PATH`
   - **Server:** `PORT` (optional)
3. Connect the service to your GitHub repo
4. Railway will automatically run `npm ci && npm run build && npm start`

Once deployed, update the frontend's `ORDERS_HOST` env var in the frontend Railway service to point to the new API service URL (e.g., `https://api-service-name.railway.app`).
