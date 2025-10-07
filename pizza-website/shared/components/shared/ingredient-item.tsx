import React from "react";
import { cn } from "../../lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";

interface Props {
  className?: string;
  imageUrl: string;
  name: string;
  price: number;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>; // Типізація onClick
}

/* Вибираємо інгредієнти */
export const IngredientItem: React.FC<Props> = ({
  className,
  name,
  imageUrl,
  price,
  active = false,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex items-center flex-col p-1 rounded-b-md w-32 text-center relative cursor-pointer shadow-md bg-white",
        { "border border-[var(--primary)]": active },
        className
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute top-2 right-2 text-[var(--primary)]" />
      )}
      <Image src={imageUrl} alt="ingredients" width={100} height={100} />
      <span className="text-xs mb-1">{name}</span>
      <span className="font-bold">{price} грн</span>{" "}
    </div>
  );
};
