# Add Auth UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the default Clerk sign-in and sign-up screens into a BashLearn split auth screen: a static feature panel on the left and the themed Clerk form on the right.

**Architecture:** Add a shared `app/(auth)` route group. Its layout renders a presentational `<aside>` using the existing `--sidebar-*` tokens and centers the Clerk form in the remaining space. Theme Clerk globally by applying `@clerk/ui`'s shadcn theme to `ClerkProvider` so its colors come from `app/globals.css`.

**Tech Stack:** Next.js 16.4.3 (App Router, Cache Components), React 19.3, Clerk `@clerk/nextjs` 7.9.21 with `@clerk/ui` 1.x, shadcn/ui base-nova tokens, Tailwind CSS v4, bun.

**Spec:** `context/features/02-add-auth-ui.md` plus the approved copy and layout decisions recorded in this plan.

## Global Constraints

- Keep the URLs `/sign-in` and `/sign-up`; the `(auth)` folder must not appear in the URL.
- Keep Clerk's `<SignIn />` and `<SignUp />` components. Do not build custom auth forms.
- Use theme tokens only: `--sidebar`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--card`, `--primary`, `--border`, `--muted-foreground`, `--radius`, `--font-sans`.
- No raw colors in new components. No `forwardRef`. No editing files under `components/ui/`.
- Compose class names with `cn()` from `@/lib/utils`.
- No emojis in UI copy.
- Do not add the shadcn `Sidebar` component or its registry dependencies. The left panel is a static `<aside>` styled with sidebar tokens, per the approved choice.
- Do not change the root header, Clerk middleware, database, schema, or environment variables.
- No new automated test suite for this presentational feature. The project has no test script, and `context/convensions.md` excludes unit-testing shadcn components and Next.js routing. Verify with lint, type generation, TypeScript, build, and browser checks.
- Work on one task at a time. Commit after each task.

## Review Focus

These are the failure modes most likely to bite a real user. Each one is covered by a manual check in the task that owns the code.

1. **Mobile width (320-375px):** the aside is hidden, the compact heading appears above the form, the Clerk card fits, and nothing scrolls horizontally.
2. **Desktop at the `lg` breakpoint (1024px):** the 26rem aside and the `max-w-md` form both fit without overlap or horizontal overflow.
3. **Dark mode:** with `.dark` on `<html>`, the sidebar, heading, circles, muted text, and Clerk card stay readable because every color comes from a token.
4. **Clerk suspense:** `<SignIn />` and `<SignUp />` remain inside `<Suspense>` so their search-param reads do not break under `cacheComponents`.
5. **Theme completeness:** both `appearance={{ theme: shadcn }}` and `@import "@clerk/ui/themes/shadcn.css"` are present. Removing either one drops Clerk's token mapping or the Tailwind classes it needs.

---

## Task 1: Theme Clerk with the app's shadcn tokens

**Files:**

- Modify: `package.json`, `bun.lock` (via `bun add`)
- Modify: `app/globals.css:1-5` (imports and `:root`)
- Modify: `app/globals.css:60-64` (`.dark` block)
- Modify: `app/layout.tsx:1-30` (import and `ClerkProvider`)

**Interfaces:**

- Consumes: the existing `--border`, `--radius`, and `--font-sans` tokens in `app/globals.css`.
- Produces: a globally themed `ClerkProvider`; every Clerk component rendered below it inherits the shadcn theme. Later tasks do not pass `appearance` again.

- [ ] **Step 1: Install `@clerk/ui`**

Run:

```bash
bun add @clerk/ui
```

Expected: `@clerk/ui` appears in `dependencies` in `package.json`, and `bun.lock` changes. No unresolved peer dependency errors for `@clerk/nextjs`.

- [ ] **Step 2: Import the Clerk shadcn CSS and declare the color scheme**

In `app/globals.css`, add the Clerk import directly after the Tailwind import:

```css
@import "tailwindcss";
@import "@clerk/ui/themes/shadcn.css";
```

Add `color-scheme` as the first declaration in `:root`:

```css
:root {
  color-scheme: light;
  --background: hsl(204 100% 97.0588%);
  /* ...existing tokens unchanged... */
}
```

Add `color-scheme` as the first declaration in `.dark`:

```css
.dark {
  color-scheme: dark;
  --background: hsl(222.2222 47.3684% 11.1765%);
  /* ...existing tokens unchanged... */
}
```

Expected: `app/globals.css` keeps all existing tokens and adds only these three lines.

- [ ] **Step 3: Apply the shadcn theme to `ClerkProvider`**

In `app/layout.tsx`, import the theme:

```tsx
import { shadcn } from "@clerk/ui/themes";
```

Replace the opening `<ClerkProvider>` tag with:

```tsx
<ClerkProvider
  appearance={{
    theme: shadcn,
    variables: {
      colorBorder: "var(--border)",
      borderRadius: "var(--radius)",
      fontFamily: "var(--font-sans)",
      fontFamilyButtons: "var(--font-sans)",
    },
  }}
>
```

Leave the rest of the provider, header, and `<main>` unchanged.

- [ ] **Step 4: Run lint and type checks**

Run, in order:

```bash
bun run lint
bunx next typegen
bunx tsc --noEmit
```

Expected: all three commands exit with code 0. `next typegen` must run before `tsc` because `LayoutProps` is generated.

- [ ] **Step 5: Verify the theme in the browser**

Run:

```bash
bun run dev
```

Open `http://localhost:3000/sign-in` and `http://localhost:3000/sign-up`.

Check:

- The Clerk card background matches `--card` and its primary button uses the cyan `--primary` token.
- The card radius is 12px (`--radius: 0.75rem`).
- The browser console has no CSS or module-resolution errors.
- In DevTools, the primary button's computed background color matches `--primary`, and the card background matches `--card`. The CSS import is what makes Tailwind generate the theme classes, so do not remove it.

Record the result. If the theme does not apply, check that the `@import` is before every non-import rule in `globals.css` and that `@clerk/ui` is installed.

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock app/globals.css app/layout.tsx
git commit -m "feat: theme clerk with app tokens"
```

---

## Task 2: Add the shared auth layout and static feature panel

**Files:**

- Create: `components/auth/welcome-heading.tsx`
- Create: `components/auth/auth-aside.tsx`
- Create: `app/(auth)/layout.tsx`
- Move: `app/sign-in/[[...sign-in]]/page.tsx` -> `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Move: `app/sign-up/[[...sign-up]]/page.tsx` -> `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- Modify: both moved pages

**Interfaces:**

- `WelcomeHeading({ className?: string; compact?: boolean })` renders a single `<h1>` with two lines.
- `AuthAside()` renders the desktop-only `<aside>` and the four feature items.
- `AuthLayout({ children }: { children: ReactNode })` renders `AuthAside`, the mobile heading, and the right-hand form column.

- [ ] **Step 1: Create the shared heading component**

Create `components/auth/welcome-heading.tsx`:

```tsx
import { cn } from "@/lib/utils";

type WelcomeHeadingProps = {
  className?: string;
  compact?: boolean;
};

export function WelcomeHeading({
  className,
  compact = false,
}: WelcomeHeadingProps) {
  return (
    <h1 className={cn("text-balance", className)}>
      <span
        className={cn(
          "block font-semibold tracking-tight",
          compact ? "text-2xl" : "text-3xl xl:text-4xl",
        )}
      >
        Welcome to BashLearn.
      </span>
      <span
        className={cn(
          "mt-2 block text-muted-foreground",
          compact ? "text-sm" : "text-lg",
        )}
      >
        Here begins your journey
      </span>
    </h1>
  );
}
```

The copy is exact: the first line ends with a period; the second line has no period.

- [ ] **Step 2: Create the feature panel**

Create `components/auth/auth-aside.tsx`:

```tsx
import { WelcomeHeading } from "./welcome-heading";

const FEATURES = [
  {
    title: "Learn by doing",
    description: "Short, focused lessons on the commands you'll actually use.",
  },
  {
    title: "Practice without risk",
    description:
      "Try everything in a safe terminal that runs right in your browser.",
  },
  {
    title: "Get instant feedback",
    description: "Check your work right away and see what to try next.",
  },
  {
    title: "Keep your momentum",
    description:
      "Your progress is saved, so you can pick up where you left off.",
  },
] as const;

export function AuthAside() {
  return (
    <aside className="hidden border-r border-sidebar-border bg-sidebar p-10 text-sidebar-foreground lg:flex lg:w-[26rem] lg:flex-col lg:justify-center xl:w-[30rem]">
      <WelcomeHeading />
      <ol className="mt-12 space-y-8">
        {FEATURES.map((feature, index) => (
          <li key={feature.title} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
```

The numbered circles are the "circles beside the features" from the feature file. Numbers are `01` through `04`.

- [ ] **Step 3: Create the shared auth layout**

Create `app/(auth)/layout.tsx`:

```tsx
import type { ReactNode } from "react";

import { AuthAside } from "@/components/auth/auth-aside";
import { WelcomeHeading } from "@/components/auth/welcome-heading";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <AuthAside />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:py-16">
        <div className="w-full max-w-md">
          <WelcomeHeading compact className="mb-8 text-center lg:hidden" />
          {children}
        </div>
      </div>
    </div>
  );
}
```

The layout relies on the root `<main className="flex flex-1 flex-col">` so it fills the space below the existing 4rem header.

- [ ] **Step 4: Move both auth routes into the group**

The parent folder must exist first. Creating `app/(auth)/layout.tsx` in Step 3 creates it. Then run:

```bash
git mv "app/sign-in" "app/(auth)/sign-in"
git mv "app/sign-up" "app/(auth)/sign-up"
```

Expected: `app/sign-in` and `app/sign-up` no longer exist at the top level; both pages now live under `app/(auth)/`. The URLs remain `/sign-in` and `/sign-up`.

- [ ] **Step 5: Remove the old centering wrappers from both pages**

Replace `app/(auth)/sign-in/[[...sign-in]]/page.tsx` with:

```tsx
import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
```

Replace `app/(auth)/sign-up/[[...sign-up]]/page.tsx` with:

```tsx
import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
```

The layout now owns the centering and padding. Keep `<Suspense>` around each Clerk component.

- [ ] **Step 6: Run lint and type checks**

Run:

```bash
bun run lint
bunx next typegen
bunx tsc --noEmit
```

Expected: all three commands exit with code 0. If `next typegen` reports duplicate routes, confirm that no old `app/sign-in` or `app/sign-up` folder remains.

- [ ] **Step 7: Verify the layout in the browser**

Run:

```bash
bun run dev
```

Check both `http://localhost:3000/sign-in` and `http://localhost:3000/sign-up`:

- At 375px wide: the aside is not visible, the compact heading sits above the correct Clerk form, and there is no horizontal scrollbar.
- At 1024px wide: the aside is visible at 26rem, the form is centered in the remaining space, and the two columns do not overlap.
- At 1440px wide: the aside is 30rem wide.
- The heading reads exactly "Welcome to BashLearn." and "Here begins your journey".
- The four features appear in order with `01`-`04` circles and the approved descriptions.
- In DevTools, add `dark` to the `<html>` class. The aside, circles, headings, muted text, and Clerk card remain readable, with no raw colors.
- `/sign-in` renders `<SignIn />`; `/sign-up` renders `<SignUp />`.

- [ ] **Step 8: Commit**

```bash
git add "app/(auth)" components/auth
git commit -m "feat: add split auth layout"
```

---

## Task 3: Final verification and project context

**Files:**

- Modify: `context/progress.md`
- Modify: `context/todos.md`
- Modify: `context/known-issues.md`

**Interfaces:**

- Consumes: the completed auth layout and themed Clerk provider from Tasks 1 and 2.
- Produces: accurate project status for the next session.

- [ ] **Step 1: Run the full verification suite**

Run, in order:

```bash
bun run lint
bunx next typegen
bunx tsc --noEmit
bun run build
```

Expected: all four commands exit with code 0. If `next build` fails because Clerk keys are missing or the Clerk application is unclaimed, record the exact error in `context/known-issues.md` instead of claiming success.

- [ ] **Step 2: Ask the user to confirm the visual result**

Start the dev server and ask the user to open `/sign-in` and `/sign-up`. Confirm:

- The desktop split shows the feature panel on the left and the form on the right.
- The mobile layout hides the aside and shows the compact heading above the form.
- Clerk's form matches the BashLearn theme.

Do not mark the feature done until the user confirms.

- [ ] **Step 3: Update `context/todos.md`**

- Move `02-add-auth-ui.md` from "In progress" and "To do" to "Done".
- Mark it `[x]`.
- Leave the "In progress" and "To do" sections clean (remove the duplicate entry).

- [ ] **Step 4: Update `context/progress.md`**

- Set "Current feature" to the next feature, or `None` if there is no next feature file.
- Move `02-add-auth-ui.md` to "Done" with a one-line summary.
- Clear the "Remaining" section.
- Add dated decisions under "Decisions (short, dated)":
  - 2026-10-28: Auth pages use a shared `(auth)` route group with a static aside styled by `--sidebar-*` tokens. The shadcn Sidebar component was intentionally not used; it adds client state and registry dependencies for a presentational panel.
  - 2026-10-28: Clerk is themed with `@clerk/ui`'s shadcn theme, which maps Clerk variables to the tokens in `app/globals.css`.

- [ ] **Step 5: Update `context/known-issues.md`**

Add:

```md
- The Clerk shadcn theme needs both `appearance={{ theme: shadcn }}` on `ClerkProvider` and `@import "@clerk/ui/themes/shadcn.css"` in `app/globals.css`. Removing the import drops Tailwind classes that only appear in the Clerk theme.
```

Keep the existing unresolved issue about the first sign-up/sign-in browser flow if the user has not completed it.

- [ ] **Step 6: Commit**

```bash
git add context/progress.md context/todos.md context/known-issues.md
git commit -m "docs: update auth ui progress"
```

---

## Self-Review

**Spec coverage:** The feature file asks for (1) shadcn sidebar components and Clerk token replacement, and (2) a left feature panel with the two-line heading, circles, and the correct form on the right. Task 1 covers Clerk token replacement. Task 2 covers the split layout, heading, circles, and both forms. The approved change from the shadcn `Sidebar` component to a static aside is recorded in the Global Constraints and in Task 3's decisions.

**Step scan:** Every step names the exact file, command, copy, class names, or token values needed. No step leaves a type or function undefined.

**Type consistency:** `WelcomeHeading` is created with `{ className?: string; compact?: boolean }` and consumed with `compact` and `className`. `AuthAside` takes no props. `AuthLayout` takes `{ children: ReactNode }`. The moved pages keep their default exports.

**Review focus coverage:** Mobile width and breakpoint checks are in Task 2 Step 7. Dark mode is in Task 2 Step 7. Clerk suspense is preserved in Task 2 Step 5. Theme completeness is checked in Task 1 Step 5 and Task 3 Step 1.

**Proportion:** The plan is longer than the feature file because it carries the exact copy, token mapping, route moves, and verification commands. It does not include implementation bodies beyond the small presentational components whose exact markup is the design decision.
