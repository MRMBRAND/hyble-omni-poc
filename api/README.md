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

Required for production:

- `AUTH0_DOMAIN` - Auth0 tenant domain (e.g. `mrmglobal-dev.eu.auth0.com`)
- `AUTH0_AUDIENCE` - Auth0 API audience identifier
- `OMNI_API_KEY` - Omni API credentials (TBD based on Omni integration)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend origin for CORS (optional, for non-local deployments)

## Implementation Notes

The `/api/v4/analytics/omni-embed-url` endpoint is scaffolded but not yet implemented. To complete it:

1. Review the Orders Service implementation to understand how the Omni embed URL is generated
2. Determine whether it requires calling an external Omni API, signing a local JWT, or other mechanism
3. Implement the handler in `src/routes/analytics.ts`
4. Add the necessary environment variables to Railway
5. Test with the frontend

## Deployment (Railway)

The API is deployed as a separate Railway service:

1. In Railway dashboard, create a new service pointing to this repo with root directory: `api/`
2. Set environment variables: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `OMNI_API_KEY`
3. Connect the service to your GitHub repo
4. Railway will automatically run `npm ci && npm run build && npm start`

Once deployed, update the frontend's `ORDERS_HOST` env var to point to the API service URL.
