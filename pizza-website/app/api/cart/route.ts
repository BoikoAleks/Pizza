import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

{
  /* GET /api/cart */
}
export async function GET(req: NextRequest) {
  try {
    const userId = 1;
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ items: [] });
    }

    // Знаходимо кошик користувача за userId та token
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            userId,
          },
          {
            token,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(userCart);
  } catch (error) {
    console.log("Error fetching cart:", error);
  }
}
