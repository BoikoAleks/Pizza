export const categories = [
  {
    name: 'Піца',
  },
  {
    name: 'Комбо',
  },
  {
    name: 'Закуски',
  },
  {
    name: 'Коктейлі',
  },
  {
    name: 'Кава',
  },
  {
    name: 'Напої',
  },
  {
    name: 'Десерти',
  },
];

export const ingredients = [
  {
    name: "Шинка",
    price: 35,
    imageUrl: "/ingredients/ham.png",
  },
  {
    name: "Бекон",
    price: 35,
    imageUrl: "/ingredients/bacon.png",
  },
  {
    name: "Томати черрі",
    price: 28,
    imageUrl: "/ingredients/cherry-tomatoes.png",
  },
  {
    name: "Курка",
    price: 40,
    imageUrl: "/ingredients/chicken.png",
  },
  {
    name: "Печериці",
    price: 25,
    imageUrl: "/ingredients/mushrooms.png",
  },
  {
    name: "Гострий перець",
    price: 30,
    imageUrl: "/ingredients/spicy-pepper.png",
  },
  {
    name: "Кукурудза",
    price: 22,
    imageUrl: "/ingredients/corn.png",
  },
  {
    name: "Цибуля",
    price: 20,
    imageUrl: "/ingredients/onion.png",
  },
  {
    name: "Маслини",
    price: 25,
    imageUrl: "/ingredients/olives.png",
  },
  {
    name: "Салямі",
    price: 35,
    imageUrl: "/ingredients/salami.png",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [
    {
        name: 'Fanta',
        imageUrl: '/images/drinks/Fanta.webp',
        categoryId: 6,
    },
    {
        name: 'Dr Pepper',
        imageUrl: '/images/drinks/pepper.webp',
        categoryId: 6,
    },
    {
        name: 'Fuze Tea',
        imageUrl: '/images/drinks/Fuze.webp',
        categoryId: 6,
    },
    {
        name: 'Sandora',
        imageUrl: '/images/drinks/sandora.webp',
        categoryId: 6,
    },
    {
        name: 'Sprite',
        imageUrl: '/images/drinks/Sprite.webp',
        categoryId: 6,
    }
];
