"use client";

import { useGraphStore } from "@/store/GraphStore";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
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
      className="flex items-center justify-center gap-1 whitespace-nowrap h-full outline-none bg-transparent appearance-none font-bold capitalize text-sm focus-visible:ring-1 ring-white ring-inset text-zinc-500 hover:text-zinc-50"
      onClick={toggleMode}
    >
      {mode === "tree" ? <IconBinaryTree2 /> : <IconSphere />}
      {mode === "tree" ? "tree" : "sphere"}
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
      className="flex items-center justify-center gap-1 whitespace-nowrap h-full outline-none bg-transparent appearance-none font-bold capitalize text-sm focus-visible:ring-1 ring-white ring-inset text-zinc-500 hover:text-zinc-50"
      onClick={toggleTouchControls}
    >
      {enableMobile ? <IconHandFinger /> : <IconHandFingerOff />}
      {enableMobile ? "touch on" : "touch off"}
    </button>
  );
}

export function FullscreenToggle() {
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const toggleFullscreen = useGraphStore((state) => state.toggleFullscreen);

  return (
    <button
      type="button"
      className="flex items-center justify-center gap-1 whitespace-nowrap h-full outline-none bg-transparent appearance-none font-bold capitalize text-sm focus-visible:ring-1 ring-white ring-inset text-zinc-500 hover:text-zinc-50"
      onClick={toggleFullscreen}
    >
      {fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
      {fullscreen ? "minimize" : "fullscreen"}
    </button>
  );
}
