"use client";

import { useEffect } from "react";

export const useKeyboardDebug = (key: string, func: () => any) => {
  useEffect(() => {
    const debug = (e: KeyboardEvent) => {
      if (e.key === key && func) func();
    };

    window.addEventListener("keydown", debug);
    return () => window.removeEventListener("keydown", debug);
  }, [key, func]);
};
