"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
import { ProductForm } from "../product-form";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          size="4xl"
          className={cn("inline-flex gap-1 bg-gray-50 p-0", className)}
        >
          <DialogTitle>
            <ProductForm product={product} onSubmit={() => router.back()} />
          </DialogTitle>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
