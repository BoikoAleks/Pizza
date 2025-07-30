import { cn } from "@/shared/lib/utils";
import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
  imageUrl: string;
  size: 20 | 30 | 40;
}

export const PizzaImage: React.FC<Props> = ({ imageUrl, size, className }) => {
  return (
    <div className={cn("flex items-center justify-center relative w-full aspect-square", className)}>
      <Image
        src={imageUrl}
        alt="Pizza"
        fill
        className={cn(
          "object-cover transition-transform duration-300",
          {
            "transform scale-75": size === 20,
            "transform scale-90": size === 30,
            "transform scale-100": size === 40,
          }
        )}
      />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2 rounded-full border-gray-200 w-[95%] h-[95%]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-gray-100 w-[80%] h-[80%]" />
    </div>
  );
};