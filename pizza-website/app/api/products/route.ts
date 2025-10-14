import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { checkManagerRole } from "@/app/actions";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { items: true, ingredients: true },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await checkManagerRole();
    try {
        const body = await req.json();
        const { name, imageUrl, categoryId, items, ingredients } = body;

        type Item = { price: number; size?: number; pizzaType?: number };

        const product = await prisma.product.create({
            data: {
                name,
                imageUrl: imageUrl ?? "",
                categoryId: categoryId ?? 1,
                items: {
                    create: items?.map((it: Item) => ({ price: Number(it.price) || 0, size: it.size ?? null, pizzaType: it.pizzaType ?? null })),
                },
                ...(ingredients ? { ingredients: { connect: ingredients.map((i: number) => ({ id: i })) } } : {}),
            },
            include: { items: true, ingredients: true },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
