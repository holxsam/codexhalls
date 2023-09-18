import { PageTransition } from "@/components/PageTransition/PageTransition";
import { ReactNode } from "react";

export default function SearchableTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
