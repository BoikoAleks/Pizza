// ФАЙЛ: app/manager/menu/_components/products-table.tsx
"use client";

import { useTransition } from "react";
import { Product, Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct } from "@/app/actions"; // Імпортуємо нашу Server Action

// Розширюємо стандартний тип Product, щоб TypeScript знав,
// що ми також передаємо пов'язаний об'єкт категорії.
type ProductWithCategory = Product & {
  category: Category;
};

interface Props {
  products: ProductWithCategory[];
}

export const ProductsTable = ({ products }: Props) => {
  // `useTransition` дозволяє нам виконувати серверні дії
  // без блокування інтерфейсу. `isPending` буде true, поки дія виконується.
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (productId: number, productName: string) => {
    // Показуємо стандартне вікно підтвердження браузера
    if (confirm(`Ви впевнені, що хочете видалити продукт "${productName}"?`)) {
      // Запускаємо асинхронну дію всередині `startTransition`
      startTransition(async () => {
        try {
          // Викликаємо Server Action для видалення продукту
          await deleteProduct(productId);
          toast.success(`Продукт "${productName}" успішно видалено!`);
        } catch (error) {
          // Обробляємо можливу помилку
          toast.error("Не вдалося видалити продукт. Спробуйте ще раз.");
          console.error("Delete product error:", error);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-md border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зображення</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категорія</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-3">
                  {/* Кнопка "Редагувати" - це посилання, яке додає URL-параметр для відкриття модального вікна */}
                  <Button asChild variant="outline" size="icon" disabled={isPending}>
                    <Link href={`/manager/menu?editProduct=${product.id}`}>
                      <Pencil size={16} />
                    </Link>
                  </Button>

                  {/* Кнопка "Видалити" викликає нашу функцію handleDeleteClick */}
                  <Button
                    onClick={() => handleDeleteClick(product.id, product.name)}
                    variant="destructive"
                    size="icon"
                    disabled={isPending} // Кнопка неактивна під час видалення
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
  );
};