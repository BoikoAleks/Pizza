// FILE: app/manager/chat/_components/chat-list.tsx
"use client";

import { useEffect, useState } from "react";
import { Conversation, Message, User } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import Pusher from "pusher-js";
import { cn } from "@/shared/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { deleteConversation } from "@/app/actions";
import toast from "react-hot-toast";

type ConversationWithDetails = Conversation & {
  user: User;
  messages: Message[];
};

interface Props {
  // Ми отримуємо початковий список з сервера, а далі він живе в стані
  conversations: ConversationWithDetails[];
}

export const ChatList = ({ conversations: initialConversations }: Props) => {
  const [conversations, setConversations] = useState(initialConversations);
  const pathname = usePathname();
  const router = useRouter();
  const activeChatId = pathname?.split("/").pop();

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("manager-chat-list");

    const handleUpdate = (updatedConvo: ConversationWithDetails) => {
      setConversations((prevConvos) => {
        const existingConvoIndex = prevConvos.findIndex(
          (c) => c.id === updatedConvo.id
        );
        const newConvos = [...prevConvos];

        if (existingConvoIndex > -1) {
          newConvos[existingConvoIndex] = updatedConvo;
        } else {
          newConvos.unshift(updatedConvo);
        }

        return newConvos.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    channel.bind("update-conversation", handleUpdate);

    return () => {
      channel.unbind("update-conversation", handleUpdate);
      pusher.unsubscribe("manager-chat-list");
    };
  }, []); // Пустий масив залежностей, щоб підписка створювалась один раз

  const handleDelete = (
    convo: ConversationWithDetails,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      confirm(`Ви впевнені, що хочете видалити чат з ${convo.user.fullName}?`)
    ) {
      startTransition(async () => {
        try {
          await deleteConversation(convo.id);
          toast.success("Чат успішно видалено.");
          if (activeChatId === String(convo.id)) {
            router.push("/manager/chat");
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Не вдалося видалити чат.");
        }
      });
    }
  };

  return (
    <nav className="flex flex-col p-2">
      {conversations.length === 0 && (
        <p className="p-4 text-center text-gray-500">Немає активних чатів.</p>
      )}
      {conversations.map((convo) => {
        const lastMessage = convo.messages[0];
        const hasUnread =
          lastMessage &&
          lastMessage.senderRole === "USER" && // Індикатор тільки для повідомлень від клієнта
          (!convo.lastViewedByManager ||
            new Date(lastMessage.createdAt) >
              new Date(convo.lastViewedByManager));

        return (
          <div key={convo.id} className="relative group">
            <Link
              href={`/manager/chat/${convo.id}`}
              scroll={false}
              className={cn(
                "block p-3 rounded-lg hover:bg-gray-100 transition-colors w-full",
                activeChatId === String(convo.id) && "bg-gray-100"
              )}
            >
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "font-medium",
                    hasUnread && "font-bold text-primary"
                  )}
                >
                  {convo.user.fullName}
                </span>
                {hasUnread && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <p
                className={cn(
                  "text-sm text-gray-500 truncate",
                  hasUnread && "text-gray-900"
                )}
              >
                {lastMessage?.text || "Немає повідомлень"}
              </p>
            </Link>

            <Button
              onClick={(e) => handleDelete(convo, e)}
              variant="ghost"
              size="icon"
              disabled={isPending}
              className="absolute top-1/2 -translate-y-1/2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      })}
    </nav>
  );
};
