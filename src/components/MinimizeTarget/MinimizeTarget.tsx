"use client";

import { useGraphStore } from "@/store/GraphStore";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function MinimizeTarget() {
  const ref = useRef<HTMLDivElement>(null!);
  const setMinimizedPosition = useGraphStore(
    (state) => state.setMinimizedPosition
  );
  const fullscreen = useGraphStore((state) => state.fullscreen);

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
  }, []);

  return (
    <div className="relative pointer-events-none">
      <div
        ref={ref}
        className="absolute w-full h-[300px] borderzzborder-red-500/10"
      />
      <motion.div
        className="w-full borderzzborder-blue-500/10 hidden sm:block"
        initial={{ height: fullscreen ? 0 : 300 }}
        animate={{ height: fullscreen ? 0 : 300 }}
      />
    </div>
  );
}
