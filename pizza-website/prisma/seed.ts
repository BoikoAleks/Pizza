import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

async function up() {
  console.log(11111);
  await prisma.user.createMany({
    data: [
      {
        fullName: "User",
        email: "user@gmail.com",
        password: hashSync("11111", 10),
        verified: false,
        role: "USER",
      },
      {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: hashSync("11111", 10),
        verified: true,
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Піца",
      },
      {
        name: "Комбо",
      },
      {
        name: "Закуски",
      },
      {
        name: "Коктейлі",
      },
      {
        name: "Кава",
      },
      {
        name: "Напої",
      },
      {
        name: "Десерти",
      },
    ],
  });
  await prisma.ingredient.createMany({
    data: [
      {
        name: "Шинка",
        price: 35,
        imageUrl: "https://api.pizza.black/ingredients-resized/ham.png",
      },
      {
        name: "Бекон",
        price: 35,
        imageUrl: "https://api.pizza.black/ingredients-resized/bacon.png",
      },
      {
        name: "Томати черрі",
        price: 28,
        imageUrl:
          "https://api.pizza.black/ingredients-resized/tomatoes-cherry.png",
      },
      {
        name: "Курка",
        price: 40,
        imageUrl: "https://api.pizza.black/ingredients-resized/chicken.png",
      },
      {
        name: "Печериці",
        price: 25,
        imageUrl: "https://api.pizza.black/ingredients-resized/mushrooms.png",
      },
      {
        name: "Гострий перець",
        price: 30,
        imageUrl:
          "https://api.pizza.black/ingredients-resized/pepper-chile.png",
      },
      {
        name: "Кукурудза",
        price: 22,
        imageUrl: "https://api.pizza.black/ingredients-resized/corn.png",
      },
      {
        name: "Цибуля",
        price: 20,
        imageUrl: "https://api.pizza.black/ingredients-resized/onion.png",
      },
      {
        name: "Маслини",
        price: 25,
        imageUrl: "https://api.pizza.black/ingredients-resized/olives.png",
      },
      {
        name: "Салямі",
        price: 35,
        imageUrl: "https://api.pizza.black/ingredients-resized/salami.png",
      },
    ].map((obj, index) => ({ id: index + 1, ...obj })),
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Тест Не піцца має бути",
        imageUrl:
          "https://cdn-media.choiceqr.com/prod-eat-nonnamacarona/menu/PLCtGlF-FtdyHMk-UyDkYDy.webp",
        categoryId: 1,
      },
    ],
  });

  const pizza1 = await prisma.product.create({
    data: {
      name: 'Гавайська',
      imageUrl:
        "https://api.pizza.black/storage/productImages/2022/9/2/55/%D0%93%D0%B0%D0%B2%D0%B0%D1%96%CC%88.webp",
      categoryId: 1,
      ingredients: {
        connect: ingredient.slice(0, 5),
      },
    },
  });
  const pizza2 = await prisma.product.create({
    data: {
      name: 'Карпезе',
      imageUrl:
        "https://api.pizza.black/storage/productImages/2022/9/2/94/%D0%9A%D0%B0%D0%BF%D1%80%D0%B5%D0%B7%D0%B51.webp",
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(5, 10),
      },
    },
  });

  await prisma.productItem
}

async function down() {
  await prisma.user.deleteMany({});
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
