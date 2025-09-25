"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";

import { useSession } from "next-auth/react";
import { ChatModal } from "./chat-modal";

export const ChatTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  // Показуємо кнопку чату тільки для авторизованих звичайних користувачів
  if (status !== "authenticated" || session.user.role !== "USER") {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <Button onClick={() => setIsOpen(true)} size="icon" className="rounded-full w-14 h-14 shadow-lg">
          <MessageSquare />
        </Button>
      </div>
      
      {/* Модальне вікно, яке відкривається/закривається */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};