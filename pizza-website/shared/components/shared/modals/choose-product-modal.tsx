"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
import { Dialog, DialogContent, DialogTitle} from "../../ui/dialog";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { ChooseProductForm } from "../choose-product-form";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/shared/store";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const firstItem = product.items[0];
  const isPizzaForm = Boolean(product.items?.[0]?.pizzaType);
  const addCartItem = useCartStore((state) => state.addCartItem);

  const onAddProduct = () => {
    addCartItem({
      productItemId: firstItem.id,
    });
  };

  const onAddPizza = (productItemId: number, ingredients: number[]) => {
    addCartItem({
      productItemId,
      ingredients,
    });
  };


  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent size="4xl" className={cn("p-0", className)}>
        <DialogTitle className="bg-white"></DialogTitle>
        {isPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            items={product.items}
            onSubmit={onAddPizza}
          />
        ) : (
          <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.name}
            onSubmit={onAddProduct}
            price={firstItem?.price}
          />
        )}
      </DialogContent>
    </Dialog>
    
  );
};
