/* eslint-disable @next/next/no-img-element */
import { cn } from "@/shared/lib/utils";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { pizzaSizes, PizzaType, pizzaTypes } from "@/shared/constants/pizza";

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: any[];
  items?: any[];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  imageUrl,
  className,
}) => {
  const textDetails = "30 см, звичайна піца";
  const totalprice = 250;

  return (
    <div className={cn(className, "flex flex-1")}>
      <PizzaImage imageUrl={imageUrl} size={30} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetails}</p>


        <GroupVariants
            items={pizzaTypes}
            value={String(type)}
            onClick={(value) => setType(Number(value) as PizzaType)}
          />




        <Button className="h-[55px]  px-10 text-base rounded-18[px] w-full mt-10">
          Додати до кошика за {totalprice} грн
        </Button>
      </div>
    </div>
  );
};
