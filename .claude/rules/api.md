---
name: api-patterns
description: How API clients are structured in this repo
globs: src/services/api/**
---

APIs use a closure pattern — **never** prop-drill `getAccessTokenSilently` into components.

Structure:
1. `createApiClient(getAccessTokenSilently)` — returns an authenticated fetch helper
2. Domain factories (e.g. `createOrderApi(fetch)`) accept the helper and return typed methods
3. `createRootApi` composes all domain APIs → exposed via `useApi()` hook
4. New API domains follow the same factory pattern and get registered in `createRootApi`

See `src/services/api/README.md` for full detail.
