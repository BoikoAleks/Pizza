import {
  Container,
  Filters,
  ProductGroupList,
  Stories,
  Title,
  TopBar,
} from "@/shared/components/shared";
import PaymentSuccessToast from "@/shared/components/shared/payment-success-toast";
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
      <PaymentSuccessToast />
      <Container className="mt-10">
        <Title text="Всі піци" size="lg" className="font-extrabold" />
      </Container>

      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0
        )}
      />
      <Stories />

      <Container className=" mt-10 pb-14">
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
