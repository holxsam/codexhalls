"use client";

import { useLocalelessPathname } from "@/hooks/useLocalelessPathname";
import { ReactNode } from "react";

export type HeaderProps = {
  children: ReactNode;
  className?: string;
  routes: string[];
};

export const Header = ({ children, className, routes }: HeaderProps) => {
  const pathname = useLocalelessPathname();
  const match = routes.includes(pathname);

  return (
    <header className={className} data-route-matched={match}>
      {children}
    </header>
  );
};
