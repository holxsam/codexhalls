"use client";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { Disclosure, Popover } from "@headlessui/react";
import { Fragment, ReactNode, forwardRef } from "react";
import { WikiSidebarNavToggle } from "./WikiSidebarNavToggle";
import { cn } from "@/utils/utils";
import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";
import {
  IconChevronDown,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { useGraphStore } from "@/store/GraphStore";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "../Portal/Portal";

export type WikiNavItem = {
  name: string;
  href: string;
  items?: WikiNavItem[];
};

export const WikiSidebarNav = ({ links }: { links: WikiNavItem[] }) => {
  const pathname = useLocalelessPathname();
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const desktopSidenav = useGraphStore((state) => state.desktopSidenav);

  const open = desktopSidenav;

  return (
    <>
      <Portal portalToId="wiki-search-bar">
        <WikiSidebarNavToggle />
      </Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            // static
            // as={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "tween" }}
            className={cn(
              "hidden sm:block",
              "backdrop-blur-sm bg-zinc-900/90 rounded-md overflow-hidden",
              fullscreen ? "h-min" : "h-full"
            )}
          >
            <ul
              className={cn(
                "z-0 py-2 h-full pl-[14px]",
                "flex overflow-y-auto",
                "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 hover:scrollbar-thumb-white/20",
                "flex-col sm:w-auto relative top-auto left-auto bg-transparent shadow-none sm:backdrop-blur-none",
                fullscreen
                  ? "max-h-[calc(100vh-64px-48px-24px-64px-24px)]"
                  : "max-h-[calc(100vh-64px-48px-24px-64px-24px-300px)]"
              )}
            >
              {links.map((link) => (
                <Disclosure key={link.name} as="li">
                  {({ open, close }) => (
                    <>
                      <Disclosure.Button as={Fragment}>
                        <Link
                          href={link.href}
                          className={cn(
                            "outline-none appearance-none",
                            "relative flex gap-2 items-center h-10 w-min",
                            "capitalize text-sm font-light whitespace-nowrap",
                            "text-white/20 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent"
                          )}
                        >
                          <IconSquareRoundedChevronRightFilled
                            size={20}
                            className={cn(
                              "transition-[transform]",
                              open ? "rotate-90" : "rotate-0"
                            )}
                          />
                          {link.name}
                        </Link>
                      </Disclosure.Button>
                      <AnimatePresence>
                        {open && (
                          <Disclosure.Panel
                            as={motion.ul}
                            static
                            className="overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "tween" }}
                          >
                            {link.items?.map((sublink) => (
                              <li key={sublink.name}>
                                <Link
                                  href={sublink.href}
                                  className={cn(
                                    "outline-none appearance-none",
                                    "relative flex items-center",
                                    "capitalize text-sm whitespace-nowrap font-light",
                                    "ml-[9px] pl-6 h-10 w-min",
                                    "text-white/20 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent ",
                                    "[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.1)] hover:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)] focus-visible:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)]",
                                    link.href === sublink.name &&
                                      "[box-shadow:inset_2px_0_0_0_white_!important] text-white"
                                  )}
                                >
                                  {sublink.name}
                                </Link>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Disclosure>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// export const WikiSidebarNav = ({ links }: { links: WikiNavItem[] }) => {
//   const pathname = useLocalelessPathname();
//   const fullscreen = useGraphStore((state) => state.fullscreen);
//   const desktopSidenav = useGraphStore((state) => state.desktopSidenav);

//   const open = desktopSidenav;

//   return (
//     <Disclosure as={Fragment} defaultOpen>
//       {({ open }) => (
//         <>
//           <Portal portalToId="wiki-search-bar">
//             <WikiSidebarNavToggle />
//           </Portal>
//           <AnimatePresence>
//             {open && (
//               <Disclosure.Panel
//                 static
//                 as={motion.div}
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -50 }}
//                 transition={{ type: "tween" }}
//                 className={cn(
//                   "hidden sm:block",
//                   "backdrop-blur-sm bg-zinc-900/90 rounded-md overflow-hidden",
//                   fullscreen ? "h-min" : "h-full"
//                 )}
//               >
//                 <ul
//                   className={cn(
//                     "z-0 py-2 h-full pl-[14px]",
//                     "flex overflow-y-auto",
//                     "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 hover:scrollbar-thumb-white/20",
//                     "flex-col sm:w-auto relative top-auto left-auto bg-transparent shadow-none sm:backdrop-blur-none",
//                     fullscreen
//                       ? "max-h-[calc(100vh-64px-48px-24px-64px-24px)]"
//                       : "max-h-[calc(100vh-64px-48px-24px-64px-24px-300px)]"
//                   )}
//                 >
//                   {links.map((link) => (
//                     <Disclosure key={link.name} as="li">
//                       {({ open, close }) => (
//                         <>
//                           <Disclosure.Button as={Fragment}>
//                             <Link
//                               href={link.href}
//                               className={cn(
//                                 "outline-none appearance-none",
//                                 "relative flex gap-2 items-center h-10 w-min",
//                                 "capitalize text-sm font-light whitespace-nowrap",
//                                 "text-white/20 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent"
//                               )}
//                             >
//                               <IconSquareRoundedChevronRightFilled
//                                 size={20}
//                                 className={cn(
//                                   "transition-[transform]",
//                                   open ? "rotate-90" : "rotate-0"
//                                 )}
//                               />
//                               {link.name}
//                             </Link>
//                           </Disclosure.Button>
//                           <AnimatePresence>
//                             {open && (
//                               <Disclosure.Panel
//                                 as={motion.ul}
//                                 static
//                                 className="overflow-hidden"
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 transition={{ type: "tween" }}
//                               >
//                                 {link.items?.map((sublink) => (
//                                   <li key={sublink.name}>
//                                     <Link
//                                       href={sublink.href}
//                                       className={cn(
//                                         "outline-none appearance-none",
//                                         "relative flex items-center",
//                                         "capitalize text-sm whitespace-nowrap font-light",
//                                         "ml-[9px] pl-6 h-10 w-min",
//                                         "text-white/20 hover:text-white focus-visible:text-white bg-transparent hover:bg-transparent focus-visible:bg-transparent ",
//                                         "[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.1)] hover:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)] focus-visible:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)]",
//                                         link.href === sublink.name &&
//                                           "[box-shadow:inset_2px_0_0_0_white_!important] text-white"
//                                       )}
//                                     >
//                                       {sublink.name}
//                                     </Link>
//                                   </li>
//                                 ))}
//                               </Disclosure.Panel>
//                             )}
//                           </AnimatePresence>
//                         </>
//                       )}
//                     </Disclosure>
//                   ))}
//                 </ul>
//               </Disclosure.Panel>
//             )}
//           </AnimatePresence>
//         </>
//       )}
//     </Disclosure>
//   );
// };
