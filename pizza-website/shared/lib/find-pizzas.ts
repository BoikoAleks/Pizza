// shared/lib/find-pizzas.ts

import { prisma } from '@/prisma/prisma-client';

export interface GetSearchParams {
    query?: string;
    sortBy?: string;
    sizes?: string;
    pizzaTypes?: string;
    ingredients?: string;
    priceFrom?: string;
    priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500;

export const findPizzas = async (params: GetSearchParams) => {
    // 1. Обробляємо вхідні параметри
    const sizes = params.sizes ? params.sizes.split(',').map(Number) : [];
    const pizzaTypes = params.pizzaTypes ? params.pizzaTypes.split(',').map(Number) : [];
    const ingredientsIdArr = params.ingredients ? params.ingredients.split(',').map(Number) : [];
    const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
    const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

    // 2. Визначаємо, чи активний хоч один фільтр
    const isAnyFilterActive =
        sizes.length > 0 ||
        pizzaTypes.length > 0 ||
        ingredientsIdArr.length > 0 ||
        !!params.priceFrom || // Перевіряємо, чи були встановлені ціни вручну
        !!params.priceTo;

    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    orderBy: {
                        id: 'desc',
                    },
                    ...(isAnyFilterActive && {
                        where: {
                            ...(ingredientsIdArr.length > 0 && {
                                ingredients: { some: { id: { in: ingredientsIdArr } } },
                            }),
                            items: {
                                some: {
                                    ...(sizes.length > 0 && { size: { in: sizes } }),
                                    ...(pizzaTypes.length > 0 && { pizzaType: { in: pizzaTypes } }),
                                    price: {
                                        gte: minPrice,
                                        lte: maxPrice,
                                    },
                                },
                            },
                        },
                    }),

                    // Завантажуємо пов'язані дані для знайдених продуктів
                    include: {
                        ingredients: true,
                        items: {
                            orderBy: {
                                price: 'asc',
                            },
                        },
                    },
                },
            },
        });

        return categories;
    } catch (error) {
        console.error('Error fetching pizzas:', error);
        throw new Error('Error fetching categories from the database');
    }
};