"use client";

import { useEffect, useState, useRef } from "react";
import { Input, Button } from "@/shared/components/ui";
import { Send, User, Headset } from "lucide-react";
import Pusher from "pusher-js";
import { cn } from "@/shared/lib/utils";
import { Message } from "@prisma/client";

interface Props {
  conversationId: number;
  initialMessages: Message[];
  userName: string;
}

export const ChatInterface = ({ conversationId, initialMessages, userName }: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channelName = `chat-${conversationId}`;
    const channel = pusher.subscribe(channelName);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some(msg => msg.id === newMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };
    
    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = newMessage;
    setNewMessage("");

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: tempMessage,
          conversationId: conversationId,
        }),
      });
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Статичний хедер */}
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-bold text-lg ">{userName}</h3>
      </div>

      {/* Прокручуваний блок з повідомленнями */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => {
          const isManagerMessage = msg.senderRole === "MANAGER";
          return (
            <div
              key={msg.id || `temp-${index}`}
              className={cn("flex items-end gap-2", isManagerMessage ? "justify-end" : "justify-start")}
            >
              {!isManagerMessage && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User size={18} className="text-muted-foreground" />
                </div>
              )}
              <div
                className={cn("p-3 rounded-lg max-w-[80%] break-words",
                  isManagerMessage ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                )}
              >
                <p className="text-base">{msg.text}</p>
              </div>
              {isManagerMessage && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Headset size={18} className="text-primary-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Статична форма відправки */}
      <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t bg-card flex-shrink-0">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Відповісти клієнту..."
          autoComplete="off"
        />
        <Button type="submit" size="icon"><Send size={18} /></Button>
      </form>
    </div>
  );
};