import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SiteHeaderMotion } from "@/components/site-header-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <SiteHeaderMotion>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-rotate-3">
            <Terminal className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            BashLearn
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="flex items-center gap-2 sm:gap-4"
        >
          <Link
            href="/problems"
            className="rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Problems
          </Link>

          <Suspense
            fallback={
              <span
                aria-hidden="true"
                className="h-9 w-20 rounded-lg bg-muted"
              />
            }
          >
            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-9 px-4",
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
        </nav>
      </div>
    </SiteHeaderMotion>
  );
}
