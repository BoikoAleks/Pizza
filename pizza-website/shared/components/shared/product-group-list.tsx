"use client";

import { useCategoryStore } from "@/shared/store/category";
import React from "react";
import { useIntersection } from "react-use";
import { Title } from "@/shared/components/shared/title";
import { ProductCard } from "./product-card";
import { cn } from "@/shared/lib/utils";
import { ProductWithRelations } from "@/@types/prisma";

interface Props {
  title: string;
  items: ProductWithRelations[];
  className?: string;
  listClassName?: string;
  categoryId: number;
  
}

export const ProductGroupList: React.FC<Props> = ({
  title,
  items,
  className,
  listClassName,
  categoryId,
  
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  const intersectionRef = React.useRef(null as unknown as HTMLDivElement);

  const intersection = useIntersection(intersectionRef, {
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, categoryId, setActiveCategoryId]);

  return (
    <div className={className} id={`group-${categoryId}`} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items?.[0]?.price || 0}
            ingredients={product.ingredients}
          />
        ))}
      </div>
    </div>
  );
};
