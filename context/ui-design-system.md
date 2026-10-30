## Tailwind and shadcn/ui

- Style with Tailwind utility classes. No custom CSS files except `globals.css` for theme variables.
- Always compose class names with the `cn()` helper from shadcn.
- Use theme tokens (`bg-background`, `text-muted-foreground`, `border`) instead of raw colors, so dark mode works without extra work.
- Add shadcn components with the CLI, keep them in `/components/ui`, and DONT EVER EDIR THEM. Build app-specific components by wrapping them, not by forking them.
- Use `sonner` for toasts.
- Mobile first: write base styles for small screens, then add `md:` and `lg:` overrides.
- The terminal and editor panels need an explicit height and `min-h-0` on flex parents, or they collapse or overflow.
- Use shadcn components instead of raw html.
