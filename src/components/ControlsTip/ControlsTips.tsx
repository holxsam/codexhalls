"use client";

import { DesktopControlTips, TouchControlTips } from "./ControlsTipFragments";
import { cn } from "@/utils/utils";

export function ControlsTip() {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 pointer-events-auto"
        // !fullscreen && s && "hidden"
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="flex items-center justify-center w-16 bg-zinc-500 text-zinc-700 font-bold text-sm rounded-sm ">
          Desktop
        </span>
        <DesktopControlTips />
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex items-center justify-center w-16 bg-zinc-500 text-zinc-700 font-bold text-sm rounded-sm ">
          Touch
        </span>
        <TouchControlTips />
      </div>
    </div>
  );
}
