"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 text-gray-500 hover:text-[var(--primary)] transition-colors"
    >
      <LogOut size={18} />
      <span>Вийти</span>
    </button>
  );
};
