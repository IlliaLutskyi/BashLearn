"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";

import { CommandPanel } from "@/components/home/command-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const reducedMotionItem: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const entranceClasses =
  "motion-reduce:transform-none! motion-reduce:opacity-100! [@media(scripting:none)]:transform-none! [@media(scripting:none)]:opacity-100!";

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();
  const heroItem = shouldReduceMotion ? reducedMotionItem : item;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-hero text-hero-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(to_right,var(--hero-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--hero-border)_1px,transparent_1px)] bg-[size:3rem_3rem]"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-36 lg:pt-24"
      >
        <div className="max-w-xl">
          <motion.p
            variants={heroItem}
            className={cn(
              "font-mono text-xs font-medium uppercase tracking-[0.16em] text-hero-accent",
              entranceClasses,
            )}
          >
            A hands-on Linux course
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={heroItem}
            className={cn(
              "mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-balance sm:text-5xl lg:text-[3.25rem]",
              entranceClasses,
            )}
          >
            <span className="block">Stop reading</span>
            <span className="block">about the terminal.</span>
            <span className="block text-hero-accent">Start using it.</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className={cn(
              "mt-5 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg",
              entranceClasses,
            )}
          >
            Short lessons, then real commands in a safe browser terminal. No
            setup, no risk — just practice that sticks.
          </motion.p>

          <motion.div
            variants={heroItem}
            className={cn(
              "mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6",
              entranceClasses,
            )}
          >
            <Link
              href="/problems"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-11 bg-hero-accent px-5 text-sm font-semibold text-hero hover:bg-hero-accent/90 focus-visible:ring-hero-foreground/60 motion-reduce:transform-none!",
              )}
            >
              Start with the basics
              <ArrowRight
                className="size-4 transition-transform group-hover/button:translate-x-0.5 motion-reduce:transform-none!"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="group inline-flex items-center gap-2 rounded-md text-sm font-medium text-hero-foreground underline-offset-4 hover:text-hero-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent/60"
            >
              How it works
              <ArrowDown
                className="size-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transform-none!"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          <motion.p
            variants={heroItem}
            className={cn(
              "mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-hero-muted",
              entranceClasses,
            )}
          >
            <span>No install</span>
            <span aria-hidden="true">·</span>
            <span>Runs in your browser</span>
            <span aria-hidden="true">·</span>
            <span>Instant feedback</span>
          </motion.p>
        </div>

        <motion.div
          variants={heroItem}
          className={cn(
            "w-full max-w-md lg:justify-self-end",
            entranceClasses,
          )}
        >
          <CommandPanel />
        </motion.div>
      </motion.div>
    </section>
  );
}
