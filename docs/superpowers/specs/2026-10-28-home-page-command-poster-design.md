# Home Page Command Poster — Design

**Date:** 2026-10-28
**Status:** Approved
**Feature branch:** `feature/add-home-page`

## Intent

The current home page reads as a generic generated landing page: a centered
badge, a centered headline, one button, three equal icon cards, and blurred
color blobs. Replace it with a product-led page that puts a real command and a
clearly labeled static preview of the lesson/terminal experience on the first
screen.

The page is for beginners deciding whether BashLearn is worth trying. It should
feel like a focused developer tool, not a template.

## Goals

- Make the command line the first thing a visitor sees.
- Show a realistic lesson-and-terminal artifact without pretending it is live.
- Replace the three-card benefit grid with a short, readable process rail.
- Work at 320–1440px, in light and dark mode, with reduced motion and no JS.
- Keep the change presentational: no terminal, routing, data, or auth changes.

## Non-goals

- Building `/problems`, the sandbox, or lesson content.
- Changing the Clerk sign-in/sign-up flow.
- Adding new marketing sections, pricing, testimonials, or a footer.
- Adding a test runner or new dependencies.

## Anti-goals

- An unlabeled mock terminal that looks interactive.
- Centered badge + centered hero + three generic cards.
- Gradient blobs, glow effects, or decorative noise.
- A false curriculum count or invented lesson catalog.

## Approaches Considered

- **A — Workbench split:** copy left, lesson/terminal preview right, thin
  process rail below. Clear and product-led, but closer to the familiar SaaS
  split hero.
- **B — Lesson first:** editorial serif rail with a large lesson sheet. Calm and
  docs-like, but the marketing message becomes secondary and the page can read
  like documentation rather than a product.
- **C — Command poster (chosen):** a dark, type-led hero built around a real
  command, with a static lesson preview breaking into the light below. It has
  the strongest point of view and the most product-specific first screen. The
  risk is heaviness; the overlapping light card, restrained palette, and single
  command keep it grounded.

## Shape

1. **Dark command-poster hero**
   - Mono eyebrow: “A hands-on Linux course”.
   - Left-aligned headline: “Stop reading about the terminal. Start using it.”
     with the last line in hero accent.
   - Subhead: “Short lessons, then real commands in a safe browser terminal. No
     setup, no risk — just practice that sticks.”
   - Primary CTA: “Start with the basics” → `/problems`.
   - Secondary action: “How it works” → `#how-it-works`.
   - Fine print: “No install · Runs in your browser · Instant feedback”.
   - Right: a static example terminal panel labeled “example session”, showing
     `ls` and `notes.txt  projects`.
2. **Static lesson preview card**
   - Overlaps the bottom of the dark band.
   - Chip: “Product preview · static”.
   - Sample lesson: “Find your way around”; `pwd` task; terminal output
     `/home/learner`; “Task passed. You're in the right directory.”
   - Footnote: “Illustrative preview — the terminal isn't live yet.”
3. **How-it-works rail**
   - Mono label “How it works” with a hairline rule.
   - Three steps: Read the lesson → Run the command → Get it checked, with the
     copy from the mockup.

No centered hero, no pill badge, no three-card grid, no blur blobs.

## Visual System

### Typography

- Geist for UI and display.
- Geist Mono for the eyebrow, terminal text, labels, and step numbers.
- Hero headline: 36px mobile, 48px small, 52px large; tracking `-0.045em`;
  line-height `1.03`.
- Hero body: 16px mobile, 18px large.
- Support text and chips: 11–12px mono/sans, uppercase tracking.

### Color tokens

Add a dark brand surface that stays dark in both themes, plus a success token
for the “Task passed” row.

Light:

- `--hero: hsl(199 72% 14%)`
- `--hero-deep: hsl(199 78% 10%)`
- `--hero-foreground: hsl(204 100% 97%)`
- `--hero-muted: hsl(202 26% 72%)`
- `--hero-border: hsl(200 30% 27%)`
- `--hero-accent: hsl(190 100% 68%)`
- `--success: hsl(160 84% 28%)`

Dark:

- `--hero: hsl(199 60% 8%)`
- `--hero-deep: hsl(199 65% 6%)`
- `--hero-foreground: hsl(204 100% 97%)`
- `--hero-muted: hsl(202 20% 68%)`
- `--hero-border: hsl(200 24% 20%)`
- `--hero-accent: hsl(190 100% 70%)`
- `--success: hsl(158 64% 55%)`

Expose them through `@theme inline` as `--color-hero`, `--color-hero-deep`,
`--color-hero-foreground`, `--color-hero-muted`, `--color-hero-border`,
`--color-hero-accent`, and `--color-success`.

### Layout

- Hero content: `max-w-6xl`, two columns at `lg`, 64px gap, 96px top padding,
  144px bottom padding.
- Lower content: `max-w-5xl`, pulled up `-mt-16` mobile and `-mt-24` large, so
  the preview card overlaps the dark band by 64–96px.
- Hero grid: 48px hairline grid using `--hero-border` at low opacity; no glow.
- Command panel: `max-w-md`, `bg-hero-deep`, `border-hero-border`, rounded-xl.
- Preview card: `bg-card`, `border-border`, rounded-xl, `shadow-xl`.
- Step rail: three columns at `sm`, hairline dividers, stacks on mobile.

### Header

The shared `(app)` header becomes a static dark brand bar (`bg-hero`, white
wordmark, muted nav, outlined sign-in). It is opaque, not a glass bar, and
renders immediately so a dark bar never fades in over the light body. It sits
flush with the hero band so the page reads as one dark surface from the top.
Auth pages render no header and are unaffected.

### Motion

- One entrance animation for the hero copy and command panel. The header is
  static; it carries no entrance animation.
- Stagger 80ms; 0.5s ease-out; transform/opacity only.
- No blinking caret, no hover parallax, no scroll animation.
- Respect `prefers-reduced-motion`; the existing no-JS fallbacks must keep the
  hero content visible.

## Copy

### Hero

- Eyebrow: `A hands-on Linux course`
- Headline: `Stop reading about the terminal. Start using it.`
- Subhead: `Short lessons, then real commands in a safe browser terminal. No setup, no risk — just practice that sticks.`
- Primary: `Start with the basics`
- Secondary: `How it works`
- Fine print: `No install` / `Runs in your browser` / `Instant feedback`

### Example panel

- Top left: `learner@bashlearn`
- Top right: `example session`
- Command: `$ ls`
- Output: `notes.txt  projects`
- Footer: `Every task is checked. No guessing.`
- Screen-reader caption: `Example terminal session showing the ls command and its output.`

### Lesson preview

- Chip: `Product preview · static`
- Lesson label: `Sample lesson`
- Title: `Find your way around`
- Body: `Use pwd to print the directory you're currently working in.`
- Terminal: `$ pwd` → `/home/learner`
- Result: `Task passed. You're in the right directory.`
- Footnote: `Illustrative preview — the terminal isn't live yet.`

### Steps

- Heading: `How it works`
- `01` — `Read the lesson` — `One command at a time, with real examples.`
- `02` — `Run the command` — `Practice in a terminal that runs in your browser.`
- `03` — `Get it checked` — `Instant feedback on the result, not the keystrokes.`

## Accessibility

- One `h1`; preview lesson title and “How it works” are `h2`.
- The decorative grid, arrows, caret, and check dot are `aria-hidden`.
- The static preview is labeled visibly, not only by color.
- “Task passed” includes text, not only green.
- Focus rings on the dark header and CTA use hero accent/foreground.
- `#how-it-works` uses `scroll-mt-24` so the sticky header does not cover it.
- Verify AA contrast for hero muted text, CTA, success text, chip, and header
  controls in both themes.

## Calls Made

- The header goes dark on all `(app)` pages, not only the home page. It is the
  same brand surface as the hero and terminal; auth pages are unaffected.
- The header is static. The previous fade was removed because a dark bar fading
  in over the light body flashes; the hero carries the only entrance animation.
- The primary CTA remains `/problems`; that route still 404s until the problems
  feature ships. The secondary action is a real anchor, so it is not a dead link.
- The preview is illustrative but technically accurate: `ls` output is plain,
  and `pwd` returns `/home/learner`. No lesson count is shown.
- The example panel and preview never animate a caret or accept input.

## Files

- Modify `app/globals.css` — hero/success tokens, Geist Mono in `--font-mono`.
- Modify `app/layout.tsx` — load Geist Mono.
- Rename `components/site-header-motion.tsx` to `components/site-header-shell.tsx` — static dark sticky bar.
- Modify `components/site-header.tsx` — dark header contents and the `SiteHeaderShell` import.
- Replace `components/home/home-hero.tsx` — command-poster hero.
- Create `components/home/command-panel.tsx` — static example terminal.
- Create `components/home/lesson-preview.tsx` — labeled static preview.
- Create `components/home/step-rail.tsx` — process rail.
- Delete `components/home/benefit-grid.tsx`.
- Modify `app/(app)/page.tsx` — compose the new page.
- Update `context/progress.md`, `context/todos.md`, `context/known-issues.md`.

## Verification

- `bun run lint`
- `bunx next typegen` then `bunx tsc --noEmit`
- `bun run build`
- Visual matrix: 1440px, 390px, 320px; light and dark; reduced motion; JS
  disabled; signed-out header; anchor scroll.
- No automated unit tests: this is presentational, the repo has no Vitest
  runner, and the project testing rules target pure logic.
