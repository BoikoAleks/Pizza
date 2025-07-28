"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {/* Кількість в корзині */}
      <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
        <SheetHeader>
          <SheetTitle>
            В корзині <span className="font-bold">30 товарів</span>
          </SheetTitle>
        </SheetHeader>

        {/* товари в корзині */}
        <div className="-mx-6 mt-5 overflow-auto scrollbar flex-1">
          <div className="mb-2">
            <CartDrawerItem
              id={1}
              imageUrl="/caprese.webp"
              name="Піца Маргарита"
              price={210}
              quantity={2}
              details={getCartItemDetails(2, 30, [
                { name: "Сир" },
                { name: "Томатний соус" },
              ])}
              onClickCountButton={(type) => console.log(type)}
              onClickRemove={() => console.log("Remove item")}
            />
          </div>
        </div>
         {/* футер корзини */}       
        <SheetFooter className="-mx-0.3 bg-white p-8">
          <div className="w-full">
            <div className="flex mb-4">
              <span className="flex flex-1 text-lg text-neutral-500">
                Всього
                <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
              </span>

              <span className="font-bold text-lg">210 грн</span>
            </div>
            {/* кнопка оформлення замовлення */}
            <Link href="/checkout">
              <Button type="submit" className="w-full h-12 text-base">
                Оформити заказ
                <ArrowRight className="w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
