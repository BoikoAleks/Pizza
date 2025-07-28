import { Ingredient } from "@prisma/client";
import { PizzaSize, PizzaType, mapPizzaType } from "../constants/pizza";

export const getCartItemDetails = (
  ingredients: Ingredient[] | undefined,
  pizzaType?: PizzaType,
  pizzaSize?: PizzaSize
): string => {
  const details = [];

  if (pizzaSize && pizzaType) {
    const typeName = mapPizzaType[pizzaType];
    details.push(`${typeName} ${pizzaSize} см`);
  }

  if (Array.isArray(ingredients)) {
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return details.join(", ");
};
