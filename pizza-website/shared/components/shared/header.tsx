import React from "react";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui";
import { User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { cn } from "../../lib/utils";
import { CartButton } from "./cart-button";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn(" border-gray-300", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Ліва частина */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <div>
              <h1 className="text-2xl uppercase font-black">Republic </h1>
               <p className="text-sm text-gray-400 leading-3">смачніше просто немає</p> 
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
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
