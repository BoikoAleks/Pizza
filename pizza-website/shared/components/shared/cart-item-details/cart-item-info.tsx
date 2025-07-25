import { Ingredient } from "@prisma/client";

interface Props {
  name: string;
  pizzaSize?: number | null;
  type?: number | null;
  ingredients?: Ingredient[];
}

export const CartItemInfo: React.FC<Props> = ({
  name,
  pizzaSize,
  type,
  ingredients,
}) => {
  const details = [];

  if (pizzaSize) {
    const typeName = type === 1 ? "Традиційне" : "Тонке";
    details.push(`${typeName} тісто ${pizzaSize} см`);
  }

  if (ingredients) {
    details.push(...ingredients.map((ingredients) => ingredients.name));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex-1 loading-6">{name}</h2>
      </div>
      <p className="text-sm text-gray-400">{details.join(", ")}</p>
    </div>
  );
};
