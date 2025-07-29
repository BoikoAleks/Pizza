
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma-client";
import { ChooseProductModal } from "@/shared/components/shared";

export default async function ProductPage(props: { params: { id: string } }) {
  const { id } = await props.params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },

    include: {
      items: true,
      ingredients: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return <ChooseProductModal product={product} />;
}
