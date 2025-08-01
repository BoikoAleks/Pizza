import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";

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
          <Image
            width={200}
            height={200}
            src={imageUrl || "/placeholder.png"}
            alt={name}
            className="w-[500px] h-[200px] object-contain transition-all duration-300"
          />
        </div>

        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

        <p className="text-sm text-gray-500">
          Вершкова основа: сир моцарела , салямі, пармезан, оливки, шпинат,
          італійські трави
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
