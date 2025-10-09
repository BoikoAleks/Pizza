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

  const [sortedItems, setSortedItems] = React.useState(items);

  React.useEffect(() => {
    // reset when original items prop changes
    setSortedItems(items);
  }, [items]);

  React.useEffect(() => {
    function handleSort(e: Event) {
      const detail = (e as CustomEvent).detail as { sort: string } | undefined;
      const sort = detail?.sort || "popular";
      setSortedItems((prev) => {
        const copy = [...prev];
        if (sort === "price_desc") {
          copy.sort(
            (a, b) => (b.items?.[0]?.price || 0) - (a.items?.[0]?.price || 0)
          );
        } else if (sort === "price_asc") {
          copy.sort(
            (a, b) => (a.items?.[0]?.price || 0) - (b.items?.[0]?.price || 0)
          );
        } else {
          // popular -> shuffle
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
        }
        return copy;
      });
    }

    window.addEventListener("products:sort", handleSort as EventListener);
    return () =>
      window.removeEventListener("products:sort", handleSort as EventListener);
  }, []);

  return (
    <div className={className} id={`group-${categoryId}`} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />
      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {sortedItems.map((product) => (
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
