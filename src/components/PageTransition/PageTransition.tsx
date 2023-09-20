"use client";

import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";
import { useGraphStore } from "@/store/GraphStore";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

type PageTransitionProps = { children?: ReactNode };
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = useLocalelessPathname();
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const setFullscreen = useGraphStore((state) => state.setFullscreen);
  const setDesktopSidenav = useGraphStore((state) => state.setDesktopSidenav);

  useEffect(() => {
    if (pathname === "/") {
      setFullscreen(true);
      setDesktopSidenav(true);
    } else {
      setFullscreen(false);
      setDesktopSidenav(true);
    }
  }, [pathname, setDesktopSidenav, setFullscreen]);

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
