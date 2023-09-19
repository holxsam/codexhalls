"use client";

import { useGraphStore } from "@/store/GraphStore";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// DOES NOT CURRENTLY WORK IN PRODUCTION FOR SOME REASON

type PageTransitionProps = { children?: ReactNode };
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const fullscreen = useGraphStore((state) => state.fullscreen);

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: fullscreen ? 0 : 1, y: fullscreen ? -100 : 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "tween" }}
        className={cn(
          fullscreen ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
