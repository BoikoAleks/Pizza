import { prisma } from "@/prisma/prisma-client";
import { ChatList } from "./_components/chat-list";

async function getConversations() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
  return conversations;
}

// Ця сторінка тепер відповідає тільки за дані для списку
export default async function ManagerChatListPage() {
  const conversations = await getConversations();
  return <ChatList conversations={conversations} />;
}