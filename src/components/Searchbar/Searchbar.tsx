"use client";
import { useGraphStore } from "@/store/GraphStore";
import { cn } from "@/utils/utils";
import { IconSearch, IconX } from "@tabler/icons-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { WikiSidebarNavToggle } from "../WikiSidebarNav/WikiSidebarNavToggle";

export function Searchbar({ children }: { children?: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const [inputFilterValue, setInputFilterValue] = useState("");

  const resetQueryFilter = () => {
    // if (typeof inputRef === "function") return;
    // setUrlQuery({ filterValue: "" });
    setInputFilterValue("");
    inputRef.current.focus();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "q") {
        inputRef.current.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className="z-10 relative flex gap-1 pointer-events-auto w-full">
      <div className="group relative flex min-h-[3rem] w-full rounded-lg text-base caret-white backdrop-blur-md bg-zinc-800/90 focus-within:bg-zinc-700/70">
        <div id="wiki-search-bar"></div>
        <input
          type="text"
          ref={inputRef}
          spellCheck={false}
          autoComplete="off"
          placeholder={""}
          className={cn(
            "outline-none appearance-none",
            "flex w-full text-base caret-white bg-transparent pr-2 rounded-tr-lg rounded-br-lg",
            "placeholder:text-neutral-600"
          )}
          value={inputFilterValue}
          onChange={(e) => {
            setInputFilterValue(e.target.value);
            // debouncedUpdateUrl(e.target.value);
          }}
          // onBlur={unfocusItemLinks}
          // onKeyDown={arrowKeyNav}
        />
        <button
          type="button"
          className="grid place-items-center pl-3 pr-3 rounded-tl-lg rounded-bl-lg outline-none appearance-none focus-visible:ring-1 ring-white ring-inset text-zinc-500 bg-transparent"
          onClick={resetQueryFilter}
        >
          {inputFilterValue === "" ? <IconSearch /> : <IconX />}
        </button>
      </div>
    </div>
  );
}
