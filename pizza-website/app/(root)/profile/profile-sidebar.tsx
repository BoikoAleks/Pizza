"use client";

import { cn } from "@/shared/lib/utils";
import { User, History, Lock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/profile", text: "Особисті дані", Icon: User },
  { href: "/profile/orders", text: "Історія замовлень", Icon: History },
  { href: "/profile/password", text: "Зміна паролю", Icon: Lock },
];

export const ProfileSidebar = () => {
  const pathname = usePathname();

  const onClickSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="border rounded-2xl p-2">
      <ul className="space-y-1">
        {sidebarLinks.map(({ href, text, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors",
                { "bg-gray-100 font-bold": pathname === href }
              )}
            >
              <Icon size={20} />
              <span>{text}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t my-2" />
      <button
        onClick={onClickSignOut}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors w-full text-red-500"
      >
        <LogOut size={20} />
        <span>Вийти</span>
      </button>
    </div>
  );
};
