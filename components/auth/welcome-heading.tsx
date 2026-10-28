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
