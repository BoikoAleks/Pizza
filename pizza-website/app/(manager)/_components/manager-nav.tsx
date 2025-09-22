// ФАЙЛ: app/manager/_components/manager-nav.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import {
  LayoutDashboard,
  ListOrdered,
  UtensilsCrossed,
  ChartNoAxesCombined,
} from "lucide-react";

// Масив з посиланнями для зручного керування
const navLinks = [
  { href: "/manager", text: "Головна", Icon: LayoutDashboard },
  { href: "/manager/orders", text: "Замовлення", Icon: ListOrdered },
  { href: "/manager/menu", text: "Управління меню", Icon: UtensilsCrossed },
  { href: "/manager/analytics", text: "Аналітика", Icon: ChartNoAxesCombined },
];

export const ManagerNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {navLinks.map(({ href, text, Icon }) => {
        const isActive =
          pathname === href ||
          (pathname.startsWith(href) && href !== "/manager");

        const isMainActive = pathname === "/manager";

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
              (href === "/manager" ? isMainActive : isActive)
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            )}
          >
            <Icon size={16} />
            <span>{text}</span>
          </Link>
        );
      })}
    </div>
  );
};
