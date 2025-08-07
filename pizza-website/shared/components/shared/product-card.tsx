'use client';

import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Ingredient } from "@prisma/client";

interface Props {
  id: number;
  name: string;
  price: number;
  ingredients: Ingredient[];
  imageUrl?: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  ingredients,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center items-center p-6 bg-secondary rounded-lg h-[250px] overflow-hidden">
          <div className="relative w-full h-full">
            {" "}
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={name}
              fill
              className="object-contain transition-all duration-300"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>

        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

        <p className="text-sm text-gray-500">
          {ingredients.map((ingredient) => ingredient.name).join(", ")}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-4">
        <span className="text-[20px]">
          від <b>{price} ₴</b>
        </span>
        <Button
          variant="secondary"
          className="text-base font-bold"
          aria-label={`Add ${name} to cart`}
        >
          <Plus size={20} className="mr-1" />
          Добавити
        </Button>
      </div>
    </div>
  );
};
