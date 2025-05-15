import React from "react";
import { Title } from "./title";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface Props {
  title: string;
  items: any[];
  className?: string;
  listClassName?: string;
  categoryId: number;
}

export const ProductGroupList: React.FC<Props> = ({
  title,
  items,
  className,
  listClassName,
  /* categoryId, */
}) => {
  return (
    <div className={className}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {items.map((product) => (
          <ProductCard
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            key={product.id}
            price={product.items[0].price}
          />
        ))}
      </div>
    </div>
  );
};
