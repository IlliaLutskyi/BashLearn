"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type SiteHeaderMotionProps = {
  children: ReactNode;
};

export function SiteHeaderMotion({ children }: SiteHeaderMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 motion-reduce:transform-none! motion-reduce:opacity-100! [@media(scripting:none)]:transform-none! [@media(scripting:none)]:opacity-100!"
    >
      {children}
    </motion.header>
  );
}
