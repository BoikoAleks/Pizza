"use client";

import React from "react";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "../../../../@types/prisma";
import {
  Dialog,
  DialogContent,
  DialogHeader, // <-- 1. Імпортуємо DialogHeader
  DialogTitle, // <-- 2. Імпортуємо DialogTitle
} from "../../ui/dialog";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const isPizzaForm = Boolean(product.items[0].pizzaType);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "p-6 w-[1060px] max-w-[1060px] min-h-[100px] bg-white rounded-lg overflow-hidden",
          className
        )}
        
      >
        

        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-1">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        {/* --- КІНЕЦЬ ЗМІН --- */}

        {/* Ваша логіка для вибору форми залишається незмінною */}
        {isPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            
          />
        ) : (
          <ChooseProductForm imageUrl={product.imageUrl} name={product.name} />
        )}
      </DialogContent>
    </Dialog>
  );
};