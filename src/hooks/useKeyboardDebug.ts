"use client";

import { useEffect } from "react";

type KeyboardDebugProps = {
  keyboardKey?: string;
  func: () => void;
};

export const useKeyboardDebug = ({
  keyboardKey = "d",
  func,
}: KeyboardDebugProps) => {
  useEffect(() => {
    const debug = (e: KeyboardEvent) => {
      if (e.key === keyboardKey) func();
    };
    window.addEventListener("keydown", debug);
    return () => {
      window.removeEventListener("keydown", debug);
    };
  }, [keyboardKey, func]);
};
