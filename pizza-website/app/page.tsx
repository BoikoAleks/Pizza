import { Container, Filters, Title, TopBar } from "@/components/shared";
import { ProductGroupList } from "@/components/shared/product-group-list";

export default function Home() {
  return (
    <>
      <Container className="mt-8">
        <Title text="Всі піци" size="lg" className="font-extrabold" />
      </Container>

      <TopBar />

      <Container className=" mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Фільтрація*/}
          <div className="w-[250px]">
            <Filters />
          </div>

          {/* Список товарів */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductGroupList
                title="Піца"
                items={[
                  {
                    id: 1,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 2,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 3,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 4,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 5,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                ]}
                categoryId={1}
              />
              <ProductGroupList
                title="Комбо"
                items={[
                  {
                    id: 6,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 7,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 8,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 9,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 10,
                    name: "Піца",
                    imageUrl:
                      "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
                    price: 300,
                    items: [{ price: 300 }],
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
