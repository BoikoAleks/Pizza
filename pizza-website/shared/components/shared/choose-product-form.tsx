/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { cn } from "../../lib/utils";
import { Ingredient } from "@prisma/client";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  className?: string;
  loading?: boolean;
  onSubmit?: VoidFunction;
  ingredients?: Ingredient[];
}

/**
 * Форма вибору продукта
 */

export const ChooseProductForm: React.FC<Props> = ({
  name,
  imageUrl,
  className,
  loading,
  ingredients = [],
  price,
  onSubmit,
}) => {
  console.log(ingredients);
  return (
    <div className={cn(className, "flex flex-1")}>
      <div className="flex items-center justify-center flex-1 relative w-full bg-white">
        <img
          src={imageUrl}
          alt={name}
          className="relative left-2 top-2 transition-all z-10 duration-300 w-[340px] h-[340px]"
        />
      </div>

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        {ingredients && ingredients.length > 0 && (
          <p className="text-sm text-gray-500">
            {ingredients.map((ingredient) => ingredient.name).join(", ")}

          </p>
        )}
        
        <Button
          loading={loading}
          onClick={() => onSubmit?.()}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
        >
          Додати до кошика за {price} грн
        </Button>
      </div>
    </div>
  );
};
