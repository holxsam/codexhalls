"use client";

import { useGraphStore, useOfflineGraphStore } from "@/store/GraphStore";
import { cn } from "@/utils/utils";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBinaryTree,
  IconBinaryTree2,
  IconCoffeeOff,
  IconEyeOff,
  IconHandFinger,
  IconHandFingerOff,
  IconHelpSmall,
  IconSphere,
} from "@tabler/icons-react";

export function GraphModeToggle() {
  const toggleMode = useGraphStore((state) => state.toggleMode);
  const mode = useGraphStore((state) => state.mode);
  const setMode = useGraphStore((state) => state.setMode);
  const enableGraph = useOfflineGraphStore((state) => state.enableGraph);
  const setEnableGraph = useOfflineGraphStore((state) => state.setEnableGraph);

  const toggleSphere = () => {
    setMode("sphere");
    setEnableGraph(true);
  };
  const toggle3dTree = () => {
    setMode("tree3d");
    setEnableGraph(true);
  };
  const toggle2dTree = () => {
    setMode("tree2d");
    setEnableGraph(true);
  };
  const toggleGraphOff = () => {
    setEnableGraph(false);
  };

  const className = cn(
    "outline-none appearance-none",
    "font-bold capitalize text-sm whitespace-nowrap ",
    "flex items-center justify-center gap-1 rounded-md h-full aspect-square",
    "bg-transparent focus-visible:ring-1 ring-white ring-inset text-zinc-700 hover:text-zinc-50"
  );

  return (
    <div className="flex rounded-md overflow-hidden h-12 p-[2px] bg-zinc-800/90 backdrop-blur-sm">
      <button
        type="button"
        className={cn(
          className,
          enableGraph &&
            mode === "sphere" &&
            "bg-white/10 text-zinc-300 hover:text-zinc-50"
        )}
        onClick={toggleSphere}
      >
        <IconSphere />
      </button>
      <button
        type="button"
        className={cn(
          className,
          enableGraph &&
            mode === "tree3d" &&
            "bg-white/10 text-zinc-300 hover:text-zinc-50",
          "relative"
        )}
        onClick={toggle3dTree}
      >
        <span className="absolute top-0 left-0 text-[8px] leading-[8px] m-[4px]">
          3D
        </span>
        <IconBinaryTree />
      </button>
      <button
        type="button"
        className={cn(
          className,
          "relative",
          enableGraph &&
            mode === "tree2d" &&
            "bg-white/10 text-zinc-300 hover:text-zinc-50"
        )}
        onClick={toggle2dTree}
      >
        <span className="absolute top-0 left-0 text-[8px] leading-[8px] m-[4px]">
          2D
        </span>
        <IconBinaryTree2 />
      </button>
      <button
        type="button"
        className={cn(
          className,
          "uppercase text-zinc-600",
          !enableGraph && "bg-white/10 hover:text-zinc-50"
        )}
        onClick={toggleGraphOff}
      >
        Off
      </button>
    </div>
  );
}

export function TouchControlsToggle() {
  const enableMobile = useGraphStore((state) => state.touchControls);
  const setMobile = useGraphStore((state) => state.setTouchControls);

  const toggleTouchControls = () => setMobile(!enableMobile);

  return (
    <button
      type="button"
      className={cn(
        "outline-none appearance-none",
        "font-bold capitalize text-sm whitespace-nowrap",
        "flex items-center justify-center gap-1 h-full aspect-square rounded-md",
        "bg-transparent focus-visible:ring-1 ring-white ring-inset",
        "text-zinc-300 hover:text-zinc-200 focus-visible:text-zinc-200"
      )}
      onClick={toggleTouchControls}
    >
      {enableMobile ? <IconHandFinger /> : <IconHandFingerOff />}
    </button>
  );
}

export function FullscreenToggle() {
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const toggle = useGraphStore((state) => state.toggleFullscreenAndSidenav);

  return (
    <button
      type="button"
      className={cn(
        "outline-none appearance-none",
        "font-bold capitalize text-sm whitespace-nowrap",
        "flex items-center justify-center gap-1 h-full aspect-square rounded-md",
        "bg-transparent focus-visible:ring-1 ring-white ring-inset",
        "text-zinc-300 hover:text-zinc-200 focus-visible:text-zinc-200"
      )}
      onClick={toggle}
    >
      {fullscreen ? (
        <IconArrowsMinimize size={22} />
      ) : (
        <IconArrowsMaximize size={22} />
      )}
    </button>
  );
}
export function HelpToggle() {
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const toggleFullscreen = useGraphStore((state) => state.toggleFullscreen);

  return (
    <button
      type="button"
      className={cn(
        "outline-none appearance-none",
        "font-bold capitalize text-sm whitespace-nowrap",
        "flex items-center justify-center gap-1 h-10 w-10 rounded-md",
        "backdrop-blur-sm bg-zinc-800/90 focus-visible:ring-1 ring-white ring-inset",
        "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200"
      )}
      onClick={toggleFullscreen}
    >
      <IconHelpSmall size={30} />
    </button>
  );
}
