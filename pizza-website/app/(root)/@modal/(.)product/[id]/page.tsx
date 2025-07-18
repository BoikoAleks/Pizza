import { notFound } from "next/navigation";
import { prisma } from "../../../../../prisma/prisma-client";
import {
  ChooseProductModal,
  Container,
} from "../../../../../shared/components/shared";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <ChooseProductModal product={product} />
    </Container>
  );
}
