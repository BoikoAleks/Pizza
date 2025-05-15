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
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[250[x]">
          <img className="w-[215px] h-[215px]" src={imageUrl} alt={name} />
        </div>

        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

        <p className="text-sm text-gray-400">
          Вершкова основа: сир моцарела , салямі, пармезан, оливки, шпинат,
          італійські трави
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-[20px]">
            від <b>{price} ₴</b>
          </span>
          <Button variant="secondary" className="text-basse font-bold">
            <Plus size={20} className="mr-1" />
            Добавити
          </Button>
        </div>
      </Link>
    </div>
  );
};
