"use client";

import { OrderStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions";
import toast from "react-hot-toast";
import { cn } from "@/shared/lib/utils";

interface Props {
  orderId: number;
  currentStatus: OrderStatus;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-orange-100 text-orange-800",
  ON_THE_WAY: "bg-blue-100 text-blue-800",
  SUCCEEDED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const OrderStatusChanger = ({ orderId, currentStatus }: Props) => {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success(`Статус замовлення #${orderId} оновлено!`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Помилка при оновленні статусу.");
        setStatus(currentStatus);
      }
    });
  };

  return (
    <select
      value={status}
      onClick={(e) => e.stopPropagation()}
      onChange={handleChange}
      disabled={isPending}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
        statusColors[status]
      )}
    >
      <option value={OrderStatus.PENDING}>В очікуванні</option>
      <option value={"PREPARING" as OrderStatus}>Готується</option>
      <option value={"ON_THE_WAY" as OrderStatus}>В дорозі</option>
      <option value={OrderStatus.SUCCEEDED}>Виконано</option>
      <option value={OrderStatus.CANCELLED}>Скасовано</option>
    </select>
  );
};
