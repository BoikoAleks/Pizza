
import React from "react";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { cn } from "../../lib/utils";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Ліва частина */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <div>
              <h1 className="text-2xl uppercase font-black">Republic </h1>
              {/* <p className="text-sm text-gray-400 leading-3">смачніше просто немає</p> */}
            </div>
          </div>
        </Link>

        <div className="mx-10 flex-1">
            <SearchInput /> 
            </div>

        


        {/* Права частина */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <User size={16} />
            Вхід
          </Button>

          <div>
            <Button className="group relative">
              <b>210 ₴ </b>
              <span className="h-full w-[1px] bg-white/30 mx-3" />
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart
                  size={16}
                  className="h-4 w-4 relative"
                  strokeWidth={2}
                />
                <b>3</b>
              </div>
              <ArrowRight
                size={20}
                className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
