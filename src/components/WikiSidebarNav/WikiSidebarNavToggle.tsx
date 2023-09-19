"use client";

import { Popover } from "@headlessui/react";
import { IconMenu, IconX } from "@tabler/icons-react";
import { cn } from "@/utils/utils";

export const WikiSidebarNavToggle = () => {
  return (
    <Popover.Button
      title="Navigation Menu"
      className={cn(
        "z-10 relative outline-none appearance-none",
        "rounded-xl w-10 aspect-square grid place-items-center sm:hidden ring-current",
        "text-zinc-100 hover:text-zinc-900 focus-visible:text-zinc-900 bg-transparent focus-visible:bg-white hover:bg-white"
      )}
    >
      {({ open }) => (open ? <IconX /> : <IconMenu />)}
    </Popover.Button>
  );
};
