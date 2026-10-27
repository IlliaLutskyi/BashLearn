# Conventions

Rules for how code is written in this project. Follow them unless a feature file says otherwise.

## General

- TypeScript in strict mode. No `any`; use `unknown` and narrow it.
- Prefer small files with one responsibility. Split a file when it passes ~200 lines.
- Prefer named exports. Use default exports only where Next.js requires them (`page.tsx`, `layout.tsx`, `route.ts`).
- Validate every boundary with Zod: content frontmatter, assignment definitions, Server Action input, API responses, webhook payloads, environment variables.

## Naming

| Thing                   | Style                      | Example                 |
| ----------------------- | -------------------------- | ----------------------- |
| Files and folders       | kebab-case                 | `terminal-panel.tsx`    |
| React components        | PascalCase                 | `TerminalPanel`         |
| Functions and variables | camelCase                  | `runCommand`            |
| Hooks                   | camelCase, `use` prefix    | `useProgress`           |
| Types and interfaces    | PascalCase                 | `Sandbox`, `Validator`  |
| Constants               | UPPER_SNAKE_CASE           | `MAX_HISTORY`           |
| Prisma models           | PascalCase, singular       | `Progress`              |
| Prisma fields           | camelCase                  | `assignmentSlug`        |
| Content files           | kebab-case, slug is the ID | `grep.mdx`, `grep-1.ts` |

Slugs are permanent IDs. Never rename a slug once it has user data pointing to it.

Keep pure logic (sandbox, validators, assignment schemas) in `/lib` with no React imports, so it runs in the browser, in the worker, in Server Actions, and in Vitest. React hooks live in `/hooks`, not in `/lib`.

## Next.js (App Router)

- Components are Server Components by default. Add `"use client"` only when you need state, effects, or browser APIs, and push it as far down the tree as possible.
- The terminal, the editor, and anything touching `window` are client components.
- Load xterm.js and CodeMirror with `next/dynamic` and `ssr: false`, since both need the browser.
- Load the first render's data in Server Components. Client-side data goes through React Query (see "Data fetching").
- Mutate with Server Actions. Use route handlers for webhooks, other external callers, and read endpoints that React Query calls from the client.
- Every Server Action and route handler: check the user with `auth()`, parse input with Zod, then act. Return a typed result (`{ ok: true, data } | { ok: false, error }`) instead of throwing for expected failures.
- Use `loading.tsx` and `error.tsx` for route-level states, and `notFound()` for missing lessons.
- Use `next/link` and `next/image`. Don't use `<a>` for internal links.

## Data fetching (React Query)

- Never fetch in `useEffect` or store fetched data in `useState`. Use `useQuery`.
- Wrap every query in a custom hook in `/hooks` (`useProgress`, `useAttempts`). Components never call `useQuery` inline.
- Define query keys in one place as a key factory, with hierarchical arrays: `["progress"]`, `["progress", assignmentSlug]`.
- Client reads call GET route handlers. Parse the response with Zod inside the `queryFn`.
- For pages that need data on first paint, prefetch in the Server Component and pass it down with `HydrationBoundary` and `dehydrate`, so the client doesn't start with a loading state.
- Don't copy query data into state. Use it directly or derive from it during render.
- Use `useMutation` calling a Server Action. If the action returns `{ ok: false }`, throw inside `mutationFn` so `onError` runs.
- On success, call `invalidateQueries` for the affected keys (for example, passing an assignment invalidates `["progress"]`).
- Use optimistic updates only for instant, low-risk actions such as marking a lesson as read. Never for pass/fail results.
- Show success and error feedback with `sonner` in `onSuccess` and `onError`.

## React

- Don't use `forwardRef`. Use React 19's plain-prop `ref`, or restructure the component.
- Function components only. Keep props typed with an explicit `type Props`.
- Keep state as local as possible. Reach for a store (Zustand) only for terminal or session state shared across distant components.
- Server state belongs in React Query, never in `useState`, `useEffect`, or Zustand.
- Don't copy props into state. Derive values during render.
- Use `useEffect` only to sync with external systems (xterm, the worker, CodeMirror). Always return a cleanup function that disposes them.
- Avoid premature `useMemo` and `useCallback`. Add them only where identity matters (extension arrays passed to CodeMirror, handlers passed into the terminal).

## Sandbox (just-bash)

- Everything goes through the `Sandbox` interface (`run`, `writeFile`, `getFs`, `reset`). UI code never imports just-bash directly.
- Run just-bash in a Web Worker and talk to it with comlink. Never run it on the main thread.
- Set execution limits (such as max command count) and a per-command timeout.
- Log every command and every editor write as events (`{ type: "command", input }`, `{ type: "write", path, content }`) so the server can replay them.
- Assignments must be deterministic. Don't depend on `date`, random values, or network.
- Commands just-bash lacks are either added with `defineCommand` or left out. Don't paper over gaps with fake output inside lessons.

## Assignments and validators

- An assignment is a typed object: `slug`, `title`, `instructions`, `initialFs`, `validators`, `hints`. Define the Zod schema first and infer the type from it.
- Validators are pure functions of `{ fs, lastResult }`. No I/O, no globals.
- Prefer state-based validators (file exists, file contains, output matches) over "command was used."
- Every assignment has a test: the reference solution passes, and the untouched starting state fails.

## Prisma and Postgres

- Create one Prisma client and reuse it (singleton on `globalThis` in development).
- Use the pooled connection string at runtime and the direct connection string for migrations.
- The database holds only user data: `User`, `Attempt`, `Progress`. Lessons and assignments are not stored there.
- Reference content by slug, not by a foreign key.
- Add indexes for the queries you actually run, such as `(userId, assignmentSlug)`.
- Every schema change goes through a migration (`prisma migrate`), never a manual edit.
- Select only the fields you need. Don't return full rows to the client.

## Clerk (auth)

- Protect routes with Clerk middleware. Make marketing and lesson-reading pages public if you want them indexed; protect progress and assignment submission.
- In server code, get the user with `await auth()` and use `userId` as the foreign key. Don't trust a user ID sent from the client.
- Create the `User` row from the Clerk webhook. Verify the webhook signature before touching the database.
- Keep Clerk's own UI components (sign-in, user button) instead of rebuilding them.

## MDX content

- One MDX file per command, with frontmatter validated by Zod at build time: `title`, `order`, `track`, `slug`.
- Register custom components (`Callout`, `CommandExample`, `TryIt`) in one place so every lesson uses the same set.
- Keep lessons short: what it does, the common flags, two or three examples, then the assignment.
- Examples in `CommandExample` show real output that just-bash actually produces. Test them.

## Testing (Vitest)

- Test pure logic first: line editor, validators, assignment schemas, sandbox wrapper, custom commands, query key factories.
- Name test files `*.test.ts` next to the code they cover.
- Write the test with the feature, not after.
- Test behavior, not implementation: input commands in, expected files and output out.
- Don't unit-test shadcn components, Next.js routing, or React Query itself.
- CI runs lint, type-check, and Vitest on every pull request. A broken assignment or invalid frontmatter must fail the build.

## Environment variables

- Define and validate all environment variables in `/lib/env.ts` with Zod. Import from there, never read `process.env` directly elsewhere.
- Only variables prefixed with `NEXT_PUBLIC_` reach the browser. Secrets never do.
- Keep an `.env.example` with every key and no values.

## Git

- Small branches, one feature file per branch, named after it: `feat/05-terminal-xterm`.
- Commit messages: `type: short summary` (`feat`, `fix`, `test`, `docs`, `chore`, `refactor`).
- Every pull request: Vitest passing, type-check passing, and `context/progress.md` updated.
- Content changes (lessons, assignments) get their own commits, separate from code changes.

## Accessibility and UX

- All interactive elements are reachable by keyboard, with visible focus states.
- Terminal and editor panels have accessible labels.
- Don't convey pass/fail by color alone; include text or an icon.
- Respect `prefers-reduced-motion` and the system color scheme.
