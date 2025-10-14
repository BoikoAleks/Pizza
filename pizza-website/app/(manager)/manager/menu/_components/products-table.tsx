"use client";

import { useTransition } from "react";
import { Product, Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct } from "@/app/actions";

type ProductWithRelations = Product & {
  category: Category;
};

interface Props {
  products: ProductWithRelations[];
}

export const ProductsTable = ({ products }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (productId: number, productName: string) => {
    if (confirm(`Ви впевнені, що хочете видалити "${productName}"?`)) {
      startTransition(async () => {
        try {
          await deleteProduct(productId);
          toast.success(`Продукт "${productName}" успішно видалено!`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Не вдалося видалити продукт.");
          }
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Продукти</h2>
        <Button asChild>
          <Link href="/manager/menu?addProduct=true">
            <Plus size={18} className="mr-2" />
            Додати продукт
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
                Категорія
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Жодного продукту ще не створено.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                    >
                      <Link href={`/manager/menu?editProduct=${product.id}`}>
                        <Pencil size={16} />
                      </Link>
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteClick(product.id, product.name)
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
