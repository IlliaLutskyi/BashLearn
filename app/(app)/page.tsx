import { HomeHero } from "@/components/home/home-hero";
import { LessonPreview } from "@/components/home/lesson-preview";
import { StepRail } from "@/components/home/step-rail";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHero />
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:-mt-24">
        <LessonPreview />
        <StepRail />
      </div>
    </div>
  );
}
