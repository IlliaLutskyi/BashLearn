<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Linux Commands Learning App: users read short Linux command lessons, then practice in an in-browser terminal (just-bash) with auto-checked assignments.

## Read every session

1. `context/progress.md`: what is Done, Now, and Next, plus the next action
2. The feature file named under "Now" in `context/features/`
3. `context/conventions.md`: how code is written
4. `context/stack.md`: the stack and how its parts fit together
5. `context/known-issues.md`: known pitfalls and unresolved problems
6. `context/ui-design-system.md`: read before any UI work

## Rules

- Lessons and assignments are files in the repo, never in the database.
- The database stores only user data (`Attempt`, `Progress`), keyed by assignment slug.
- UI code talks to the `Sandbox` interface, never to just-bash directly.
- Validators are pure functions shared by client and server.
- No `forwardRef`; use React 19's plain-prop `ref`.
- Don't build anything that isn't described in `context/features/`.

## Workflow

- Work on one feature at a time, the one under "Current feature" in `context/progress.md`.
- Write Vitest tests together with the feature.
- Run lint, type-check, and tests before finishing.
- If a requirement is unclear, ask instead of guessing.

## Communication

- Keep answers concise. Lead with the result, skip long explanations and recaps.
- If something is unclear or missing, ask a short question before doing the work. Don't guess or assume.
- Ask one question at a time, and only when the answer changes what you build.

## Before ending a session

Update `context/progress.md`: move finished work to Done, update Now (completed, remaining, next action), and set Next. Record new pitfalls and unresolved problems in `context/known-issues.md`.
