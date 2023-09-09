"use client";

import Link from "next/link";
import { NavItem, NavMenu } from "./NavMenu";
import { LogoWithText } from "../Logo/Logo";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";
import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";

const navLinks: NavItem[] = [
  {
    name: "database",
    href: "/database",
    navbarBgTrigger: 0,
  },
  {
    name: "loadout",
    href: "/loadout",
    navbarBgTrigger: 0,
  },
  {
    name: "wayfinders",
    href: "/wayfinders",
    navbarBgTrigger: 0,
  },
  {
    name: "weapons",
    href: "/weapons",
    navbarBgTrigger: 0,
  },
];

const unScrolled = "backdrop-blur-none border-transparent bg-transparent";
const scrolled = "backdrop-blur-lg border-white/[8%] bg-zinc-900/80";

export const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const bgColorStyles = isScrolled ? scrolled : unScrolled;

  const pathname = useLocalelessPathname();
  const link = navLinks.find((link) => link.href === pathname);
  const trigger = link ? link.navbarBgTrigger : 0;

  useEffect(() => {
    const scroller = document.documentElement;
    const updateBgColor = () => setIsScrolled(scroller.scrollTop > trigger);

    updateBgColor(); // call it once to start because it is possible to be scrolled down on a page load cus of SSR

    window.addEventListener("scroll", updateBgColor);
    return () => {
      window.removeEventListener("scroll", updateBgColor);
    };
  }, [trigger]);

  // when navigating to new pages, we don't want the default smooth scroll
  // also fixes a next.js issue where navigating to a new page does not scroll all the way to the top when you have a sticky header
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="relative isolate h-16">
      {/* 
      Using the div below as the background so that backdrop-filter works here AND in the mobile nav menu. 
      This bug is caused if you apply backdrop-filter to nested elements. 
      So if a parent has backdrop-filter and somewhere down its tree, 
      a child or distant child also has backdrop-filter, only the parent's backdrop-filter will get applied. 
      */}
      <div
        className={cn(
          "-z-10 absolute inset-0 transition-[background-color] duration-250 border-b",
          bgColorStyles
        )}
      />

      <div className="flex justify-between items-center pack-content h-full">
        <Link href="/" className="relative z-10">
          <LogoWithText />
        </Link>

        <nav className="flex gap-0 sm:gap-4">
          <NavMenu links={navLinks} />
        </nav>
      </div>
    </div>
  );
};
