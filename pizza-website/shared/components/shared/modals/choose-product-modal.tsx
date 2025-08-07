"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
// 1. ІМПОРТУЄМО DialogPortal та DialogOverlay
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay 
} from "../../ui/dialog";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { ChooseProductForm } from "../choose-product-form";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/shared/store";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  
  // Додаємо опціональний ланцюжок для безпеки
  const firstItem = product.items?.[0]; 
  const isPizzaForm = Boolean(firstItem?.pizzaType);

  // Виправляємо виклик useCartStore, щоб уникнути нескінченних циклів
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      // Використовуємо опціональний ланцюжок для безпеки
      const itemId = productItemId ?? firstItem?.id;
      
      if (!itemId) {
        toast.error("Не вдалося визначити товар.");
        return;
      }

      await addCartItem({
        productItemId: itemId,
        ingredients,
      });
      toast.success(product.name + " добавлено в кошик");
      router.back();
    } catch (err) {
      toast.error("Не вдалось добавити товар в кошик");
      console.error(err);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => {
      if (!isOpen) {
        router.back();
      }
    }}>
      {/* 2. ДОДАЄМО ПОРТАЛ. Все, що всередині, буде "телепортовано" */}
      <DialogPortal>
        {/* 3. ДОДАЄМО ОВЕРЛЕЙ для затемнення фону */}
        <DialogOverlay />

        <DialogContent size="4xl" className={cn("p-0", className)}>
          <DialogTitle> 
          {isPizzaForm ? (
            <ChoosePizzaForm
              imageUrl={product.imageUrl}
              name={product.name}
              ingredients={product.ingredients}
              items={product.items}
              onSubmit={onSubmit}
              loading={loading}
            />
          ) : (
            <ChooseProductForm
              imageUrl={product.imageUrl}
              name={product.name}
              onSubmit={onSubmit}
              price={firstItem?.price}
              loading={loading}
            />
          )}
          </DialogTitle>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};