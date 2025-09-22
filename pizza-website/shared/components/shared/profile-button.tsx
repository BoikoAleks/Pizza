// ФАЙЛ: components/shared/profile-button.tsx (ЗАМІНІТЬ ПОВНІСТЮ)
"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { CircleUser, User, Shield } from "lucide-react"; // 1. Додаємо іконку Shield
import Link from "next/link";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  // Використовуємо `status` для обробки стану завантаження
  const { data: session, status } = useSession();

  // Поки йде перевірка сесії, показуємо неактивну кнопку-заглушку
  if (status === "loading") {
    return (
      <div className={className}>
        <Button variant="outline" className="w-[100px] animate-pulse bg-gray-200" disabled />
      </div>
    );
  }

  // Якщо сесія є (користувач авторизований)
  if (session) {
    // 2. Перевіряємо роль користувача
    const isManager = session.user.role === 'MANAGER' || session.user.role === 'ADMIN';

    return (
      <div className={className}>
        {isManager ? (
          // Якщо Менеджер або Адмін - показуємо кнопку "Панель менеджера"
          <Link href="/manager">
            <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
              <Shield size={18} />
              Панель менеджера
            </Button>
          </Link>
        ) : (
          // Якщо звичайний користувач - показуємо кнопку "Профіль"
          <Link href="/profile">
            <Button variant="secondary" className="flex items-center gap-2">
              <CircleUser size={18} />
              Профіль
            </Button>
          </Link>
        )}
      </div>
    );
  }

  // Якщо сесії немає (користувач не авторизований)
  return (
    <div className={className}>
      <Button
        onClick={onClickSignIn}
        variant="outline"
        className="flex items-center gap-1"
      >
        <User size={16} />
        Ввійти
      </Button>
    </div>
  );
};