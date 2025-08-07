import {
  Container,
  Filters,
  ProductGroupList,
  Title,
  TopBar,
} from "@/shared/components/shared";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizzas";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const plainSearchParams = await searchParams;
  const categories = await findPizzas(plainSearchParams as GetSearchParams);
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
            <Suspense>
              <Filters />
            </Suspense>
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
