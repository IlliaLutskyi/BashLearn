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
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-foreground tabular-nums">
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
