const STEPS = [
  {
    number: "01",
    title: "Read the lesson",
    description: "One command at a time, with real examples.",
  },
  {
    number: "02",
    title: "Run the command",
    description: "Practice in a terminal that runs in your browser.",
  },
  {
    number: "03",
    title: "Get it checked",
    description: "Instant feedback on the result, not the keystrokes.",
  },
] as const;

export function StepRail() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-24 pt-10 sm:pt-12"
    >
      <div className="flex items-center gap-4">
        <h2
          id="how-it-works-heading"
          className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          How it works
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <ol className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-0">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="flex gap-3 border-t border-border pt-5 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
          >
            <span className="font-mono text-xs text-accent-foreground">
              {step.number}
            </span>
            <div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
