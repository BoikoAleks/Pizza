// app/(root)/product/[id]/page.tsx - ВИПРАВЛЕНА ВЕРСІЯ

import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/shared/components/shared";
import { PizzaImage } from "@/shared/components/shared/pizza-image";
import { GroupVariants } from "@/shared/components/shared/group-variants";

// --- ПОЧАТОК ВИПРАВЛЕННЯ ---

// Приймаємо `params` як цілий об'єкт
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Дістаємо `id` з `params` вже всередині функції
  const { id } = params;

// --- КІНЕЦЬ ВИПРАВЛЕННЯ ---

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <PizzaImage imageUrl={product.imageUrl} size={40} />

        <div className="w-[490px] bg-[#FCFCFC] p-7">
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-1"
          />

          <p className="text-gray-[400]">text Details</p>

          <GroupVariants
            value="1"
            items={[
              {
                name: "Маленька ",
                value: "1",
              },
              {
                name: "Середня",
                value: "2",
              },
              {
                name: "Велика",
                value: "3",
              },
            ]}
          />
        </div>
      </div>
    </Container>
  );
}