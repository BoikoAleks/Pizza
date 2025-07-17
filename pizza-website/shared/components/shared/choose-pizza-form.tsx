import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";

import { cn } from "../../lib/utils";
import {
  PizzaSize,
  pizzaSizes,
  PizzaType,
  pizzaTypes,
} from "../../constants/pizza";
import { IngredientItem } from "./ingredient-item";

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: any[];
  items?: Ingredient[];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  imageUrl,
  className,
  ingredients,
  items = [],
}) => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);

  const textDetails = "30 см, звичайна піца";
  const totalprice = 250;

  return (
    <div className={cn(className, "flex flex-1")}>
      <PizzaImage imageUrl={imageUrl} size={size} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetails}</p>

        <div className="flex flex-col gap-4 mt-5">
          <GroupVariants
            items={pizzaSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as PizzaSize)}
          />
          <GroupVariants
            items={pizzaTypes}
            value={String(type)}
            onClick={(value) => setType(Number(value) as PizzaType)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ingredients.map((ingredient) => (
            <IngredientItem
              key={ingredient.id}
              name={ingredient.name}
              imageUrl={ingredient.imageUrl}
              price={ingredient.price}
              active={items.some((item) => item.id === ingredient.id)}
            />
          ))}
        </div>

        <Button className="h-[55px]  px-10 text-base rounded-18[px] w-full mt-10">
          Додати до кошика за {totalprice} грн
        </Button>
      </div>
    </div>
  );
};
