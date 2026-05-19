---
name: fix-issue
description: Diagnose and fix a bug or issue end-to-end and open a PR
---

Given an issue number or bug description:

1. If an issue number is provided, run `gh issue view <number>` to read the details
2. Reproduce the problem by reading the relevant code — understand the root cause before touching anything
3. Explain the diagnosis — what is broken and why — before making changes
4. Apply the minimal fix
5. Run `npm run lint` and fix any issues
6. Commit with a message that references the issue (e.g. `fix: <description> (#123)`)
7. Open a PR with `gh pr create` and link the issue in the body

This is a PoC repo, so skip writing tests unless explicitly asked.
