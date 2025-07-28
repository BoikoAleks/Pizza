import { hashSync } from "bcrypt";
import { prisma } from "./prisma-client";
import { categories, ingredients, products } from "./constants";

// Генератор ціни для ProductItem
const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}) => {
  return {
    productId,
    price: randomDecimalNumber(100, 500),
    pizzaType,
    size,
  };
};

async function down() {
  await prisma.productItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
}

async function up() {
  // 1. Користувачі
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

  // 2. Категорії
  await prisma.category.createMany({ data: categories });
  const dbCategories = await prisma.category.findMany();
  const pizzaCategoryId = dbCategories.find(c => c.name === "Піца")!.id;
  const drinksCategoryId = dbCategories.find(c => c.name === "Напої")!.id;
  

  // 3. Інгредієнти
  await prisma.ingredient.createMany({ data: ingredients });

  // 4. Напої та інші продукти з constants
  await prisma.product.createMany({
    data: products.map(p => ({
      ...p,
      categoryId: drinksCategoryId,
    })),
  });

  // 5. Піци з інгредієнтами
  const pizza1 = await prisma.product.create({
    data: {
      name: "Гавайська",
      imageUrl: "/images/pizza/gavaicka.webp",
      categoryId: pizzaCategoryId,
      ingredients: {
        connect: ingredients.slice(0, 5).map(i => ({ id: i.id })),
      },
    },
  });
  const pizza2 = await prisma.product.create({
    data: {
      name: "Карпезе",
      imageUrl: "/images/pizza/caprese.webp",
      categoryId: pizzaCategoryId,
      ingredients: {
        connect: ingredients.slice(5, 10).map(i => ({ id: i.id })),
      },
    },
  });
  const pizza3 = await prisma.product.create({
    data: {
      name: "Пепероні",
      imageUrl: "/images/pizza/peperoni.webp",
      categoryId: pizzaCategoryId,
      ingredients: {
        connect: ingredients.slice(10, 15).map(i => ({ id: i.id })),
      },
    },
  });

  // 6. ProductItem для піц
  await prisma.productItem.createMany({
    data: [
      // Гавайська
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 40 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

      // Карпезе
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

      // Пепероні
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 40 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

    ],
  });
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
