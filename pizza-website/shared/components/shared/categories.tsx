"use client";

import { cn } from "@/shared/lib/utils";
import { useCategoryStore } from "@/shared/store/category";
import { Category } from "@prisma/client";
import React from "react";

interface Props {
  items: Category[];
  className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  const setActiveId = useCategoryStore((state) => state.setActiveId);

  const handleClick = (id: number) => {
    setActiveId(id);
    //  Отримуємо елемент за ID
    const elementId = `group-${id}`;
    const element = document.getElementById(elementId);

    //  Плавно скролимо до елемента
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className={cn("inline-flex gap-1 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {items.map(({ name, id }) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-5 transition-all",
            categoryActiveId === id
              ? "bg-white shadow-md text-primary"
              : "text-slate-500 hover:text-primary"
          )}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
