import { prisma } from "@/prisma/prisma-client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProductsTable } from "./_components/products-table";
import { ProductFormModal } from "./_components/product-form-modal";
import { IngredientsTable } from "./_components/ingredients-table";
import { IngredientFormModal } from "./_components/ingredient-form-modal";
import { CategoriesTable } from "./_components/categories-table"; 
import { CategoryFormModal } from "./_components/category-form-modal"; 
import { SearchParams } from "@/shared/components/shared";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function ManagerMenuPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = Array.isArray(params.tab) ? params.tab[0] : params.tab || 'products';

  const [products, ingredients, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, items: true, ingredients: { select: { id: true } } },
    }),
    prisma.ingredient.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  
  const addProduct = params.addProduct;
  const editProduct = params.editProduct;
  const addIngredient = params.addIngredient;
  const editIngredient = params.editIngredient;
  const addCategory = params.addCategory; 
  const editCategory = params.editCategory; 
  
  const productToEdit = editProduct ? products.find(p => p.id === Number(editProduct)) : undefined;
  const ingredientToEdit = editIngredient ? ingredients.find(i => i.id === Number(editIngredient)) : undefined;
  const categoryToEdit = editCategory ? categories.find(c => c.id === Number(editCategory)) : undefined; 

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Управління меню</h1>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="products">Продукти</TabsTrigger>
          <TabsTrigger value="ingredients">Інгредієнти</TabsTrigger>
          <TabsTrigger value="categories">Категорії</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductsTable products={products} />
        </TabsContent>

        <TabsContent value="ingredients" className="mt-6">
          <IngredientsTable ingredients={ingredients} />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoriesTable categories={categories} /> 
        </TabsContent>
      </Tabs>

      <ProductFormModal isOpen={!!addProduct || !!editProduct} productToEdit={productToEdit} categories={categories} ingredients={ingredients} />
      <IngredientFormModal isOpen={!!addIngredient || !!editIngredient} ingredientToEdit={ingredientToEdit} />
      <CategoryFormModal isOpen={!!addCategory || !!editCategory} categoryToEdit={categoryToEdit} />
    </div>
  );
}