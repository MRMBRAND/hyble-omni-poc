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

### Configure Environment Variables

Create `.env.local` in this directory (`api/`) with your configuration:

```env
# Auth0 (required)
AUTH0_DOMAIN=mrmglobal-dev.eu.auth0.com
AUTH0_AUDIENCE=your-auth0-api-audience

# Omni (required for embed URL endpoint)
OMNI_BASE_URL=https://your-org.omniapp.co
OMNI_EMBED_SECRET=your-embed-secret-key
OMNI_CONTENT_PATH=/dashboards/home

# Optional
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Note:** 
- `.env.local` is in `.gitignore` and won't be committed
- The file is automatically loaded using `dotenv` when the server starts
- Create it in the `api/` directory (same level as `package.json`)

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

**`AUTH0_DOMAIN`**
- Your Auth0 tenant domain
- Example: `mrmglobal-dev.eu.auth0.com`
- Where to find: Auth0 Dashboard → Settings → Domain

**`AUTH0_AUDIENCE`**
- Auth0 API audience identifier
- Example: `https://api.toolkit.hyble.app`
- Where to find: Auth0 Dashboard → APIs → Select your API → Settings → Identifier

### Omni (Required for embed URL endpoint)

**`OMNI_BASE_URL`**
- Your Omni instance base URL
- Example: `https://yourorg.omniapp.co`
- Where to find: Check your Omni dashboard URL or ask your Omni administrator

**`OMNI_EMBED_SECRET`**
- Secret key for SSO URL generation (used to sign the embed URLs)
- Where to find: Omni instance settings/administration panel (ask your Omni administrator)
- ⚠️ **Keep this secret** - never commit to version control

**`OMNI_CONTENT_PATH`**
- Default dashboard path for the embed
- Example: `/dashboards/home`
- Where to find: Customizable based on your Omni dashboard setup, ask your Omni administrator

### Server (Optional)

**`PORT`**
- Server port (default: 3001)
- Example: `3001`

**`FRONTEND_URL`**
- Frontend origin for CORS (used in production deployments)
- Example: `https://frontend-service.railway.app`
- Not needed for local development

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

The API is deployed as a separate Railway service from the frontend:

### Steps

1. **Create a new Railway service** for the API
   - Connect to your GitHub repository
   - Set root directory to `api/`

2. **Configure environment variables** in Railway dashboard:
   ```
   AUTH0_DOMAIN=mrmglobal-dev.eu.auth0.com
   AUTH0_AUDIENCE=your-auth0-api-audience
   OMNI_BASE_URL=https://your-org.omniapp.co
   OMNI_EMBED_SECRET=your-embed-secret-key
   OMNI_CONTENT_PATH=/dashboards/home
   PORT=3001
   ```

3. **Railway automatically deploys** using `api/railway.toml`:
   ```bash
   # Build
   npm ci && npm run build
   
   # Start
   npm start
   ```

### Updating the Frontend Service

Once the API service is deployed, update the frontend's `ORDERS_HOST` environment variable:

1. Open the frontend Railway service settings
2. Add/update: `ORDERS_HOST=https://api-service-name.railway.app`
3. The frontend will use this URL instead of the external Orders Service

The service URL is shown in the Railway dashboard when you deploy (e.g., `https://api-production-xxxx.railway.app`).
