"use client";

import { useGraphStore, useOfflineGraphStore } from "@/store/GraphStore";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function MinimizeTarget() {
  const ref = useRef<HTMLDivElement>(null!);
  const setMinimizedPosition = useGraphStore(
    (state) => state.setMinimizedPosition
  );
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const enableGraph = useOfflineGraphStore((state) => state.enableGraph);

  useEffect(() => {
    const updateTargetPosition = () => {
      const { width, height, top, left } = ref.current.getBoundingClientRect();

      const x = left + width / 2;
      const y = top + height / 2;

      setMinimizedPosition([x, y]);
    };

    updateTargetPosition(); // run in the first render to get correct target position

    window.addEventListener("resize", updateTargetPosition);
    return () => {
      window.removeEventListener("resize", updateTargetPosition);
    };
  }, [setMinimizedPosition]);

  return (
    <div className="relative pointer-events-none">
      <div ref={ref} className="absolute w-full h-[300px]" />
      <motion.div
        className="w-full hidden sm:block"
        initial={{ height: fullscreen || !enableGraph ? 0 : 300 }}
        animate={{ height: fullscreen || !enableGraph ? 0 : 300 }}
      />
    </div>
  );
}
