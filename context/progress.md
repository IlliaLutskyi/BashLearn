# Progress

> Source of truth for project status. AI: read this first, then the feature file under "Current". Update it after every completed task.
>
> Last updated: 2026-10-30

## Current feature:

- None

### Done

- `01-add-clerk.md` — Clerk authentication scaffolded with development keys, middleware, provider, and themed auth routes.
- `02-add-auth-ui.md` — Shared `(auth)` route group with themed Clerk sign-in/sign-up pages, static `--sidebar-*`-styled aside, and a header-free layout.
- Home page + navigation — public landing page with BashLearn header, Problems link, Clerk auth state, and entrance animations.
- Home page command poster — dark hero with a labeled static command preview, overlapping lesson preview, step rail, and dark site header.
- Component rename + Vitest setup — hand-written component files renamed to PascalCase with all importers updated (`components/ui/` untouched), and Vitest wired per the Next.js guide (config, deps, `test`/`typecheck` scripts; no tests yet).

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
- 2026-10-28: The home page now uses the command-poster direction: a dark hero with a real `ls` example, a static lesson preview labeled “Product preview · static”, and a 3-step rail. This supersedes the earlier centered hero + 3-card layout.
- 2026-10-28: A terminal-led preview was previously rejected as misleading. It is now used only as an explicitly labeled, non-interactive illustration with a footnote; no fake terminal behavior.
- 2026-10-28: The shared `(app)` header is a static, opaque dark brand bar that merges with the home hero. The previous Motion fade was removed because a dark bar fading in over the light body flashes. Auth pages remain header-free.
- 2026-10-28: Added `--hero-*` and `--success` tokens plus Geist Mono. The hero CTA uses `bg-hero-accent text-hero` for contrast; `/problems` still 404s until that feature ships.
- 2026-10-28: `--accent-foreground` was darkened to 31% in light and lightened to 90% in dark so the “Product preview · static” chip reaches AA (4.74:1 / 4.84:1); the chip is the only consumer besides step numbers.
- 2026-10-28: The hero no longer branches Motion variants on `useReducedMotion`; that caused a hydration mismatch. The existing `motion-reduce:*!` classes keep the reduced-motion state static and visible.
- 2026-10-30: Hand-written component files are PascalCase, matching their exported identifiers; `components/ui/` stays lowercase because shadcn (`components.json`) manages that folder.
- 2026-10-30: Future tests live in root `__tests__/` (Vitest's default include picks them up); tests ship with the next feature, not this pass.

## Known issues / blockers

- The home page hero panel and lesson preview are static illustrations. They are not wired to the sandbox and must stay visibly labeled until the problems/terminal flow ships.

## Rules for AI

1. Read this file, then only the _Current_ feature file.
2. Work on one feature at a time, in numeric order.
3. A feature is `[x]` only when all its acceptance criteria pass.
4. After finishing work: update checkboxes, "Last updated", Current/Next.
5. Log non-obvious decisions under Decisions; don't rewrite history.
6. Dont build out-of-scope ideas.
