"use client";

import React from "react";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "../../../../@types/prisma";
import { Dialog, DialogContent } from "../../ui/dialog";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const isPizzaForm = Boolean(product.items?.[0]?.pizzaType);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent size="4xl" className={cn("p-0", className)}>
        {isPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            items={product.items}
          />
        ) : (
          <ChooseProductForm imageUrl={product.imageUrl} name={product.name} />
        )}
      </DialogContent>
    </Dialog>
  );
};