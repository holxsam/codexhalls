"use client";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { Disclosure, Popover } from "@headlessui/react";
import { Fragment, ReactNode, forwardRef } from "react";
import { WikiSidebarNavToggle } from "./WikiSidebarNavToggle";
import { cn } from "@/utils/utils";
import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";
import { IconChevronDown } from "@tabler/icons-react";
import { Searchbar } from "../Searchbar/Searchbar";
import { useGraphStore } from "@/store/GraphStore";
import { AnimatePresence, motion } from "framer-motion";

export type WikiNavItem = {
  name: string;
  href: string;
  items?: WikiNavItem[];
};

export const WikiSidebarNav = ({ links }: { links: WikiNavItem[] }) => {
  const pathname = useLocalelessPathname();
  const fullscreen = useGraphStore((state) => state.fullscreen);
  return (
    <Disclosure as={Fragment} defaultOpen>
      {({ close, open }) => (
        <>
          <Searchbar>
            <WikiSidebarNavToggle />
          </Searchbar>
          <AnimatePresence>
            {open && (
              <Disclosure.Panel
                static
                as={motion.div}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "tween" }}
                className={
                  cn("pl-5")
                  // "pl-5 transition-[transform_opacity]"
                  // open
                  //   ? "visible opacity-100 translate-y-0"
                  //   : "invisible opacity-0 -translate-y-2/3"
                }
              >
                <ul
                  className={cn(
                    // mobile/desktop:
                    // "border border-red-500",
                    "z-0",
                    "flex min-h-minzz h-[calc(100vh-64px-48px-24px-64px)] zzh-[500px] transition-[transform_opacity] duration-300 overflow-y-scroll zzoverflow-hidden",
                    "custom-scrollbar-tinyzz [direction:rtl] [&>*]:[direction:ltr]",
                    "scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 hover:scrollbar-thumb-white/50 h-min",
                    fullscreen
                      ? "max-h-[calc(100vh-64px-48px-24px-64px-24px)]"
                      : "max-h-[calc(100vh-64px-48px-24px-64px-24px-300px)]",
                    // mobile:
                    "flex-col gap-0 w-full absolutezz z-10 fixed top-0 left-0 pt-48 pb-2zz backdrop-blur-md shadow-lg bg-black/80",
                    // desktop:
                    "sm:flex-col sm:items-centerzz sm:gap-4zz sm:w-auto sm:relative sm:top-auto sm:left-auto sm:pt-0 pb-16zz sm:bg-transparent sm:shadow-none sm:backdrop-blur-none"
                    // mobile: show list depending on open state:
                    // desktop: ALWAYS show the list:
                    // "sm:visiblezz sm:opacity-100 sm:translate-y-0"
                  )}
                >
                  {/* <div className="relative overflow-y-scroll"> */}
                  {links.map((link) => (
                    <Disclosure key={link.name} as="li">
                      {({ open, close }) => (
                        <>
                          <Disclosure.Button as={Fragment}>
                            <Link
                              href={link.href}
                              // onClick={close}
                              className={cn(
                                // mobile/desktop:
                                "relative flex items-center capitalize text-sm outline-none appearance-none whitespace-nowrap",
                                // mobile:
                                // "pl-4 pr-8 h-12 w-full justify-end font-medium",
                                // desktop:
                                // "sm:ml-2zz sm:pl-0zz sm:pr-0 sm:h-10 sm:w-min sm:justify-normal sm:font-medium",
                                "pl-4 pr-0 h-10 w-min justify-normal font-medium",
                                // mobile colors:
                                // "text-zinc-400 hover:text-white focus-visible:text-white bg-transparent hover:bg-zinc-800/80 focus-visible:bg-zinc-800/80 hover:shadow-none focus-visible:shadow-none",
                                // desktop colors:
                                "sm:text-zinc-500 sm:hover:text-white sm:focus-visible:text-white sm:bg-transparent sm:hover:bg-transparent sm:focus-visible:bg-transparent"
                                // "sm:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.1)] sm:hover:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)] sm:focus-visible:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)]",
                                // link.href === pathname &&
                                //   "sm:[box-shadow:inset_2px_0_0_0_white_!important] sm:text-white"
                              )}
                            >
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
                                      // onClick={close}
                                      className={cn(
                                        // mobile/desktop:
                                        "relative flex items-center capitalize text-sm outline-none appearance-none whitespace-nowrap ml-4",
                                        // mobile:
                                        // "pl-4 pr-8 h-12 w-full justify-end font-medium",
                                        // desktop:
                                        "pl-4 pr-0 h-10 w-min justify-normal font-medium",
                                        // // mobile:
                                        // "pl-4 pr-8 h-12 w-full justify-end font-medium",
                                        // // desktop:
                                        // "sm:pl-0zz sm:pr-0 sm:h-10 sm:w-min sm:justify-normal sm:font-medium",
                                        // mobile colors:
                                        // "text-zinc-400 hover:text-white focus-visible:text-white bg-transparent hover:bg-zinc-800/80 focus-visible:bg-zinc-800/80 hover:shadow-none focus-visible:shadow-none",
                                        // desktop colors:
                                        "sm:text-zinc-500 sm:hover:text-white sm:focus-visible:text-white sm:bg-transparent sm:hover:bg-transparent sm:focus-visible:bg-transparent ",
                                        // "sm:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.1)] sm:hover:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)] sm:focus-visible:[box-shadow:inset_2px_0_0_0_rgba(255,255,255,0.3)]",
                                        link.href === sublink.name &&
                                          "sm:[box-shadow:inset_2px_0_0_0_white_!important] sm:text-white"
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
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
};

// const AccordionDemo = () => (
//   <Accordion.Root
//     className="AccordionRoot"
//     type="single"
//     defaultValue="item-1"
//     collapsible
//   >
//     <Accordion.Item className="AccordionItem" value="item-1">
//       <AccordionTrigger>Is it accessible?</AccordionTrigger>
//       <AccordionContent>
//         Yes. It adheres to the WAI-ARIA design pattern.
//       </AccordionContent>
//     </Accordion.Item>

//     <Accordion.Item className="AccordionItem" value="item-2">
//       <AccordionTrigger>Is it unstyled?</AccordionTrigger>
//       <AccordionContent>
//         Yes. It's unstyled by default, giving you freedom over the look and
//         feel.
//       </AccordionContent>
//     </Accordion.Item>

//     <Accordion.Item className="AccordionItem" value="item-3">
//       <AccordionTrigger>Can it be animated?</AccordionTrigger>
//       <Accordion.Content className="AccordionContent">
//         <div className="AccordionContentText">
//           Yes! You can animate the Accordion with CSS or JavaScript.
//         </div>
//       </Accordion.Content>
//     </Accordion.Item>
//   </Accordion.Root>
// );

// const AccordionTrigger = forwardRef<
//   HTMLButtonElement,
//   { children: ReactNode; className?: string }
// >(({ children, className, ...props }, forwardedRef) => (
//   <Accordion.Header className="AccordionHeader">
//     <Accordion.Trigger
//       className={cn("flex gap-4 justify-between w-full", className)}
//       {...props}
//       ref={forwardedRef}
//     >
//       {children}
//       {/* <ChevronDownIcon className="AccordionChevron" aria-hidden /> */}
//       <IconChevronDown />
//     </Accordion.Trigger>
//   </Accordion.Header>
// ));

// const AccordionContent = forwardRef<
//   HTMLDivElement,
//   { children: ReactNode; className?: string }
// >(({ children, className, ...props }, forwardedRef) => (
//   <Accordion.Content
//     className={cn("AccordionContent", className)}
//     {...props}
//     ref={forwardedRef}
//   >
//     <div className="AccordionContentText">{children}</div>
//   </Accordion.Content>
// ));
