"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// DOES NOT CURRENTLY WORK IN PRODUCTION FOR SOME REASON

type PageTransitionProps = { children?: ReactNode };
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="pointer-events-none"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
