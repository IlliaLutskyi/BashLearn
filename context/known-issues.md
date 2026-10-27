# Known issues

- The Clerk application is accountless and unclaimed; development keys are temporary. Run `bunx clerk@latest auth login` from the repo root to claim it.
- `bunx clerk@latest init` without `-y` hung at the confirmation step in this non-interactive shell. Re-running with `bunx clerk@latest init -y --no-skills` completed the scaffold.
- The Clerk CLI's `.env` parser splits on `\n` only. A `.env.local` with CRLF line endings makes every line look like a comment, so `clerk doctor` reports the keys as missing. Keep `.env.local` on LF.
- The first sign-up/sign-in browser flow has not been verified; the user needs to create the first account.
- `bunx tsc --noEmit` cannot resolve the generated `LayoutProps` type until `bunx next typegen` (or `next build`) runs.
- `generated/prisma` is gitignored and must be created with `bun run db:generate` before type-checking `lib/prisma.ts`.
