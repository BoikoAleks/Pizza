import { Ingredient, ProductItem } from '@prisma/client';
import { PizzaSize, PizzaType } from '../constants/pizza';


/**
 * Функция для подсчета общей стоимости пиццы
 *
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 *
 * @returns number общую стоимость
 */
export const calcTotalPizzaPrice = (
type: number, size: number, items: { id: number; price: number; size: number | null; pizzaType: number | null; productId: number; }[], ingredients: { name: string; id: number; price: number; imageUrl: string; createdAt: Date; updatedAt: Date; }[], type: PizzaType, size: PizzaSize, addIngredient: (key: number) => void, selectedIngredients: Set<number>, items: ProductItem[], ingredients: Ingredient[], selectedIngredients: Set<number>,
) => {
  const pizzaPrice =
    items.find((item) => item.pizzaType === type && item.size === size)?.price || 0;

  const totalIngredientsPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0);

  return pizzaPrice + totalIngredientsPrice;
};