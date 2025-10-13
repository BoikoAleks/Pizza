import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);
  try {
    const product = await prisma.product.findUnique({ where: { id }, include: { items: true, ingredients: true } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);
  try {
    const body = await req.json();
    const { name, imageUrl, items, ingredients } = body;

    // Update product
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        imageUrl,
        items: items ? { updateMany: items.map((it: any) => ({ where: { id: it.id }, data: { price: Number(it.price) || 0, size: it.size ?? null, pizzaType: it.pizzaType ?? null } })) } : undefined,
        ...(ingredients ? { ingredients: { set: ingredients.map((i: number) => ({ id: i })) } } : {}),
      },
      include: { items: true, ingredients: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    // Ensure related records are removed first to avoid foreign key constraint errors
    await prisma.$transaction([
      // remove product<->ingredient links
      prisma.product.update({ where: { id }, data: { ingredients: { set: [] } } }),
      // delete product items
      prisma.productItem.deleteMany({ where: { productId: id } }),
      // finally delete the product
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
