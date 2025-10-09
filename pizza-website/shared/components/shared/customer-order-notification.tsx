"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const CustomerOrderNotification = ({
  userId,
}: {
  userId: number | null;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    
    const channelName = `server-to-user-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handler = (data: { orderId: number; status: string }) => {
      const localizedStatusMap: Record<string, string> = {
        PENDING: "Підтверджено",
        PREPARING: "Готується",
        ON_THE_WAY: "В дорозі",
        DELIVERED: "Доставлено",
        CANCELED: "Скасовано",
      };

      const statusLabel = localizedStatusMap[data.status] || data.status;

      toast(
        (t) => (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold">Оновлення замовлення #{data.orderId}</p>
              <p className="text-sm text-gray-600">
                Статус: <span className="font-medium">{statusLabel}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  router.push("/profile/orders");
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Переглянути
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
        { icon: "🔔", duration: 10000 }
      );
    };

    channel.bind("order-status-updated", handler);

    return () => {
      try {
        channel.unbind("order-status-updated", handler);
        pusher.unsubscribe(channelName);
      } catch (e) {
        
      }
    };
  }, [userId, router]);

  return null;
};
