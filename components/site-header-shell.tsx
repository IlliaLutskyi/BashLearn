import type { ReactNode } from "react";

export function SiteHeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-hero-border/80 bg-hero">
      {children}
    </header>
  );
}
