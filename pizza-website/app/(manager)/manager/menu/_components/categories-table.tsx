"use client";

import { useTransition } from "react";
import { Category } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteCategory } from "@/app/actions";

interface Props {
  categories: Category[];
}

export const CategoriesTable = ({ categories }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (categoryId: number, categoryName: string) => {
    if (
      confirm(`Ви впевнені, що хочете видалити категорію "${categoryName}"?`)
    ) {
      startTransition(async () => {
        try {
          await deleteCategory(categoryId);
          toast.success(`Категорію "${categoryName}" успішно видалено!`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Не вдалося видалити категорію.");
          } else {
            toast.error("Не вдалося видалити категорію.");
          }
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Категорії</h2>
        <Button asChild>
          <Link href="/manager/menu?tab=categories&addCategory=true">
            <Plus size={18} className="mr-2" />
            Додати категорію
          </Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Назва
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{category.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
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
                        href={`/manager/menu?tab=categories&editCategory=${category.id}`}
                      >
                        <Pencil size={16} />
                      </Link>
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteClick(category.id, category.name)
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
