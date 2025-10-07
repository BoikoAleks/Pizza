// ФАЙЛ: /path/to/ChoosePizzaForm.tsx
"use client";

import React, { useMemo } from "react"; // <-- Важливо додати `useMemo`
import { Title } from "./title";
import { Button } from "../ui";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { cn } from "../../lib/utils";
import { PizzaSize, PizzaType, pizzaTypes } from "../../constants/pizza";
import { IngredientItem } from "./ingredient-item";
import { Ingredient, ProductItem } from "@prisma/client";
import { usePizzaOptions } from "@/shared/hooks";
import { getPizzaDetails } from "@/shared/lib";

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: Ingredient[];
  loading?: boolean;
  items: ProductItem[];
  onSubmit: (itemId: number, ingredients: number[]) => void;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  loading,
  ingredients,
  onSubmit,
  className,
}) => {
  const {
    size,
    type,
    selectedIngredients,
    setSize,
    currentItemId,
    setType,
    addIngredient,
    availableSizes,
  } = usePizzaOptions(items);

  // --- ОПТИМІЗАЦІЯ 3: Мемоізуємо фінальні розрахунки ціни та опису ---
  // Цей блок буде викликатись тільки тоді, коли змінюється одна з його залежностей
  const { totalPrice, textDetails } = useMemo(() => {
    return getPizzaDetails(
      type,
      size,
      items,
      ingredients,
      selectedIngredients
    );
  }, [type, size, items, ingredients, selectedIngredients]);

  // `useEffect` з `usePizzaOptions` вже обробляє логіку переключення розмірів,
  // тому тут ми його більше не дублюємо.

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn(className, "flex flex-1")}>
      <div className="w-[400px] flex-shrink-0 flex items-center justify-center p-8 bg-white h-full">
        <PizzaImage imageUrl={imageUrl} size={size} />
      </div>

      <div className="flex flex-col flex-1 bg-gray-50 p-8 h-full max-h-full overflow-y-auto">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-400 mt-2">{textDetails}</p>

          <div className="flex flex-col gap-3 mt-4">
            <GroupVariants
              items={availableSizes}
              value={String(size)}
              onClick={(value) => setSize(Number(value) as PizzaSize)}
            />
            <GroupVariants
              items={pizzaTypes}
              value={String(type)}
              onClick={(value) => setType(Number(value) as PizzaType)}
            />
          </div>

          <div className="mt-4">
            <Title text="Додати інгредієнти" size="sm" className="mb-4 font-bold" />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                name={ingredient.name}
                imageUrl={ingredient.imageUrl}
                price={ingredient.price}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <Button
            loading={loading}
            onClick={handleClickAdd}
            disabled={!currentItemId || loading} // Додаємо перевірку, щоб не можна було додати неіснуючий варіант
            className="h-14 text-base w-full"
          >
            Додати до кошика за {totalPrice} грн
          </Button>
        </div>
      </div>
    </div>
  );
};