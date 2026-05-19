---
name: add-feature
description: Implement a new feature end-to-end and open a PR
---

Given a feature description or GitHub issue number:

1. If an issue number is provided, run `gh issue view <number>` to read the full spec
2. Explore the relevant parts of the codebase to understand where the change belongs
3. Propose an approach — outline which files will change and why — before writing any code
4. Wait for confirmation, then implement
5. Run `npm run lint` and fix any issues
6. Commit with a descriptive message
7. Open a PR with `gh pr create` — title should be concise, body should explain what changed and why

This is a PoC repo, so skip writing tests unless explicitly asked.
