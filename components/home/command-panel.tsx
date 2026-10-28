export function CommandPanel() {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-hero-border bg-hero-deep shadow-2xl">
        <div className="flex items-center justify-between border-b border-hero-border/70 px-4 py-2 font-mono text-[0.7rem] text-hero-muted">
          <span>learner@bashlearn</span>
          <span>example session</span>
        </div>

        <div className="space-y-1.5 p-5 font-mono text-sm leading-relaxed">
          <p>
            <span className="text-hero-accent">$</span> ls
          </p>
          <p className="whitespace-pre text-hero-muted">notes.txt  projects</p>
          <p>
            <span className="text-hero-accent">$</span>{" "}
            <span
              className="inline-block h-4 w-2 bg-hero-accent align-middle"
              aria-hidden="true"
            />
          </p>
        </div>

        <div className="border-t border-hero-border/70 px-4 py-2 font-mono text-[0.7rem] text-hero-muted">
          Every task is checked. No guessing.
        </div>
      </div>

      <figcaption className="sr-only">
        Example terminal session showing the ls command and its output.
      </figcaption>
    </figure>
  );
}
