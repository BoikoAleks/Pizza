import { prisma } from "@/prisma/prisma-client";
import {
  Container,
  Filters,
  ProductGroupList,
  Title,
  TopBar,
} from "@/shared/components/shared";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true,
        },
      },
    },
  });

  return (
    <>
      <Container className="mt-8">
        <Title text="Всі піци" size="lg" className="font-extrabold" />
      </Container>

      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0
          
        )}
      />

      <Container className=" mt-9 pb-5">
        <div className="flex gap-56">
          {/* Фільтрація*/}
          <div className="w-44">
            <Filters />
          </div>

          {/* Список товарів */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
