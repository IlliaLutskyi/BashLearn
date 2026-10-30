# Known issues

- The Clerk application is accountless and unclaimed; development keys are temporary. Run `bunx clerk@latest auth login` from the repo root to claim it.
- `bunx clerk@latest init` without `-y` hung at the confirmation step in this non-interactive shell. Re-running with `bunx clerk@latest init -y --no-skills` completed the scaffold.
- The Clerk CLI's `.env` parser splits on `\n` only. A `.env.local` with CRLF line endings makes every line look like a comment, so `clerk doctor` reports the keys as missing. Keep `.env.local` on LF.
- The first sign-up/sign-in browser flow has not been verified; the user needs to create the first account. The signed-in home header state (`UserButton` replacing `Sign in`) is also unverified for the same reason.
- `bunx tsc --noEmit` cannot resolve the generated `LayoutProps` type until `bunx next typegen` (or `next build`) runs.
- `generated/prisma` is gitignored and must be created with `bun run db:generate` before type-checking `lib/prisma.ts`.
- After moving App Router routes, the generated route-type validator can still reference old paths and fail `bunx tsc --noEmit`. Delete `.next/dev/types` and `.next/types` (or the whole `.next`) and re-run `bunx next typegen` before type-checking.
- Site-header convention: pages that need the header live under `app/(app)/`; auth pages live under `app/(auth)/` and intentionally render no header.
- The Clerk shadcn theme needs both `appearance={{ theme: shadcn }}` on `ClerkProvider` and `@import "@clerk/ui/themes/shadcn.css"` in `app/globals.css`. Removing the import drops Tailwind classes that only appear in the Clerk theme.
- The home page and header link to `/problems`, but that route is not built yet. It returns 404 by design until the problems feature ships.
- The home page hero panel and lesson preview are static illustrations. They are not wired to the sandbox and must stay visibly labeled until the problems/terminal flow ships.
- `bunx tsc --noEmit` still requires `bunx next typegen` after route moves; stale `.next` route types can reference deleted paths.
- `AGENTS.md` references `context/conventions.md`; the supporting file was renamed from the misspelled `context/convensions.md`. That rename (plus the AGENTS.md edit and the `context/features/*` deletions) is uncommitted work on this branch — if it never ships, the docs↔file linkage in `AGENTS.md` must be re-linked in whatever commit lands first.
- `components/ui/` is intentionally lowercase; shadcn (`components.json`) writes its own filenames there, so a future `shadcn add`/update expects the kebab naming. Hand-written components elsewhere are PascalCase by design.
