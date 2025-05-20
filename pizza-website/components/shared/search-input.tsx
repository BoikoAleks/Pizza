"use client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useClickAway } from "react-use";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  return (
    <>
      {focused && (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/40 z-30" />
      )}

      <div
        ref={ref}
        className={cn(
          "flex rounded-2xl flex-1 justify-between relative h-11 z-30",
          className
        )}
      >
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-full outline-none w-full bg-gray-100 pl-11"
          type="text"
          placeholder="Пошук піци, напоїв, десертів..."
          onFocus={() => setFocused(true)}
        />

        <div
          className={cn(
            "absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30",
            focused && "visible opacity-100 top-12"
          )}
        >
          <Link 
          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10"
          href="/product/1">
            <img className="rounded-sm h-8 w-8" src="https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp" width={32} height={32} alt="Pizza1" ></img>
            <span>
            Pizza1
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};
