import { BenefitGrid } from "@/components/home/benefit-grid";
import { HomeHero } from "@/components/home/home-hero";

export default function Home() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 size-72 rounded-full bg-secondary blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <HomeHero />
        <BenefitGrid />
      </div>
    </div>
  );
}
