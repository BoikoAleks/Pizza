// app/(root)/@modal/(.)product/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma-client";
import { ChooseProductModal } from "@/shared/components/shared";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  
  // --- ПОЧАТОК ВИПРАВЛЕННЯ ---
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    // Додаємо `include`, щоб отримати пов'язані дані,
    // яких вимагає компонент ChooseProductModal
    include: {
      items: true,
      ingredients: true,
    },
  });
  // --- КІНЕЦЬ ВИПРАВЛЕННЯ ---

  if (!product) {
    return notFound();
  }

  // Тепер `product` матиме правильний тип і помилка зникне
  return <ChooseProductModal product={product} />;
}