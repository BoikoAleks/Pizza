import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";
import { useRouter } from "next/navigation";


// Хук для синхронізації фільтрів з URL
export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  React.useEffect(() => {
    const params = {
      ...filters.prices,
      sizes: Array.from(filters.sizes),
      pizzaTypes: Array.from(filters.pizzaTypes),
      ingredients: Array.from(filters.selectedIngredients),
    };

    const query = qs.stringify(params, {
      arrayFormat: "comma",
    });
    router.push(`?${query}`, {
      scroll: false,
    });
  }, [filters, router]);
};
