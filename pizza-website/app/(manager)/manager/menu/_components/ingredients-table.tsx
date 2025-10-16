"use client";

import { useTransition } from "react";
import { Ingredient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteIngredient } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";

interface Props {
  ingredients: Ingredient[];
}

export const IngredientsTable = ({ ingredients }: Props) => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (ingredientId: number, ingredientName: string) => {
    if (confirm(`Ви впевнені, що хочете видалити "${ingredientName}"?`)) {
      startTransition(async () => {
        try {
          await deleteIngredient(ingredientId);
          toast.success(`Інгредієнт "${ingredientName}" успішно видалено!`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Не вдалося видалити інгредієнт.");
          }
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Інгредієнти</h2>
        <Button asChild>
          <Link href="/manager/menu?tab=ingredients&addIngredient=true">
            <Plus size={18} className="mr-2" />
            Додати інгредієнт
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Зображення
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Назва
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ціна
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className={cn(
                  searchParams.get("editIngredient") === String(ingredient.id) &&
                    "bg-blue-50"
                )}
              >
                <td className="px-6 py-4">
                  <Image
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ingredient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ingredient.price} грн
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                    >
                      <Link
                        href={`/manager/menu?tab=ingredients&editIngredient=${ingredient.id}`}
                      >
                        <Pencil size={16} />
                      </Link>
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteClick(ingredient.id, ingredient.name)
                      }
                      variant="destructive"
                      size="icon"
                      disabled={isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
