"use client";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { MobileWikiSidebarNavToggle } from "./MobileSidebarNavToggleMobile";
import { cn } from "@/utils/utils";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "../Portal/Portal";
import { WikiNavItem } from "./WikiSidebarNav";

export const MobileWikiSidebarNav = ({ links }: { links: WikiNavItem[] }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <>
      <Portal portalToId="wiki-search-bar">
        <MobileWikiSidebarNavToggle onClick={toggle} />
      </Portal>
      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={close}
            as={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "tween" }}
            className={cn(
              "block sm:hidden",
              "z-10 fixed inset-0 overflow-hidden"
            )}
          >
            <Dialog.Panel
              className={cn(
                "overflow-y-auto h-full rounded-md backdrop-blur-sm bg-black/90"
              )}
            >
              <div className="sticky top-0 z-10">
                <button
                  type="button"
                  className="absolute top-0 right-0 m-1 w-12 h-12 grid place-items-center"
                  onClick={close}
                >
                  <IconX />
                </button>
              </div>
              <ul
                className={cn(
                  "pr-16 py-16 w-min",
                  "flex flex-col overflow-y-auto mx-auto",
                  "gap-4  relative top-auto left-auto bg-transparent"
                )}
              >
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className={cn(
                        "outline-none appearance-none",
                        "relative flex gap-2 items-center h-10 w-min",
                        "capitalize text-base font-bold whitespace-nowrap",
                        "text-zinc-300 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent"
                      )}
                    >
                      {link.name}
                    </Link>
                    <ul className="overflow-hidden">
                      {link.items?.map((sublink) => (
                        <li key={sublink.name}>
                          <Link
                            href={sublink.href}
                            onClick={close}
                            className={cn(
                              "outline-none appearance-none",
                              "relative flex items-center",
                              "capitalize text-base whitespace-nowrap font-normal",
                              "pl-2 h-10 w-min",
                              "text-zinc-500 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent "
                            )}
                          >
                            {sublink.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
