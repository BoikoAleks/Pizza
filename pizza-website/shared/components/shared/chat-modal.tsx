// ФАЙЛ: components/shared/chat-modal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui";
import { Button } from "../ui/button";
import { Send, User, Headset } from "lucide-react";
import Pusher from "pusher-js";

import { cn } from "@/shared/lib/utils";
import { useSession } from "next-auth/react";
import { Message, UserRole } from "@prisma/client";
import { getChatMessages } from "@/app/actions";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Створюємо тимчасовий тип для повідомлень, які ще не мають ID з бази
type TempMessage = Message & { tempId?: string };

export const ChatModal = ({ isOpen, onClose }: Props) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<TempMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      getChatMessages().then((conversation) => {
        if (conversation) {
          setMessages(conversation.messages);
          setConversationId(conversation.id);
        } else {
          setMessages([]);
          setConversationId(null);
        }
      });
    }
  }, [isOpen]);

  // Підписка на Pusher
  useEffect(() => {
    if (!conversationId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${conversationId}`);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => {
        if (
          newMessage.id &&
          prevMessages.some((msg) => msg.id === newMessage.id)
        ) {
          return prevMessages;
        }
        const optimisticIndex = prevMessages.findIndex(
          (msg) => !msg.id && msg.text === newMessage.text
        );
        if (optimisticIndex > -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages[optimisticIndex] = newMessage;
          return updatedMessages;
        }
        return [...prevMessages, newMessage];
      });
    };
    const handleConversationDeleted = () => {
      toast.error("Цей чат було видалено менеджером.");
      setMessages([]);
      setConversationId(null);
      onClose();

    }

    channel.bind("new-message", handleNewMessage);
    channel.bind("conversation-deleted", handleConversationDeleted);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      channel.unbind("conversation-deleted", handleConversationDeleted);
      pusher.unsubscribe(`chat-${conversationId}`);
      pusher.disconnect();
    };
  }, [conversationId, onClose]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user.role) return;

    const tempMessageText = newMessage;
    setNewMessage("");

    // --- ВИПРАВЛЕННЯ 1: Створюємо унікальний тимчасовий ID ---
    const tempId = crypto.randomUUID();

    // Оптимістичне оновлення UI
    setMessages((prev) => [
      ...prev,
      {
        tempId, // <-- Унікальний ID
        text: tempMessageText,
        senderRole: session.user.role as UserRole,
        // Додаємо інші поля, щоб відповідати типу Message
        id: 0, // тимчасовий
        conversationId: conversationId || 0,
        createdAt: new Date(),
      },
    ]);

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: tempMessageText }),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[70vh] flex flex-col bg-card shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="">Чат з підтримкою</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUserMessage = msg.senderRole === session?.user.role;
            return (
              <div
                key={msg.id || msg.tempId} // <-- Використовуємо tempId як ключ
                className={cn(
                  "flex items-end gap-2",
                  isUserMessage ? "justify-end" : "justify-start"
                )}
              >
                {!isUserMessage && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Headset size={18} className="text-muted-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[80%] break-words",
                    isUserMessage
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                {isUserMessage && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User size={18} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 p-4 border-t bg-card"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ваше повідомлення..."
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
