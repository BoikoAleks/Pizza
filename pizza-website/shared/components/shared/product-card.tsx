/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[250px]">
          {" "}
          {/* Виправлено висоту */}
          <img
            width={700}
            height={715}
            src={imageUrl}
            alt={name}
            className="relative left-2 top-2 transition-all z-10 duration-300 w-[200px] h-[200px]"
          />{" "}
          {/* Додано alt текст */}
        </div>

        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

        <p className="text-sm text-gray-500">
          Вершкова основа: сир моцарела , салямі, пармезан, оливки, шпинат,
          італійські трави
        </p>

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
      </Link>
    </div>
  );
};
