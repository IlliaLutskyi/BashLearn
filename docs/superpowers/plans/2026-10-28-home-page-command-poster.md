# Home Page Command Poster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the centered hero and three benefit cards with the approved dark command-poster home page.

**Architecture:** The home page becomes a dark hero band with a static example terminal panel, an overlapping light lesson-preview card, and a three-step rail. The shared `(app)` header becomes the same dark brand surface. New `--hero-*` and `--success` tokens plus Geist Mono carry the look; no data, routing, auth, or terminal behavior changes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn tokens, Motion (`motion/react`), lucide-react, Clerk (header state only).

**Spec:** `docs/superpowers/specs/2026-10-28-home-page-command-poster-design.md`

## Global Constraints

- Work on the current `feature/add-home-page` branch. Do not create a worktree for this presentational change unless the user asks.
- The working tree already contains `D context/features/01-add-clerk.md` and `D context/features/02-add-auth-ui.md`. Do not stage or restore those files. Use explicit `git add <paths>` for every commit; never `git add -A` or `git add .`.
- Style with Tailwind utilities and `cn()` from `@/lib/utils`; theme values live in `app/globals.css`. Do not edit anything in `components/ui/`.
- Server Components by default. `"use client"` belongs only in `components/home/HomeHero.tsx` (Motion). The header shell, lesson preview, and step rail are server components.
- The terminal is static. Keep the visible labels “Product preview · static”, “example session”, and “Illustrative preview — the terminal isn't live yet.” No inputs, click handlers, blinking carets, or fake routes. The example panel must be labeled as an example.
- Primary CTA stays `Start with the basics` → `/problems`; that route still 404s until the problems feature ships. Secondary action is `How it works` → `#how-it-works`.
- Auth pages are unaffected. The header is dark only because it lives in the `(app)` layout; do not change the `(auth)` layout.
- No new dependencies and no Vitest setup. This is a presentational change; the repo has no test runner and the project testing rules target pure logic. Verification is lint, typegen, type-check, production build, and the visual/accessibility checks below.
- Use the exact copy from the spec. The design values below are the source of truth for tokens and layout.

### Design values

Light tokens:

```css
--hero: hsl(199 72% 14%);
--hero-deep: hsl(199 78% 10%);
--hero-foreground: hsl(204 100% 97%);
--hero-muted: hsl(202 26% 72%);
--hero-border: hsl(200 30% 27%);
--hero-accent: hsl(190 100% 68%);
--success: hsl(160 84% 28%);
```

Dark tokens:

```css
--hero: hsl(199 60% 8%);
--hero-deep: hsl(199 65% 6%);
--hero-foreground: hsl(204 100% 97%);
--hero-muted: hsl(202 20% 68%);
--hero-border: hsl(200 24% 20%);
--hero-accent: hsl(190 100% 70%);
--success: hsl(158 64% 55%);
```

Font: Geist Mono from `next/font/google`, variable `--font-geist-mono`.
`--font-mono` value: `var(--font-geist-mono, "Fira Code"), "JetBrains Mono", ui-monospace, monospace;`

## Review Focus

These are the failure modes the spec implies but no automated test will catch. Each is checked in the owning task's verification step.

1. **Mobile overflow:** at 390px and 320px, the hero grid, command panel, and negative-margin preview card must not create horizontal scroll or collide with the CTA.
2. **Dark mode:** the hero and header must stay dark in `.dark`; the preview card, terminal, chip, success text, and CTA must remain legible.
3. **Static-preview honesty:** the chip and footnote must be visible, the hero panel must say “example session”, and there must be no blinking caret or interactive affordance.
4. **Accessibility and contrast:** hero muted text, the cyan CTA with dark text, success text, the accent chip, and header links/buttons must meet AA; focus rings must be visible on the dark surfaces; heading order and reduced-motion/no-JS content must work.
5. **Header/hero seam and anchor offset:** the opaque dark header must blend with the band without a light strip; `#how-it-works` must land below the 64px sticky header.

---

## Pre-flight

- [ ] Commit the design and plan before implementation:

```bash
git add docs/superpowers/specs/2026-10-28-home-page-command-poster-design.md docs/superpowers/plans/2026-10-28-home-page-command-poster.md
git commit -m "docs: add home page command poster design and plan"
```

Do not stage the deleted `context/features/*` files.

---

## Task 1: Dark Brand Surface, Geist Mono, and Header

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Rename: `components/site-header-motion.tsx` → `components/SiteHeaderShell.tsx`
- Modify: `components/SiteHeader.tsx`
- Test: none (presentational; see Global Constraints)

**Interfaces:**
- Consumes: existing `cn`, `buttonVariants`, Clerk `Show`, `SignInButton`, `UserButton`.
- Produces: Tailwind utilities `bg-hero`, `bg-hero-deep`, `bg-hero-accent`, `text-hero`, `text-hero-foreground`, `text-hero-muted`, `text-hero-accent`, `border-hero-border`, `text-success`, `bg-success/10`, and `font-mono` resolving to Geist Mono.
- `SiteHeaderShell({ children })` is a server component with the same `children` API. `SiteHeader` keeps its current public API (no props).

- [ ] **Step 1: Add the hero and success tokens to `app/globals.css`**

Add the light values to `:root` after `--sidebar-ring`. Add the dark values to `.dark` after its `--sidebar-ring`. Add the mappings to `@theme inline` after `--color-sidebar-ring`:

```css
--color-hero: var(--hero);
--color-hero-deep: var(--hero-deep);
--color-hero-foreground: var(--hero-foreground);
--color-hero-muted: var(--hero-muted);
--color-hero-border: var(--hero-border);
--color-hero-accent: var(--hero-accent);
--color-success: var(--success);
```

Use the exact token values from **Design values** above.

- [ ] **Step 2: Switch `--font-mono` to Geist Mono**

In both `:root` and `.dark`, replace the current `Fira Code, JetBrains Mono, monospace` value with:

```css
var(--font-geist-mono, "Fira Code"), "JetBrains Mono", ui-monospace, monospace;
```

Leave the `@theme inline` `--font-mono: var(--font-mono)` mapping in place.

- [ ] **Step 3: Load Geist Mono in `app/layout.tsx`**

Change the font import to `import { Geist, Geist_Mono } from "next/font/google";`. Add:

```ts
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
```

Add `geistMono.variable` to the `<html>` className alongside `geist.variable`. Do not change the Clerk provider or metadata.

- [ ] **Step 4: Make the sticky header a static dark brand bar**

Rename the shell and remove its Motion entrance. A dark bar that fades in over the light body flashes; the hero carries the only entrance animation.

```bash
git mv components/site-header-motion.tsx components/SiteHeaderShell.tsx
```

Replace the file contents with a server component:

```tsx
import type { ReactNode } from "react";

export function SiteHeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-hero-border/80 bg-hero">
      {children}
    </header>
  );
}
```

In `components/SiteHeader.tsx`, import and use `SiteHeaderShell` instead of `SiteHeaderMotion`. Do not keep the `"use client"` directive, `motion`, or `useReducedMotion`. The bar is deliberately opaque: no `backdrop-blur`, no `supports-[backdrop-filter]`, and no entrance animation.

- [ ] **Step 5: Restyle the header contents**

In `components/SiteHeader.tsx`:

- Logo link: keep the rounded focus target, change the focus ring to `focus-visible:ring-hero-accent/60`.
- Logo mark: `bg-hero-accent text-hero shadow-sm`; remove the `group`/`group-hover:-rotate-3` and `transition-transform` classes.
- Wordmark: `text-hero-foreground`.
- “Problems” link: `text-hero-muted hover:text-hero-foreground focus-visible:ring-hero-accent/60`.
- Suspense fallback: `bg-hero-border/60`.
- Signed-out button: `buttonVariants({ variant: "outline", size: "lg" })` plus:

```text
h-9 border-hero-border bg-transparent px-4 text-hero-foreground hover:bg-hero-deep hover:text-hero-foreground focus-visible:ring-hero-accent/60 dark:border-hero-border dark:bg-transparent dark:hover:bg-hero-deep
```

Keep the `Suspense`, `Show when="signed-out"`, `Show when="signed-in"`, and `UserButton` structure unchanged. Do not restyle Clerk internals.

- [ ] **Step 6: Run the static checks**

Run: `bun run lint`
Expected: PASS.

Run: `bunx next typegen`
Expected: PASS.

Run: `bunx tsc --noEmit`
Expected: PASS.

If `tsc` fails on `lib/prisma.ts` because `generated/prisma` is missing, run `bun run db:generate` and retry. If the generated route types are stale, delete `.next/dev/types` and `.next/types`, run `bunx next typegen`, and retry.

- [ ] **Step 7: Verify the header visually**

Run `bun run dev` and open `/`. At 1440px and 390px:

- The header is a solid dark bar with a white wordmark and muted nav, dark immediately at load; no flash or light strip.
- The sign-in button is outlined and legible; focus it with the keyboard and confirm a visible cyan ring.
- Scroll the page: the header stays dark and opaque.
- Add `class="dark"` to `<html>` in devtools and repeat: the header stays dark and the text stays legible.
- If a Clerk session exists, confirm the `UserButton` is visible on the dark bar. If not, do not create an account; note the existing unverified signed-in issue.

- [ ] **Step 8: Commit Task 1**

```bash
git add app/globals.css app/layout.tsx components/SiteHeaderShell.tsx components/SiteHeader.tsx
git commit -m "feat: add dark brand header surface"
```

The `git mv` in Step 4 already staged the old file's deletion. Do not stage the deleted `context/features/*` files.

---

## Task 2: Command Hero and Example Panel

**Files:**
- Create: `components/home/CommandPanel.tsx`
- Modify: `components/home/HomeHero.tsx` (replace its contents)
- Test: none (presentational)

**Interfaces:**
- Consumes: the `hero` color utilities, `buttonVariants`, `Link`, `ArrowDown`, `ArrowRight`, Motion.
- Produces: `CommandPanel()` with no props; `HomeHero()` with no props. `HomeHero` remains the client boundary (`"use client"`).

- [ ] **Step 1: Create the static example terminal panel**

Create `components/home/CommandPanel.tsx` with a single named export `CommandPanel()` that returns a `<figure>`. The figure contains:

- A panel `<div>` with `overflow-hidden rounded-xl border border-hero-border bg-hero-deep shadow-2xl`.
- A top bar: `flex items-center justify-between border-b border-hero-border/70 px-4 py-2 font-mono text-[0.7rem] text-hero-muted`; left `learner@bashlearn`, right `example session`.
- A body: `space-y-1.5 p-5 font-mono text-sm leading-relaxed`.
  - `$` in `text-hero-accent`, then `ls`.
  - Output `notes.txt  projects` in `text-hero-muted`.
  - A prompt with a static block caret: `<span className="inline-block h-4 w-2 bg-hero-accent align-middle" aria-hidden="true" />`. Do not animate it.
- A footer: `border-t border-hero-border/70 px-4 py-2 font-mono text-[0.7rem] text-hero-muted` with `Every task is checked. No guessing.`
- A `<figcaption className="sr-only">Example terminal session showing the ls command and its output.</figcaption>`.

No `"use client"`, no state, no inputs, no click handlers.

- [ ] **Step 2: Replace `components/home/HomeHero.tsx`**

Keep `"use client"`. Replace the old centered hero with the dark band:

- Section: `relative isolate overflow-hidden bg-hero text-hero-foreground`, `aria-labelledby="hero-heading"`.
- Decorative 48px grid: an absolutely positioned `aria-hidden` div with `pointer-events-none absolute inset-0 opacity-30` and a Tailwind arbitrary background image of two linear gradients using `var(--hero-border)`, `bg-[size:3rem_3rem]`. Use the two-axis grid; no glow. If Tailwind rejects the `bg-[size:...]` form, use `[background-size:3rem_3rem]`; the 48px grid is the requirement.
- Motion container: `motion.div` with `initial="hidden" animate="visible" variants={container}` and:
  `relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-36 lg:pt-24`
- Copy column: `max-w-xl`; make the eyebrow, `h1`, subhead, actions wrapper, and fine print `motion.*` elements with `variants={heroItem}`.
  - Eyebrow: `font-mono text-xs font-medium uppercase tracking-[0.16em] text-hero-accent`, copy `A hands-on Linux course`.
  - `h1` with `id="hero-heading"`, classes `mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-balance sm:text-5xl lg:text-[3.25rem]`. Use three block spans:
    - `Stop reading`
    - `about the terminal.`
    - `Start using it.` in `text-hero-accent`.
  - Subhead: `mt-5 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg`; copy `Short lessons, then real commands in a safe browser terminal. No setup, no risk — just practice that sticks.`
  - Actions: `mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6`.
    - Primary `<Link href="/problems">` with `buttonVariants({ size: "lg" })` and:
      `group h-11 bg-hero-accent px-5 text-sm font-semibold text-hero hover:bg-hero-accent/90 focus-visible:ring-hero-foreground/60 motion-reduce:transform-none!`
      Add `Start with the basics` and `<ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5 motion-reduce:transform-none!" aria-hidden="true" />`.
    - Secondary `<Link href="#how-it-works">` with `group inline-flex items-center gap-2 rounded-md text-sm font-medium text-hero-foreground underline-offset-4 hover:text-hero-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent/60`, `How it works`, and `<ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transform-none!" aria-hidden="true" />`.
  - Fine print: `mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-hero-muted` with `No install`, `Runs in your browser`, `Instant feedback`; separators are `<span aria-hidden="true">·</span>`.
- Command panel column: `<motion.div variants={heroItem} className="w-full max-w-md lg:justify-self-end"><CommandPanel /></motion.div>`.
- Motion variants: use `container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }`; normal `heroItem = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: \"easeOut\" } } }`; reduced `{ hidden: { opacity: 0, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0 } } }`. Add the existing `motion-reduce:transform-none! motion-reduce:opacity-100! [@media(scripting:none)]:transform-none! [@media(scripting:none)]:opacity-100!` classes to every motion element carrying an entrance variant.
- Accessibility: the grid layer, arrows, and static caret are `aria-hidden`; the `CommandPanel` figure owns the sr-only caption; the section is labeled by the `h1`.

- [ ] **Step 3: Run the static checks**

Run `bun run lint`, `bunx next typegen`, and `bunx tsc --noEmit`. All must pass. Apply the same Prisma/stale-route-type fixes from Task 1 if needed.

- [ ] **Step 4: Verify the hero**

Run `bun run dev` and open `/`. The old benefit grid is still below the hero until Task 3; that is expected.

- 1440px: the headline is three lines, the command panel is on the right, and the CTA is clearly the brightest element.
- 390px and 320px: the copy stacks above the panel; the panel fits; no horizontal scroll.
- Emulate `prefers-reduced-motion: reduce` and reload: the content is visible without movement.
- Disable JavaScript and reload: the hero copy and example panel remain visible (the Clerk header control may not render).
- Confirm the panel says “example session”; there is no blinking caret or interactive affordance.

- [ ] **Step 5: Commit Task 2**

```bash
git add components/home/HomeHero.tsx components/home/CommandPanel.tsx
git commit -m "feat: rebuild home hero as command poster"
```

---

## Task 3: Static Lesson Preview, Step Rail, and Page Composition

**Files:**
- Create: `components/home/LessonPreview.tsx`
- Create: `components/home/StepRail.tsx`
- Modify: `app/(app)/page.tsx`
- Delete: `components/home/benefit-grid.tsx`
- Test: none (presentational)

**Interfaces:**
- Consumes: `HomeHero` from Task 2, the `success`/`accent` tokens, lucide `Check`.
- Produces: `LessonPreview()` with no props; `StepRail()` with no props; the final home page composition.

- [ ] **Step 1: Create the static lesson preview card**

Create `components/home/LessonPreview.tsx` with a named export `LessonPreview()` returning a `<section aria-labelledby="lesson-preview-title">` with:

- Card: `rounded-xl border border-border bg-card p-5 shadow-xl sm:p-6`.
- Top row: `flex flex-wrap items-center justify-between gap-3`.
  - Chip: `inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-accent-foreground`; a `size-1.5 rounded-full bg-current` dot with `aria-hidden`; text `Product preview · static`.
  - Right label: `font-mono text-xs text-muted-foreground`, text `Sample lesson`.
- Grid: `mt-5 grid gap-6 md:grid-cols-2 md:items-start`.
  - Left:
    - `<h2 id="lesson-preview-title" className="text-xl font-semibold tracking-tight sm:text-2xl">Find your way around</h2>`.
    - Body: `mt-2 text-sm leading-relaxed text-muted-foreground`; `Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground">pwd</code> to print the directory you're currently working in.`
    - Result: `mt-4 flex items-start gap-2 text-sm text-muted-foreground`; icon circle `mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success` with `<Check className="size-3.5" aria-hidden="true" />`; text `<strong className="font-medium text-success">Task passed.</strong> You're in the right directory.`
  - Right: terminal panel `overflow-hidden rounded-lg border border-border bg-hero-deep`.
    - Top bar: `flex items-center justify-between border-b border-hero-border/70 px-3 py-2 font-mono text-[0.7rem] text-hero-muted`; left `bashlearn · terminal`, right `example`.
    - Body: `space-y-1 p-4 font-mono text-sm leading-relaxed`; `$` accent + `pwd`; output `text-hero-muted` `/home/learner`; prompt with the same static block caret, `aria-hidden`.
- Footnote: `mt-5 border-t border-border pt-3 text-xs text-muted-foreground`, text `Illustrative preview — the terminal isn't live yet.`

No `"use client"`, no state, no input, no animation.

- [ ] **Step 2: Create the step rail**

Create `components/home/StepRail.tsx` with:

```ts
const STEPS = [
  { number: "01", title: "Read the lesson", description: "One command at a time, with real examples." },
  { number: "02", title: "Run the command", description: "Practice in a terminal that runs in your browser." },
  { number: "03", title: "Get it checked", description: "Instant feedback on the result, not the keystrokes." },
] as const;
```

Render a `<section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-24 pt-10 sm:pt-12">`:

- Heading row: `flex items-center gap-4`; `h2` `font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground` with `How it works`; a `h-px flex-1 bg-border` rule with `aria-hidden`.
- `ol` `mt-6 grid gap-6 sm:grid-cols-3 sm:gap-0`.
- Each `li`: `flex gap-3 border-t border-border pt-5 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0`.
- Number: `font-mono text-xs text-accent-foreground`; title `text-sm font-semibold`; description `mt-1 text-sm leading-relaxed text-muted-foreground`.

Use `key={step.number}`. The section is a server component.

- [ ] **Step 3: Recompose the home page**

Replace `app/(app)/page.tsx` with:

```tsx
import { HomeHero } from "@/components/home/HomeHero";
import { LessonPreview } from "@/components/home/LessonPreview";
import { StepRail } from "@/components/home/StepRail";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHero />
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:-mt-24">
        <LessonPreview />
        <StepRail />
      </div>
    </div>
  );
}
```

Remove the old blur blob divs, the old max-w-6xl wrapper, and the `BenefitGrid` import.

- [ ] **Step 4: Delete the old benefit grid**

Delete and stage the old grid:

```bash
git rm components/home/benefit-grid.tsx
```

Do not delete any other home component.

- [ ] **Step 5: Run the static checks**

Run `bun run lint`, `bunx next typegen`, and `bunx tsc --noEmit`. All must pass. Apply the same Prisma/stale-route-type fixes from Task 1 if needed.

- [ ] **Step 6: Verify the full page**

Run `bun run dev` and check `/` at 1440px, 390px, and 320px in light and dark mode:

- The preview card overlaps the dark band; the overlap does not collide with the CTA or command panel.
- No horizontal scrollbar; `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- The chip “Product preview · static”, the footnote, and “example session” are visible.
- The lesson title, `pwd` code, check row, and terminal are legible in both themes.
- The step rail stacks on mobile and shows three columns at `sm`; the heading rule is visible.
- Click “How it works”: the heading lands below the sticky header, not under it.
- Emulate reduced motion and disable JavaScript: the hero and preview content remain visible.
- Confirm no blinking caret, no input, and no click handler in the preview components.

- [ ] **Step 7: Commit Task 3**

```bash
git add "app/(app)/page.tsx" components/home/LessonPreview.tsx components/home/StepRail.tsx
git commit -m "feat: add static lesson preview and step rail"
```

The `git rm` in Step 4 already staged the `benefit-grid.tsx` deletion. Do not stage the deleted `context/features/*` files.

---

## Task 4: Final Verification and Context

**Files:**
- Modify: `context/progress.md`
- Modify: `context/todos.md`
- Modify: `context/known-issues.md`
- Test: full verification matrix below

**Interfaces:**
- Consumes: the finished home page from Tasks 1–3.
- Produces: updated project status and known issues; no code changes.

- [ ] **Step 1: Run lint**

Run: `bun run lint`
Expected: PASS with no errors or warnings introduced by this feature.

- [ ] **Step 2: Run type generation and type-check**

Run: `bunx next typegen`
Expected: PASS.

Run: `bunx tsc --noEmit`
Expected: PASS.

If `lib/prisma.ts` fails because `generated/prisma` is missing, run `bun run db:generate` and retry. If stale `.next` route types fail, delete `.next/dev/types` and `.next/types`, run `bunx next typegen`, and retry.

- [ ] **Step 3: Run the production build**

Run: `bun run build`
Expected: PASS. If it fails because `generated/prisma` is missing, run `bun run db:generate` and retry. If it fails on missing Clerk/environment values, report the exact error; do not add a workaround.

- [ ] **Step 4: Run the visual and accessibility matrix**

Use `bun run dev` and a browser:

- 1440px, 390px, 320px; light and dark (`.dark` on `<html>`).
- Signed-out header; signed-in `UserButton` only if a session already exists.
- Reduced motion via devtools; JavaScript disabled.
- Keyboard: tab through the logo, Problems, Sign in, hero CTA, “How it works”; all focus rings visible.
- Heading order: one `h1` (hero), then the preview `h2` and the “How it works” `h2`; no skipped levels.
- Anchor: click “How it works”; the heading is not covered by the sticky header.
- Overflow: `document.documentElement.scrollWidth === document.documentElement.clientWidth` at every width.
- Static honesty: the chip, footnote, and “example session” are visible; no blinking caret, inputs, or click handlers in the preview components.
- Contrast, at minimum: `text-hero-muted` on `bg-hero` and `bg-hero-deep`; `text-hero` on `bg-hero-accent`; `text-success` on `bg-card`; `text-accent-foreground` on `bg-accent` and `bg-background` (step numbers); `text-muted-foreground` on `bg-background` and `bg-card`; header nav on `bg-hero`. Target AA: 4.5:1 for normal text, 3:1 for large text/UI. If any pair fails, adjust the token, not the copy.

- [ ] **Step 5: Update `context/progress.md`**

Set `Last updated: 2026-10-28` if needed. Update the existing home-page Done entry so it no longer claims the page is “one-screen” (the command poster is taller), then add a new Done entry:

```text
- Home page + navigation — public landing page with BashLearn header, Problems link, Clerk auth state, and entrance animations.
- Home page command poster — dark hero with a labeled static command preview, overlapping lesson preview, step rail, and dark site header.
```

Add dated Decisions entries without deleting the old centered-hero decision:

```text
- 2026-10-28: The home page now uses the command-poster direction: a dark hero with a real `ls` example, a static lesson preview labeled “Product preview · static”, and a 3-step rail. This supersedes the earlier centered hero + 3-card layout.
- 2026-10-28: A terminal-led preview was previously rejected as misleading. It is now used only as an explicitly labeled, non-interactive illustration with a footnote; no fake terminal behavior.
- 2026-10-28: The shared `(app)` header is a static, opaque dark brand bar that merges with the home hero. The previous Motion fade was removed because a dark bar fading in over the light body flashes. Auth pages remain header-free.
- 2026-10-28: Added `--hero-*` and `--success` tokens plus Geist Mono. The hero CTA uses `bg-hero-accent text-hero` for contrast; `/problems` still 404s until that feature ships.
```

Add a Known issues entry:

```text
- The home page hero panel and lesson preview are static illustrations. They are not wired to the sandbox and must stay visibly labeled until the problems/terminal flow ships.
```

Update `Current feature`/`Up next` only if the project status requires it; do not invent a new active feature. Leave `None` if nothing is in progress.

- [ ] **Step 6: Update `context/todos.md` and `context/known-issues.md`**

Add a Done item to `context/todos.md`:

```text
- [x] Home page command poster (plan dated 2026-10-28)
```

Add the static-preview note to `context/known-issues.md`. Keep the existing `/problems` 404 note and the signed-in header-unverified note.

- [ ] **Step 7: Commit Task 4**

```bash
git add context/progress.md context/todos.md context/known-issues.md
git commit -m "docs: record home page command poster"
```

Do not stage the pre-existing deleted `context/features/*` files.

- [ ] **Step 8: Report**

Report the exact results of lint, typegen, type-check, and build; list any remaining known issues (the `/problems` 404, the unverified signed-in header if still applicable, and the static-preview note). Do not claim the feature is complete if any check failed.

---
