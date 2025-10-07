import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import React, { useMemo, useEffect } from "react"; // Додаємо useMemo та useEffect
import { useSet } from "react-use";
import { getAvailablePizzaSizes } from "../lib";
import { ProductItem } from "@prisma/client";
import { Variant } from "../components/shared/group-variants";

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  selectedIngredients: Set<number>;
  availableSizes: Variant[];
  currentItemId?: number;
  setSize: (size: PizzaSize) => void;
  setType: (size: PizzaType) => void;
  addIngredient: (id: number) => void;
}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  // --- ОПТИМІЗАЦІЯ 1: Мемоізуємо розрахунок доступних розмірів ---
  // Цей блок буде виконуватись тільки тоді, коли змінюється `type` або `items`
  const availableSizes = useMemo(() => {
    return getAvailablePizzaSizes(type, items);
  }, [type, items]);

  // --- ОПТИМІЗАЦІЯ 2: Мемоізуємо пошук поточного варіанту ---
  // Цей блок буде виконуватись тільки тоді, коли змінюється `type` або `size`
  const currentItemId = useMemo(() => {
    return items.find((item) => item.pizzaType === type && item.size === size)?.id;
  }, [type, size, items]);

  // --- ЛОГІКА ПЕРЕКЛЮЧЕННЯ РОЗМІРУ (залишається в useEffect) ---
  // Цей ефект, як і раніше, відповідає за автоматичний вибір доступного розміру
  useEffect(() => {
    const isCurrentSizeAvailable = availableSizes.some(
      (item) => Number(item.value) === size && !item.disabled
    );

    // Якщо поточний розмір став недоступним, обираємо перший доступний
    if (!isCurrentSizeAvailable) {
      const firstAvailableSize = availableSizes.find((item) => !item.disabled);
      if (firstAvailableSize) {
        setSize(Number(firstAvailableSize.value) as PizzaSize);
      }
    }
  }, [type, size, availableSizes]); // Залежність від `size` важлива, щоб уникнути зациклення

  return {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
  };
};