"use client";

import { Popover } from "@headlessui/react";

import Link from "next/link";
import { Fragment } from "react";
import { NavMenuButton } from "./NavMenuButton";
import { cn } from "@/utils/utils";
import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";

export type NavItem = {
  name: string;
  href: string;
  navbarBgTrigger: number;
};

export const NavMenu = ({ links }: { links: NavItem[] }) => {
  const pathname = useLocalelessPathname();

  return (
    <Popover as={Fragment}>
      {({ close, open }) => (
        <>
          <NavMenuButton />
          <Popover.Panel
            static
            as="ul"
            className={cn(
              // mobile/desktop:
              "flex min-h-min transition-[transform_opacity] duration-300",
              // mobile:
              "flex-col gap-0 w-full absolute top-0 left-0 pt-16 pb-2 backdrop-blur-md shadow-lg bg-black/80",
              // desktop:
              "sm:flex-row sm:items-center sm:gap-4 sm:w-auto sm:relative sm:top-auto sm:left-auto sm:py-0 sm:bg-transparent sm:shadow-none sm:backdrop-blur-none",
              // mobile: show list depending on open state:
              open
                ? "visible opacity-100 translate-y-0"
                : "invisible opacity-0 -translate-y-2/3",
              // desktop: ALWAYS show the list:
              "sm:visible sm:opacity-100 sm:translate-y-0"
            )}
          >
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={close}
                  className={cn(
                    // mobile/desktop:
                    "relative flex items-center capitalize text-sm outline-none appearance-none whitespace-nowrap",
                    // mobile:
                    "pl-4 pr-8 h-12 justify-end font-semibold",
                    // desktop:
                    "sm:pl-0 sm:pr-0 sm:h-10 sm:justify-normal sm:font-medium",
                    // mobile colors:
                    "text-zinc-400 hover:text-zinc-50 focus-visible:text-zinc-50 bg-transparent hover:bg-zinc-800/80 focus-visible:bg-zinc-800/80 hover:shadow-none focus-visible:shadow-none",
                    // desktop colors:
                    "sm:text-zinc-100 sm:hover:text-zinc-100 sm:focus-visible:text-zinc-100 sm:bg-transparent sm:hover:bg-transparent sm:focus-visible:bg-transparent sm:hover:[box-shadow:inset_0_-2px_0_0_white] sm:focus-visible:[box-shadow:inset_0_-2px_0_0_white]",

                    link.href === pathname &&
                      "sm:[box-shadow:inset_0_-2px_0_0_white]"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
