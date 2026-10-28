"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={container}
      className="mx-auto max-w-3xl text-center"
    >
      <motion.p
        variants={item}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs"
      >
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
        Built for beginners
      </motion.p>

      <motion.h1
        variants={item}
        className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        Learn Linux by actually using it.
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
      >
        Short lessons and hands-on practice in your browser. No setup, no
        risk — just real commands and instant feedback.
      </motion.p>

      <motion.div variants={item} className="mt-8 flex justify-center">
        <Link
          href="/problems"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-11 w-full bg-foreground px-5 text-sm text-background hover:bg-foreground/90 sm:w-auto",
          )}
        >
          Start practicing
          <ArrowRight
            className="size-4 transition-transform group-hover/button:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </motion.section>
  );
}
