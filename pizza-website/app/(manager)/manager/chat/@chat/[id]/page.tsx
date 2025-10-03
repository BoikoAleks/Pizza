import { prisma } from "@/prisma/prisma-client";
import { ChatInterface } from "./_components/chat-interface";

interface Props {
  params: { id: string };
}

async function getConversation(id: number) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  return conversation;
}

export default async function ManagerChatPage({ params }: Props) {
  const resolvedParams = (await params) as unknown as { id: string };
  const conversationId = Number(resolvedParams.id);

  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return <div className="p-10 text-center">Чат не знайдено.</div>;
  }

  return (
    <ChatInterface
      conversationId={conversation.id}
      initialMessages={conversation.messages}
      userName={conversation.user.fullName}
    />
  );
}
