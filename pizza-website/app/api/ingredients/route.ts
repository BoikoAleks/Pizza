import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, imageUrl } = body;
    const ingredient = await prisma.ingredient.create({ data: { name, price: Number(price) || 0, imageUrl: imageUrl ?? "" } });
    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create ingredient" }, { status: 500 });
  }
}

