// FILE: app/api/chat/route.ts

import { getUserSession } from "@/shared/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/shared/lib/pusher";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getUserSession();
    const { text, conversationId } = await req.json();

    if (!session?.id || !text) {
      return NextResponse.json({ error: "Unauthorized or missing text" }, { status: 401 });
    }

    const senderRole = session.role as UserRole;
    let targetConversationId: number;

    if (senderRole === 'MANAGER' || senderRole === 'ADMIN') {
      if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID is required for managers" }, { status: 400 });
      }
      targetConversationId = conversationId;
    } else {
      const userId = Number(session.id);
      let conversation = await prisma.conversation.findUnique({ where: { userId } });
      if (!conversation) {
        conversation = await prisma.conversation.create({ data: { userId } });
      }
      targetConversationId = conversation.id;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: targetConversationId,
        text,
        senderRole,
      },
    });
    
    // Оновлюємо час останньої активності та отримуємо оновлену розмову з усіма деталями
    const updatedConversation = await prisma.conversation.update({
      where: { id: targetConversationId },
      data: { updatedAt: new Date() },
      include: { 
        user: true, 
        messages: { orderBy: { createdAt: 'desc' }, take: 1 } 
      },
    });

    // Подія 1: Відправляємо нове повідомлення в канал конкретного чату
    const chatChannel = `chat-${targetConversationId}`;
    await pusherServer.trigger(chatChannel, "new-message", message);
    
    // Подія 2: Відправляємо оновлену розмову в глобальний канал для списку чатів менеджера
    const listChannel = `manager-chat-list`;
    await pusherServer.trigger(listChannel, "update-conversation", updatedConversation);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("[CHAT_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}