import { useSearchParams } from "next/navigation";
import React from "react";
import { useSet } from "react-use";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}
// Інтерфейс для фільтрів
interface QueryFilters extends PriceProps {
  pizzaTypes: string;
  sizes: string;
  ingredients: string;
}

export interface Filters {
  sizes: Set<string>;
  pizzaTypes: Set<string>;
  selectedIngredients: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setPizzaTypes: (value: string) => void;
  setSizes: (value: string) => void;
  setSelectedIngredients: (value: string) => void;
}

// Хук для фільтрів
export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<
    keyof QueryFilters,
    string
  >;

  // Фільтр для інгредієнтів
  const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
    new Set<string>(searchParams.get("ingredients")?.split(","))
  );

  // Фільтр для розмірів та типів бортиків піци
  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set<string>(
      searchParams.has("sizes") ? searchParams.get("sizes")?.split(",") : []
    )
  );
  // Фільтр для типів піци
  const [pizzaTypes, { toggle: togglePizzaType }] = useSet(
    new Set<string>(
      searchParams.has("pizzaTypes")
        ? searchParams.get("pizzaTypes")?.split(",")
        : []
    )
  );
  // Фільтр для ціни
  const [prices, setPrices] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get("priceFrom")),
    priceTo: Number(searchParams.get("priceTo")),
  });
  
// Функція для оновлення ціни
  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return React.useMemo(
    () => ({
      sizes,
      pizzaTypes,
      selectedIngredients,
      prices,
      setPrices: updatePrice,
      setPizzaTypes: togglePizzaType,
      setSizes: toggleSizes,
      setSelectedIngredients: toggleIngredients,
    }),
    [sizes, pizzaTypes, selectedIngredients, prices],
  );
};
