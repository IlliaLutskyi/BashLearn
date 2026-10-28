"use client";

import { CircleCheck, ShieldCheck, Terminal } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const BENEFITS = [
  {
    title: "Learn by doing",
    description:
      "Read a short lesson, then run the command yourself. It sticks faster than watching someone else.",
    icon: Terminal,
  },
  {
    title: "Practice without risk",
    description:
      "Your terminal runs safely in the browser. Nothing to install, nothing to break.",
    icon: ShieldCheck,
  },
  {
    title: "Get instant feedback",
    description:
      "Every task is checked for you, so you know right away when you've nailed it.",
    icon: CircleCheck,
  },
] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const reducedMotionItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0, ease: "easeOut" },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function BenefitGrid() {
  const shouldReduceMotion = useReducedMotion();
  const benefitItem = shouldReduceMotion ? reducedMotionItem : item;

  return (
    <section aria-labelledby="benefits-heading" className="mt-14 sm:mt-16">
      <h2 id="benefits-heading" className="sr-only">
        Why BashLearn
      </h2>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={container}
        className="grid gap-4 sm:grid-cols-3"
      >
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <motion.li
              key={benefit.title}
              variants={benefitItem}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="rounded-xl border border-border/80 bg-card p-5 text-left shadow-sm transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-md motion-reduce:transform-none! motion-reduce:opacity-100! [@media(scripting:none)]:transform-none! [@media(scripting:none)]:opacity-100!"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{benefit.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
