# Progress

> Source of truth for project status. AI: read this first, then the feature file under "Current". Update it after every completed task.
> **Last updated:** 2026-10-27
> **Current:** None. Feature 01 (Clerk auth) is complete.
> **Next:** Define feature 02 before implementing user data (Prisma `User`, `Attempt`, `Progress`).

## Status legend

`[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Features

| #   | Feature                  | File                      | Status | Notes                                                            |
| --- | ------------------------ | ------------------------- | ------ | ---------------------------------------------------------------- |
| 01  | Add Clerk authentication | features/01-add-clerk.md  | [x]    | Accountless dev app; claim with `bunx clerk@latest auth login`   |

## Current feature:

None. Feature 01 is complete.

### Done

- Ran `bunx clerk@latest init -y --no-skills`; provisioned an accountless Clerk app and wrote dev keys to `.env.local`.
- Created `proxy.ts` with `clerkMiddleware()` for Next.js 16.
- Added `ClerkProvider` inside `<body>` and a header with `Suspense`-wrapped `Show` auth controls.
- Added `/sign-in` and `/sign-up` catch-all pages, wrapped in `Suspense` for `cacheComponents`.
- Verified `clerk doctor`, lint, TypeScript, `next build`, and dev-rendered auth controls.

### Remaining

- User must sign up in the nav to create the first account and confirm the browser flow.
- Claim the accountless app with `bunx clerk@latest auth login` from the repo root.

## Up next

- Define the next feature file in `context/features/` before building user data/progress.

## Decisions (short, dated)

- 2026-10-27: Used Clerk's accountless mode instead of signing in; the existing keys were empty and no app was linked.
- 2026-10-27: Kept the CLI-generated `/sign-in` and `/sign-up` routes; `proxy.ts` is the middleware filename for Next.js 16.
- 2026-10-27: Wrapped `SignIn`/`SignUp` pages in `Suspense` because `cacheComponents: true` requires request data inside a boundary.
- 2026-10-27: Removed duplicate empty Clerk placeholder lines from `.env.local` and normalized it to LF after `init` wrote the real values; the CLI's env parser does not handle CRLF.

## Known issues / blockers

- Clerk app is unclaimed; dev keys are temporary. Run `bunx clerk@latest auth login` from the repo root to claim it.
- The first browser sign-up/sign-in flow still needs a manual check by the user.

## Rules for AI

1. Read this file, then only the _Current_ feature file.
2. Work on one feature at a time, in numeric order.
3. A feature is `[x]` only when all its acceptance criteria pass.
4. After finishing work: update checkboxes, "Last updated", Current/Next.
5. Log non-obvious decisions under Decisions; don't rewrite history.
6. Dont build out-of-scope ideas.
