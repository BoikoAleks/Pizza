"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "../../lib/utils";

type SortOption = "popular" | "price_desc" | "price_asc";

interface Props {
  className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  const [value, setValue] = React.useState<SortOption>("popular");

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gray-50 px-4 py-2 rounded-2xl",
        // smaller gap when label is short (популярні), larger otherwise
        value === "popular" ? "gap-1" : "gap-3",
        className
      )}
    >
      <ArrowUpDown size={16} />
      <b>Сортування:</b>
      <select
        value={value}
        onChange={(e) => {
          const v = e.target.value as SortOption;
          setValue(v);
          window.dispatchEvent(
            new CustomEvent("products:sort", { detail: { sort: v } })
          );
        }}
        className="bg-transparent border-none outline-none text-[var(--primary)] font-semibold"
      >
        <option value="popular">популярні</option>
        <option value="price_desc">від дорогих до дешевих</option>
        <option value="price_asc">від дешевих до дорогих</option>
      </select>
    </div>
  );
};
