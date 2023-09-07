"use client";

import { Dictionary } from "@/app/[lang]/layout";
import { createContext, useContext } from "react";

export const DictionaryContext = createContext<Dictionary>(null!);

export default function DictionaryProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Dictionary;
}) {
  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

export const useTranslation = () => {
  const dictionary = useContext(DictionaryContext);
  return dictionary;
};
