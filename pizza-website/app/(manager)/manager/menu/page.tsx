// ФАЙЛ: app/manager/menu/page.tsx

import { prisma } from "@/prisma/prisma-client";
import { ProductsTable } from "./_components/products-table";

import { ProductFormModal } from "./_components/product-form-modal";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { SearchParams } from "@/shared/components/shared";

interface Props {
  searchParams: SearchParams;
}

export default async function ManagerMenuPage({ searchParams }: Props) {
  // ================== ПОЧАТОК ВИПРАВЛЕННЯ ==================
  // Витягуємо значення з searchParams в окремі змінні.
  // Це повідомляє Next.js, що ми залежимо від цих конкретних параметрів.
  const addProduct = searchParams.addProduct;
  const editProduct = searchParams.editProduct;
  // =================== КІНЕЦЬ ВИПРАВЛЕННЯ ===================

  // 1. Отримуємо всі продукти з бази даних
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  // 2. Отримуємо всі категорії
  const categories = await prisma.category.findMany();

  // 3. Отримуємо продукт для редагування, використовуючи нашу нову змінну
  const productToEdit = editProduct
    ? await prisma.product.findUnique({
        where: { id: Number(editProduct) }, // <-- Використовуємо `editProduct`
        include: {
          items: true,
          ingredients: {
            select: { id: true },
          },
        },
      })
    : undefined;

  // 4. Отримуємо всі інгредієнти
  const ingredients = await prisma.ingredient.findMany();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управління меню</h1>
        <Button asChild>
          <Link href="/manager/menu?addProduct=true">
            <Plus size={18} className="mr-2" />
            Додати продукт
          </Link>
        </Button>
      </div>
      
      <ProductsTable products={products} />

      <ProductFormModal
        categories={categories}
        productToEdit={productToEdit}
        ingredients={ingredients}
        // Використовуємо наші нові змінні для визначення, чи відкрите модальне вікно
        isOpen={!!addProduct || !!editProduct} 
      />
    </div>
  );
}