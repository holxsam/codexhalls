"use client";

import { Popover } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
import { IconMenu, IconX } from "@tabler/icons-react";
import { cn } from "@/utils/utils";

export const WikiSidebarNavToggle = () => {
  return (
    <Disclosure.Button
      title="Navigation Menu"
      className={cn(
        "z-10 relative outline-none appearance-none",
        "rounded-xl w-12 min-w-[48px] aspect-square grid place-items-center ring-current",
        "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200 bg-transparent"
      )}
    >
      {/* {({ open }) => (open ? <IconX /> : <IconMenu />)} */}
      <IconMenu />
    </Disclosure.Button>
  );
};

export const WikiSidebarNavToggleMobile = () => {
  return (
    <Popover.Button
      title="Navigation Menu"
      className={cn(
        "z-10 relative outline-none appearance-none",
        "rounded-xl w-12 min-w-[48px] aspect-square grid place-items-center ring-current",
        "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200 bg-transparent"
      )}
    >
      {/* {({ open }) => (open ? <IconX /> : <IconMenu />)} */}
      <IconMenu />
    </Popover.Button>
  );
};
