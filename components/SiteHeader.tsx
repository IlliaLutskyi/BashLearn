import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SiteHeaderShell } from "@/components/SiteHeaderShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <SiteHeaderShell>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent/60"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-hero-accent text-hero shadow-sm">
            <Terminal className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-hero-foreground">
            BashLearn
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="flex items-center gap-2 sm:gap-4"
        >
          <Link
            href="/problems"
            className="rounded-md px-1 py-2 text-sm font-medium text-hero-muted transition-colors hover:text-hero-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent/60"
          >
            Problems
          </Link>

          <div className="flex w-20 justify-end">
            <Suspense
              fallback={
                <span
                  aria-hidden="true"
                  className="h-9 w-20 rounded-lg bg-hero-border/60"
                />
              }
            >
              <Show when="signed-out">
                <SignInButton>
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-9 border-hero-border bg-transparent px-4 text-hero-foreground hover:bg-hero-deep hover:text-hero-foreground focus-visible:ring-hero-accent/60 dark:border-hero-border dark:bg-transparent dark:hover:bg-hero-deep",
                    )}
                  >
                    Sign in
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </Suspense>
          </div>
        </nav>
      </div>
    </SiteHeaderShell>
  );
}
