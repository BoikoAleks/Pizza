"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { Message, User } from "@prisma/client";
import { useRouter } from "next/navigation";

// Тип даних, які ми очікуємо отримати з Pusher
type UpdatedConversation = {
  id: number;
  user: User;
  messages: Message[];
};

// Компонент-слухач. Він не має власного UI.
export const ManagerNotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Підписуємось на глобальний канал, куди приходять оновлення всіх чатів
    const channel = pusher.subscribe("manager-chat-list");

    const handleUpdate = (updatedConvo: UpdatedConversation) => {
      const lastMessage = updatedConvo.messages[0];

      // Показуємо сповіщення, ТІЛЬКИ якщо останнє повідомлення від клієнта
      if (lastMessage && lastMessage.senderRole === 'USER') {
        // Створюємо кастомний toast з кнопкою "Перейти"
        toast(
          (t) => (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-bold">Нове повідомлення!</p>
                <p className="text-sm">
                  Від: <span className="font-medium">{updatedConvo.user.fullName}</span>
                </p>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {lastMessage.text}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Переходимо до чату і закриваємо сповіщення
                    router.push(`/manager/chat/${updatedConvo.id}`);
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Перейти
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Закрити
                </button>
              </div>
            </div>
          ),
          {
            icon: '💬',
            duration: 10000, // Сповіщення буде видимим 10 секунд
          }
        );
      }
    };

    // Підписуємось на подію оновлення
    channel.bind("update-conversation", handleUpdate);

    // Відписуємось при закритті компонента
    return () => {
      channel.unbind("update-conversation", handleUpdate);
      pusher.unsubscribe("manager-chat-list");
    };
  }, [router]); // Додаємо router до залежностей

  // Компонент нічого не рендерить
  return null;
};