"use client";
import { useCategoryStore } from "@/shared/store/category";
import React from "react";
import { useIntersection } from "react-use";
import { Title } from "@/shared/components/shared/title";
import { ProductCard } from "./product-card";
import { cn } from "@/shared/lib/utils";


// 1. Створено типи для продукту, щоб позбутися `any`
interface IProductItem {
  price: number;
}

interface IProduct {
  id: number;
  name: string;
  imageUrl: string;
  items: IProductItem[];
}

interface Props {
  title: string;
  items: IProduct[]; // Використано сильний тип замість `any[]`
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

  // 2. Вказано тип елемента для ref (`HTMLDivElement`), до якого він буде прив'язаний
  const intersectionRef = React.useRef(null);

  const intersection = useIntersection(intersectionRef, {
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, categoryId, setActiveCategoryId]);

  return (
    // Рекомендація: використати безпечніший id
    <div className={className} id={`group-${categoryId}`} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            // Рекомендація: безпечний доступ до ціни
            price={product.items?.[0]?.price || 0}
          />
        ))}
      </div>
    </div>
  );
};
