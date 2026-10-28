import { Check } from "lucide-react";

export function LessonPreview() {
  return (
    <section aria-labelledby="lesson-preview-title">
      <div className="rounded-xl border border-border bg-card p-5 shadow-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-accent-foreground">
            <span
              className="size-1.5 rounded-full bg-current"
              aria-hidden="true"
            />
            Product preview · static
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Sample lesson
          </span>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <h2
              id="lesson-preview-title"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Find your way around
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground">
                pwd
              </code>{" "}
              to print the directory you&apos;re currently working in.
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <p>
                <strong className="font-medium text-success">
                  Task passed.
                </strong>{" "}
                You&apos;re in the right directory.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-hero-deep">
            <div className="flex items-center justify-between border-b border-hero-border/70 px-3 py-2 font-mono text-[0.7rem] text-hero-muted">
              <span>bashlearn · terminal</span>
              <span>example</span>
            </div>
            <div className="space-y-1 p-4 font-mono text-sm leading-relaxed">
              <p>
                <span className="text-hero-accent">$</span> pwd
              </p>
              <p className="text-hero-muted">/home/learner</p>
              <p>
                <span className="text-hero-accent">$</span>{" "}
                <span
                  className="inline-block h-4 w-2 bg-hero-accent align-middle"
                  aria-hidden="true"
                />
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
          Illustrative preview — the terminal isn&apos;t live yet.
        </p>
      </div>
    </section>
  );
}
