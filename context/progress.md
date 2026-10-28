# Progress

> Source of truth for project status. AI: read this first, then the feature file under "Current". Update it after every completed task.
>
> Last updated: 2026-10-28

## Current feature:

- None

### Done

- `01-add-clerk.md` — Clerk authentication scaffolded with development keys, middleware, provider, and themed auth routes.
- `02-add-auth-ui.md` — Shared `(auth)` route group with themed Clerk sign-in/sign-up pages, static `--sidebar-*`-styled aside, and a header-free layout.
- Home page + navigation — public one-screen landing page with BashLearn header, Problems link, Clerk auth state, and Motion entrance animations.

### Remaining

## Up next

- None

## Decisions (short, dated)

- 2026-10-28: Auth pages use a shared `(auth)` route group with a static aside styled by `--sidebar-*` tokens. The shadcn Sidebar component was intentionally not used; it adds client state and registry dependencies for a presentational panel.
- 2026-10-28: Clerk is themed with `@clerk/ui`'s shadcn theme, which maps Clerk variables to the tokens in `app/globals.css`.
- 2026-10-28: The site header was moved into an `(app)` route-group layout so auth pages render full-height without navigation; the aside width is 45% per the user's request.
- 2026-10-28: The auth feature numbers use `text-sidebar-foreground` on `bg-sidebar-accent` instead of the plan's accent foreground, raising contrast from ~2.5:1 to 9.45:1 in light mode.
- 2026-10-28: Clerk's card radius renders at 16px because it derives from Clerk's `lg` step; `--radius` (12px) is the base used by buttons and inputs.
- 2026-10-28: Final review found the compact auth subtitle at 4.46:1 on `--background`; `--muted-foreground` was darkened from 46.86% to 46% to reach 4.60:1 and meet AA.
- 2026-10-28: `env.example` documents the optional Clerk sign-in/sign-up URLs and fallback redirects used by the current header flow; Clerk already defaults to the same routes.
- 2026-10-28: The public home page is one centered hero plus three benefit cards. A terminal-led hero was rejected because the product has no working problems/terminal flow yet, so showing one would be misleading.
- 2026-10-28: The site header is a server component wrapped in a small client Motion shell; Clerk state stays server-rendered and Motion only animates transform/opacity.
- 2026-10-28: The primary CTA uses `bg-foreground text-background` because the theme's cyan primary with white text is about 2.8:1, below AA for small text.
- 2026-10-28: `/problems` is intentionally not implemented in this feature; the nav and CTA link to it and will 404 until the problems feature lands.

## Known issues / blockers

## Rules for AI

1. Read this file, then only the _Current_ feature file.
2. Work on one feature at a time, in numeric order.
3. A feature is `[x]` only when all its acceptance criteria pass.
4. After finishing work: update checkboxes, "Last updated", Current/Next.
5. Log non-obvious decisions under Decisions; don't rewrite history.
6. Dont build out-of-scope ideas.
