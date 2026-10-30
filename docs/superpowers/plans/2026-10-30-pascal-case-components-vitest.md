# PascalCase Components + Vitest Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename all hand-written React component files to PascalCase (matching their exported identifiers), update every importer, sweep docs for old paths, and wire up Vitest per the Next.js testing guide — with no new tests written.

**Architecture:** Mechanical `git mv` renames of 8 component files grouped by folder (home, root/site, auth), each followed by exact import-specifier updates and typecheck gating. Vitest arrives as tooling-first setup: dependencies, `vitest.config.mts`, and `test`/`typecheck` scripts land before the renames so every rename task verifies with the same commands.

**Tech Stack:** Next.js 16.4.3, React 19.3, TypeScript 5, bun 1.4.3, Vitest (latest) + `@vitejs/plugin-react` + `vite-tsconfig-paths`, jsdom, Testing Library (installed, unused this pass).

**Spec:** No spec doc on disk. Spec of record: the 2026-10-30 decision session (user answered Q1–Q13), distilled into **Global Constraints** below. When execution begins, first copy this plan to `docs/superpowers/plans/2026-10-30-pascal-case-components-vitest.md` per repo convention.

## Global Constraints

- Package manager is **bun**: installs via `bun add --dev ...`, scripts via `bun run <script>`; ad-hoc CLIs via `bunx`.
- Environment is **Windows (case-insensitive filesystem) with PowerShell**. Always `git mv` (never plain rename) so history follows the files.
- Rename exactly these 8 files; target name = PascalCase form of the exported component identifier:

| Old path | New path |
|---|---|
| `components/home/home-hero.tsx` | `components/home/HomeHero.tsx` |
| `components/home/lesson-preview.tsx` | `components/home/LessonPreview.tsx` |
| `components/home/step-rail.tsx` | `components/home/StepRail.tsx` |
| `components/home/command-panel.tsx` | `components/home/CommandPanel.tsx` |
| `components/site-header.tsx` | `components/SiteHeader.tsx` |
| `components/site-header-shell.tsx` | `components/SiteHeaderShell.tsx` |
| `components/auth/auth-aside.tsx` | `components/auth/AuthAside.tsx` |
| `components/auth/welcome-heading.tsx` | `components/auth/WelcomeHeading.tsx` |

- Components live in **`components/ui/` untouched** (`ui/button.tsx` stays kebab; shadcn's `components.json` with `"ui": "@/components/ui"` manages that folder — decision Q7).
- **No `app/**` route files are renamed**: `page.tsx` and `layout.tsx` names are App-Router conventions (decision Q3).
- Component/function/export **names and bodies do not change** — files and import specifiers only.
- Docs sweep scope: literal path references to renamed files across `docs/` and `context/` (including illustrative import snippets). References to non-renamed files (`components/ui/button.tsx`) and deleted files (`benefit-grid.tsx`) stay as-is (decision Q11).
- **No new unit tests this pass** (decision Q6). First test ships with the next feature, placed in root `__tests__/` (decision Q9).
- Verification depth: `bun run lint` + `bun run typecheck` + `bunx vitest run --passWithNoTests`. **Do not run `next build`** (decision Q10).
- Package installs: `bun add --dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths` (latest versions; decision Q4).

## Review Focus

- **Case-mismatch imports:** On NTFS, `import ... from "@/components/home/home-hero"` resolves to `HomeHero.tsx` silently and breaks on case-sensitive CI — behavior a reasonable person expects: zero uppercase/lowercase drift after this plan. *Pinned by:* the red/green `bun run typecheck` gates in Tasks 2–3 (TS1149 "differs only in casing" or "Cannot find module").
- **The one relative import:** `components/auth/auth-aside.tsx:1` imports `"./welcome-heading"` — not `@/`-style, easily missed. *Pinned by:* Task 3 Step 3 (explicit replacement) + Task 3 Step 4 green typecheck.
- **Substring mangling:** `components/site-header` is a substring of `components/site-header-shell`; a broad replace before the shell line corrupts it to `components/SiteHeader-shell`. *Pinned by:* Task 4 Step 2 replacement **order** + Task 4 Step 3 zero-hit grep.
- **Vitest config load failure:** a typo'd plugin/env silently breaks future test runs. *Pinned by:* Task 1 Step 5 smoke run exiting 0.
- **Prose corruption in docs:** hyphen tokens like "site-header" appearing in prose must not be rewritten as components. *Pinned by:* Task 4 Step 3 expected-zero-grep plus human eyeball — only hyphenated path tokens may change, prose ("site header", "step rail") must remain untouched.

---

### Task 1: Vitest tooling setup

**Files:**
- Modify: `package.json` (devDependencies via bun; scripts)
- Create: `vitest.config.mts`
- Modify: `bun.lock` (via `bun add`)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `bun run typecheck` (≈ `tsc --noEmit`), `bun run test` (≈ `vitest`, watch), root `__tests__/` convention implicitly accepted by Vitest's default include glob. All later tasks gate on `bun run typecheck`.

- [x] **Step 1: Copy this plan into the repo per convention**

Copy `C:\Users\axax0\.opencode\plan\2026-10-30-pascal-case-components-vitest.md` to `docs/superpowers/plans/2026-10-30-pascal-case-components-vitest.md` and work through that copy (checkbox updates land in the repo copy).

- [x] **Step 2: Install dev dependencies**

Run: `bun add --dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths`
Expected: install succeeds, exit 0; `package.json` gains the six devDependencies; `bun.lock` updated.

- [x] **Step 3: Create `vitest.config.mts`** with exactly this content (Next.js guide, TypeScript section):

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})
```

- [x] **Step 4: Add scripts to `package.json`**

After `"start": "next start",` add exactly:

```json
"test": "vitest",
"typecheck": "tsc --noEmit",
```

Note: `vitest.config.mts` is executed by Vitest, not part of the tsconfig project; do not add it to tsconfig `include`.

- [x] **Step 5: Smoke the toolchain**

Run: `bunx vitest run --passWithNoTests`
Expected: exit code 0; "No test files found" (or similar) is acceptable; **no plugin-load or config errors**.

Run: `bun run typecheck`
Expected: exit 0 (unchanged codebase — baseline green on `next-env.d.ts`, `tsconfig.json` types).

- [x] **Step 6: Commit**

```powershell
git add package.json bun.lock vitest.config.mts
git commit -m "chore: set up vitest with react, jsdom, and tsconfig paths"
```

---

### Task 2: Rename home components to PascalCase

**Files:**
- Rename: `components/home/home-hero.tsx` → `components/home/HomeHero.tsx`
- Rename: `components/home/lesson-preview.tsx` → `components/home/LessonPreview.tsx`
- Rename: `components/home/step-rail.tsx` → `components/home/StepRail.tsx`
- Rename: `components/home/command-panel.tsx` → `components/home/CommandPanel.tsx`
- Modify: `app/(app)/page.tsx:1-3` (3 import specifiers)
- Modify: `components/home/HomeHero.tsx` (after rename; 1 import specifier)

**Interfaces:**
- Consumes: `bun run typecheck` and `bunx vitest run --passWithNoTests` from Task 1.
- Produces: `@/components/home/HomeHero`, `@/components/home/LessonPreview`, `@/components/home/StepRail`, `@/components/home/CommandPanel` as the four canonical module specifiers. Exports `HomeHero`, `LessonPreview`, `StepRail`, `CommandPanel` unchanged.

- [x] **Step 1: Rename the four files**

```powershell
git mv components/home/home-hero.tsx components/home/HomeHero.tsx
git mv components/home/lesson-preview.tsx components/home/LessonPreview.tsx
git mv components/home/step-rail.tsx components/home/StepRail.tsx
git mv components/home/command-panel.tsx components/home/CommandPanel.tsx
```

(If `git mv` refuses a case-only rename, retry the same command with `-f`.)

- [x] **Step 2: Run typecheck to verify it fails**

Run: `bun run typecheck`
Expected: FAIL (non-zero exit) with TS1149/casing or cannot-find-module errors naming `home-hero` / `lesson-preview` / `step-rail` / `command-panel`. On the case-insensitive Windows FS it is also acceptable that resolution silently succeeds with exit 0 — record the output either way and continue; the gate that matters is Step 4.

- [x] **Step 3: Update the import specifiers**

In `app/(app)/page.tsx` replace, exactly:

```tsx
import { HomeHero } from "@/components/home/HomeHero";
import { LessonPreview } from "@/components/home/LessonPreview";
import { StepRail } from "@/components/home/StepRail";
```

In `components/home/HomeHero.tsx` replace, exactly:

```tsx
import { CommandPanel } from "@/components/home/CommandPanel";
```

Do not touch the `@/components/ui/button` import in this file.

- [x] **Step 4: Run typecheck to verify it passes**

Run: `bun run typecheck`
Expected: exit 0.

- [x] **Step 5: Lint**

Run: `bun run lint`
Expected: no errors.

- [x] **Step 6: Commit**

```powershell
git add "app/(app)/page.tsx" components/home
git commit -m "refactor: rename home components to PascalCase"
```

---

### Task 3: Rename site-header and auth components to PascalCase

**Files:**
- Rename: `components/site-header.tsx` → `components/SiteHeader.tsx`
- Rename: `components/site-header-shell.tsx` → `components/SiteHeaderShell.tsx`
- Rename: `components/auth/auth-aside.tsx` → `components/auth/AuthAside.tsx`
- Rename: `components/auth/welcome-heading.tsx` → `components/auth/WelcomeHeading.tsx`
- Modify: `app/(app)/layout.tsx:1` (1 specifier)
- Modify: `app/(auth)/layout.tsx:3-4` (2 specifiers)
- Modify: `components/site-header.tsx` (after rename; 1 specifier — **the `-shell` one**)
- Modify: `components/auth/auth-aside.tsx` (after rename; 1 **relative** specifier)

**Interfaces:**
- Consumes: `@/components/ui/button` (unchanged import inside `SiteHeader.tsx`).
- Produces: `@/components/SiteHeader`, `@/components/SiteHeaderShell`, `@/components/auth/AuthAside`, `@/components/auth/WelcomeHeading` as canonical specifiers. Exports unchanged. Together with Task 2, all hand-written components are PascalCase; **`components/ui` stays kebab**.

- [x] **Step 1: Rename the four files**

```powershell
git mv components/site-header-shell.tsx components/SiteHeaderShell.tsx
git mv components/site-header.tsx components/SiteHeader.tsx
git mv components/auth/auth-aside.tsx components/auth/AuthAside.tsx
git mv components/auth/welcome-heading.tsx components/auth/WelcomeHeading.tsx
```

- [x] **Step 2: Run typecheck to verify it fails**

Run: `bun run typecheck`
Expected: FAIL with errors referencing `site-header` / `site-header-shell` / `auth-aside` / `welcome-heading` (same Windows case-insensitivity caveat as Task 2).

- [x] **Step 3: Update the import specifiers**

In `app/(app)/layout.tsx` replace, exactly:

```tsx
import { SiteHeader } from "@/components/SiteHeader";
```

In `app/(auth)/layout.tsx` replace, exactly:

```tsx
import { AuthAside } from "@/components/auth/AuthAside";
import { WelcomeHeading } from "@/components/auth/WelcomeHeading";
```

In `components/SiteHeader.tsx` replace, exactly:

```tsx
import { SiteHeaderShell } from "@/components/SiteHeaderShell";
```

⚠️ Replace the `-shell` specifier **before** glancing at anything else named `site-header` — `"components/site-header-shell"` contains `"components/site-header"` as a substring. These are line-wise exact edits, not a global regex.

In `components/auth/AuthAside.tsx` replace, exactly:

```tsx
import { WelcomeHeading } from "./WelcomeHeading";
```

Leave `components/SiteHeader.tsx`'s `@/components/ui/button` import untouched.

- [x] **Step 4: Run typecheck to verify it passes**

Run: `bun run typecheck`
Expected: exit 0. This green gate is what proves the relative `"./WelcomeHeading"` import was updated (Review Focus line 2).

- [x] **Step 5: Lint**

Run: `bun run lint`
Expected: no errors.

- [x] **Step 6: Commit**

```powershell
git add "app/(app)/layout.tsx" "app/(auth)/layout.tsx" components/SiteHeader.tsx components/SiteHeaderShell.tsx components/auth
git commit -m "refactor: rename site-header and auth components to PascalCase"
```

---

### Task 4: Docs sweep to new file names

**Files:**
- Modify: `docs/superpowers/plans/2026-10-28-home-page-command-poster.md`
- Modify: `docs/superpowers/specs/2026-10-28-home-page-command-poster-design.md`
- Modify: any file under `docs/` or `context/` that discovery (Step 2) shows contains a renamed-file path

**Interfaces:**
- Consumes: the canonical PascalCase module paths produced by Tasks 2–3.
- Produces: docs whose only remaining lowercase-hyphen component tokens are `benefit-grid.tsx` (deleted file — historical) and `components/ui/button.tsx` (intentionally kebab).

- [x] **Step 1: Ordered exact replacements in every affected doc**

Apply as exact-string replacements **in this order** (order is load-bearing; the shell pair first so the shorter token cannot eat it):

1. `components/site-header-shell` → `components/SiteHeaderShell`
2. `components/site-header` → `components/SiteHeader`
3. `components/auth/auth-aside` → `components/auth/AuthAside`
4. `components/auth/welcome-heading` → `components/auth/WelcomeHeading`
5. `components/home/home-hero` → `components/home/HomeHero`
6. `components/home/lesson-preview` → `components/home/LessonPreview`
7. `components/home/step-rail` → `components/home/StepRail`
8. `components/home/command-panel` → `components/home/CommandPanel`

Because the bare directory-prefixed token is the replacement unit, it auto-covers the `@/components/...` snippet form (`"@/components/home/home-hero"` → `"@/components/home/HomeHero"`) and the `.tsx` form (`components/home/home-hero.tsx` → `components/home/HomeHero.tsx`).

Do **not** touch: any `benefit-grid` reference, any `components/ui/button` reference, prose like "site header", "step rail", "home hero" (space-separated).

- [x] **Step 2: Discovery for unmatched forms**

Run: `git grep -nE 'home-hero|command-panel|lesson-preview|step-rail|site-header|auth-aside|welcome-heading' -- docs context`
Expected: any hits must be bare-name forms the ordered list could not cover (e.g. `home-hero.tsx` without the `components/` prefix). Replace each bare `<kebab>.tsx` / `<kebab>` token with its PascalCase equivalent. If no hits remain, skip.

- [x] **Step 3: Final zero-hit check, excluding this plan's own file**

Run: `git grep -nE 'home-hero|command-panel|lesson-preview|step-rail|site-header|auth-aside|welcome-heading' -- docs context ':!docs/superpowers/plans/2026-10-30-pascal-case-components-vitest.md'`
Expected: **no output** (exit 1). The plan file itself is excluded because its rename tables legitimately quote old names.

Human check: `git diff` — confirm changed lines contain only path tokens; prose remained intact.

- [x] **Step 4: Commit**

```powershell
git add docs context
git commit -m "docs: point component references at PascalCase files"
```

---

### Task 5: Full verification + session bookkeeping

**Files:**
- Modify: `context/progress.md` (Done + Decisions)
- Modify: `context/known-issues.md` (two entries)

**Interfaces:**
- Consumes: everything above.
- Produces: session-end context state per `AGENTS.md`.

- [x] **Step 1: Full verification**

```powershell
bun run lint
bun run typecheck
bunx vitest run --passWithNoTests
```

Expected: all three exit 0. (`vitest run` still reports "No test files found" — acceptable; no tests are written this pass.)

- [x] **Step 2: Update `context/progress.md`**

- Add one Done bullet: component files renamed to PascalCase with all importers updated, and Vitest wired per the Next.js guide (config-only, no tests yet).
- Add dated Decisions (2026-10-30): `components/ui/` stays lowercase because shadcn manages that folder; component files now PascalCase matching their exported identifiers; future tests live in root `__tests__/`.
- Leave Current feature: None.

- [x] **Step 3: Update `context/known-issues.md`**

Add both:

1. `AGENTS.md` references `context/conventions.md`, but the file on disk is `context/convensions.md` (misspelled) — rename or re-link whenever the conventions file is next touched.
2. `components/ui/` is intentionally lowercase; shadcn (`components.json`) writes its own filenames there, so a future `shadcn add`/update expects the kebab naming.

- [x] **Step 4: Commit bookkeeping, then checkboxes in the repo copy of this plan**

```powershell
git add context "docs/superpowers/plans/2026-10-30-pascal-case-components-vitest.md"
git commit -m "docs: update context after component rename and vitest setup"
```
