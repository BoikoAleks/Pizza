// ФАЙЛ: components/shared/chat-modal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui";
import { Button } from "../ui/button";
import { Send, User, Headset, MessageSquareHeart } from "lucide-react";
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
    };

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

    const tempId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        tempId,
        text: tempMessageText,
        senderRole: session.user.role as UserRole,
        id: 0,
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

  const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <MessageSquareHeart size={60} className="text-primary/60 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Вас вітає Republic Pizza! 🍕</h2>
      <p className="text-muted-foreground">
        Ми готові відповісти на будь-які ваші запитання. Просто напишіть нам!
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] h-[80vh] flex flex-col bg-white shadow-2xl rounded-lg">
        <div className="p-4 bg-primary text-primary-foreground text-center rounded-t-lg">
          <h2 className="text-xl font-bold">Чат з менеджером</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            messages.map((msg) => {
              const isUserMessage = msg.senderRole === session?.user.role;
              return (
                <div
                  key={msg.id || msg.tempId}
                  className={cn(
                    "flex items-end gap-3",
                    isUserMessage ? "justify-end" : "justify-start"
                  )}
                >
                  {!isUserMessage && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Headset size={22} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-2xl max-w-[80%] break-words shadow-sm",
                      isUserMessage
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  {isUserMessage && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={22} className="text-gray-600" />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 p-4 border-t bg-white rounded-b-lg"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишіть повідомлення..."
            className="flex-1 bg-gray-100 border-none focus:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-primary hover:bg-primary/90 rounded-full"
          >
            <Send size={18} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
