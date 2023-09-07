"use client";

import { usePathname } from "next/navigation";

export const useLocalelessPathname = () => {
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.substring(3) || "/";

  return pathnameWithoutLocale;
};
