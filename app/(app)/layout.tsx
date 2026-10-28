import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          bash-learn
        </Link>
        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <div
                className="h-9 w-32 rounded-md bg-neutral-100 dark:bg-neutral-800"
                aria-hidden="true"
              />
            }
          >
            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:outline-neutral-100"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  type="button"
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:outline-neutral-100"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </Suspense>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
