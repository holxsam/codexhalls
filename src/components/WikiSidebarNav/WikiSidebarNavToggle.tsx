"use client";

import { Disclosure } from "@headlessui/react";
import { IconList } from "@tabler/icons-react";
import { cn } from "@/utils/utils";
import { useEffect, useRef } from "react";
import { useGraphStore } from "@/store/GraphStore";

export const WikiSidebarNavToggle = () => {
  // const ref = useRef<HTMLButtonElement>(null!);
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const desktopSidenav = useGraphStore((state) => state.desktopSidenav);
  const toggleDesktopSidenav = useGraphStore(
    (state) => state.toggleDesktopSidenav
  );

  // useEffect(() => {
  //   if (fullscreen) {
  //     ref.current.click();
  //   } else {
  //     // ref.current.click();
  //   }
  // }, [fullscreen]);

  return (
    <button
      type="button"
      // ref={ref}
      title="Navigation Menu"
      className={cn(
        "hidden sm:grid",
        "z-10 relative outline-none appearance-none",
        "rounded-xl w-12 min-w-[48px] aspect-square place-items-center ring-current",
        "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200 bg-transparent"
      )}
      onClick={toggleDesktopSidenav}
    >
      <IconList />
    </button>
    // <Disclosure.Button
    //   // ref={ref}
    //   title="Navigation Menu"
    //   className={cn(
    //     "hidden sm:grid",
    //     "z-10 relative outline-none appearance-none",
    //     "rounded-xl w-12 min-w-[48px] aspect-square place-items-center ring-current",
    //     "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200 bg-transparent"
    //   )}
    //   onClick={toggleDesktopSidenav}
    // >
    //   <IconList />
    // </Disclosure.Button>
  );
};
