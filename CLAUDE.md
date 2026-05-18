# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**Omni BI PoC** — proof-of-concept for Hyble's Omni BI toolkit. Move fast, demonstrate capability. Skip tests unless explicitly asked.

## Skills

- `/add-feature` — implement a feature and open a PR
- `/fix-issue` — diagnose a bug and open a PR

## Commands

```bash
npm run dev     # dev server on port 3000
npm run build   # production build
npm run lint    # ESLint
```

## Key Notes

- **Env vars are deploy-time, not build-time** — accessed via `window.ENV_CONFIG` (loaded from `public/env.js` before React boots)
- Node version: **22**
