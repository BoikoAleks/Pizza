"use client";

import { useState } from "react";

import { OrderStatusChanger } from "./order-status-changer";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { OrderWithUserAndItems, PIZZA_CRUSTS } from "@/shared/lib/get-orders-with-parsed-items";


interface Props {
  order: OrderWithUserAndItems;
}


export const OrderRow = ({ order }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer hover:bg-gray-50 "
      >
        <td className="pl-4">
          <ChevronDown
            className={cn("transition-transform", isOpen && "rotate-180")}
            size={16}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{order.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.user?.fullName || order.fullName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.totalAmount} грн
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="p-4">
            <div className="p-4 bg-white rounded-md border">
              <h4 className="font-bold text-md mb-3">Деталі замовлення:</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm border-b pb-1.5 last:border-b-0"
                  >
                    <div className="font-semibold">
                      {item.productItem.product.name} - {item.quantity} шт.
                      {item.productItem.size && (
                        <span className="font-normal text-gray-500 ml-2">
                          ({[item.productItem.size]}) см
                        </span>
                      )}
                    </div>

                    {item.productItem.pizzaType && (
                      <div className="text-xs text-gray-600 pl-2">
                        Тип: {PIZZA_CRUSTS[item.productItem.pizzaType]}
                      </div>
                    )}

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mt-1 pl-2">
                        <span className="text-xs font-semibold text-gray-700">
                          Додатки:
                        </span>
                        <ul className="list-disc pl-4 text-xs text-gray-600">
                          {item.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>{ingredient.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-2 focus-visible:ring-[var(--ring)] ">
                <p className="font-semibold mt-2 focus-visible:ring-[var(--ring)]">Телефон:</p>
                <p className="text-sm text-gray-600 pl-1">{order.phone}</p>
                <p className="font-semibold">Адреса доставки:</p>
                <p className="text-sm text-gray-600 pl-1">{order.address}</p>          
                <p className="font-semibold mt-2">Час доставки:</p>
                <p className="text-sm text-gray-600 pl-1">{order.deliveryTime}</p>
                <p className="font-semibold mt-2">Загальна сума:</p>
                <p className="text-sm text-gray-600 pl-1 ">{order.totalAmount} грн</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
