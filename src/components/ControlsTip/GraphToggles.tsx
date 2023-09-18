"use client";

import { useGraphStore } from "@/store/GraphStore";
import {
  IconAccessPoint,
  IconAccessPointOff,
  IconBinaryTree2,
  IconHandFinger,
  IconHandFingerOff,
  IconSphere,
} from "@tabler/icons-react";

export function GraphModeToggle() {
  const toggleMode = useGraphStore((state) => state.toggleMode);
  const mode = useGraphStore((state) => state.mode);

  return (
    <button
      type="button"
      className="grid place-items-center h-full w-8 rounded-tl-lg rounded-bl-lg outline-none bg-transparent appearance-none focus-visible:ring-1 ring-white ring-inset text-zinc-700 hover:text-zinc-500"
      onClick={toggleMode}
    >
      {mode === "tree" ? <IconBinaryTree2 /> : <IconSphere />}
    </button>
  );
}

export function TouchControlsToggle() {
  const enableMobile = useGraphStore((state) => state.touchControls);
  const setMobile = useGraphStore((state) => state.setTouchControls);

  const toggleTouchControls = () => setMobile(!enableMobile);

  return (
    <button
      type="button"
      className="grid place-items-center h-full w-8 rounded-tl-lg rounded-bl-lg outline-none bg-transparent appearance-none focus-visible:ring-1 ring-white ring-inset text-zinc-700 hover:text-zinc-500"
      onClick={toggleTouchControls}
    >
      {enableMobile ? <IconHandFinger /> : <IconHandFingerOff />}
    </button>
  );
}
