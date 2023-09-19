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
                className={cn(
                  fullscreen ? "h-min" : "h-full",
                  "pl-[14px]zz backdrop-blur-sm bg-zinc-900/90 rounded-md overflow-hidden [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.1)]zz"
                )}
              >
                <ul
                  className={cn(
                    // mobile/desktop:
                    // "border border-red-500",
                    // fullscreen ? "h-min" : "h-full",
                    "z-0 py-2 pb-2zz h-full pl-[14px]",
                    "flex overflow-y-auto",
                    "custom-scrollbar-tinyzz [direction:rtl]zz [&>*]:[direction:ltr]zz",
                    "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 hover:scrollbar-thumb-white/20",
                    fullscreen
                      ? "max-h-[calc(100vh-64px-48px-24px-64px-24px)]"
                      : "max-h-[calc(100vh-64px-48px-24px-64px-24px-300px)]",
                    // mobile:
                    // "flex-col gap-0 w-full absolutezz z-10 top-0 left-0 pt-48zz pb-2zz backdrop-blur-md shadow-lg bg-black/80",
                    // desktop:
                    "flex-col sm:w-auto relative top-auto left-auto bg-transparent shadow-none sm:backdrop-blur-none"
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
                                      // onClick={close}
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
