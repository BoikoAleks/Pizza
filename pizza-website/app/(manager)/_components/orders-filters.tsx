"use client";

import { Button, Input } from "@/shared/components/ui";
import { OrderStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const statusFilters: { label: string; value?: OrderStatus }[] = [
  { label: "Всі" },
  { label: "В обробці", value: "PENDING" },
  { label: "Виконані", value: "SUCCEEDED" },
  { label: "Скасовані", value: "CANCELLED" },
];

export const OrdersFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStatus = searchParams.get("status");

  const handleUpdateParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Використовуємо debounce, щоб не робити запит на кожне натискання клавіші
  const handleSearch = useDebouncedCallback((term: string) => {
    handleUpdateParams("query", term);
  }, 300);

  return (
    <div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-center ">
      {/* Кнопки-фільтри */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusFilters.map((filter) => (
          <Button
            key={filter.label}
            onClick={() => handleUpdateParams("status", filter.value)}
            variant={
              currentStatus === filter.value ||
              (!currentStatus && !filter.value)
                ? "default"
                : "outline"
            }
            size="sm"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Поле пошуку */}
      <div className="relative md:ml-auto w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Пошук за ID, іменем"
          className="pl-9 
            w-full 
            md:w-64 
            transition-all 
            duration-300 
            focus-visible:ring-1 
            focus-visible:ring-offset-0 
            focus-visible:ring-[var(--primary)]"
          defaultValue={searchParams.get("query") || ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
