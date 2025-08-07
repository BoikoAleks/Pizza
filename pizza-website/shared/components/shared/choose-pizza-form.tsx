"use client";

import React from "react";
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
import { Dialog, DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: Ingredient[];
  loading?: boolean;
  items: ProductItem[];
  onSubmit: (itemId: number, ingredients: number[]) => void;
}

/**
 * Форма вибору піци
 */

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
  const { totalPrice, textDetails } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients
  );

  React.useEffect(() => {
    const isAvailableSize = availableSizes.find(
      (item) => Number(item.value) === size && !item.disabled
    );
    const availableSize = availableSizes?.find((item) => !item.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type, setSize, size, availableSizes]);

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn(className, "flex w-full")}>
      <div className="w-[400px] flex-shrink-0 flex items-center justify-center p-8 bg-white">
        <PizzaImage imageUrl={imageUrl} size={size} />
      </div>

      <div className="flex-1 bg-gray-50 p-8 flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2">
          <Dialog> 
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold mb-1">
              {name}
            </DialogTitle>
          </DialogHeader>
          </Dialog>

          <p className="text-gray-400 mt-2">{textDetails}</p>

          <div className="flex flex-col gap-4 mt-5">
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

          <div className="mt-8">
            <Title
              text="Додати інгредієнти"
              size="sm"
              className="mb-4 font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
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
            onClick={handleClickAdd} className="h-14 text-base w-full">
            Додати до кошика за {totalPrice} грн
          </Button>
        </div>
      </div>
    </div>
  );
};
