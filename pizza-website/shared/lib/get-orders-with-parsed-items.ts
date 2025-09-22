import { prisma } from "@/prisma/prisma-client";
import { Prisma, Product, ProductItem, Ingredient, Order, User } from "@prisma/client";

export const PIZZA_CRUSTS: Record<number, string> = { 1: "Класичний бортик", 2: "Сирний бортик", 3: "Мисливський бортик" };


export type ParsedCartItem = {
    id: number;
    quantity: number;
    productItem: ProductItem & { product: Product };
    ingredients: Ingredient[];
};

export type OrderWithUserAndItems = Omit<Order, 'items'> & {
    user: User | null;
    items: ParsedCartItem[];
};

export async function getOrdersWithParsedItems(args?: Prisma.OrderFindManyArgs): Promise<OrderWithUserAndItems[]> {
    const orders = await prisma.order.findMany({
        ...args,
        orderBy: { createdAt: "desc" }, // Завжди сортуємо від нових до старих
        include: { user: true },
    });


    const ordersWithParsedItems = orders.map((order) => ({
        ...order,
        items: JSON.parse(order.items as string) as ParsedCartItem[],
    }));

    return ordersWithParsedItems;
}