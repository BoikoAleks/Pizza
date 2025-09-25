"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="inline-flex items-center -space-x-px rounded-md text-sm">
      <Link
        href={createPageURL(currentPage - 1)}
        className={cn(
          "inline-flex items-center gap-1 h-10 px-4 font-semibold text-gray-600 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100",
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Назад</span>
      </Link>
      <div className="px-4 h-10 flex items-center bg-white border-y border-gray-300 text-gray-700">
        Сторінка {currentPage} з {totalPages}
      </div>
      <Link
        href={createPageURL(currentPage + 1)}
        className={cn(
          "inline-flex items-center gap-1 h-10 px-4 font-semibold text-gray-600 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
      >
        <span>Вперед</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};
