import { getOrdersWithParsedItems } from "@/shared/lib/get-orders-with-parsed-items";
import { OrdersTable } from "../../_components/orders-table";

import { OrderStatus } from "@prisma/client";

export default async function ManagerActiveOrdersPage() {
  const activeOrders = await getOrdersWithParsedItems({
    where: {
      status: {
        in: [
          OrderStatus.PENDING,
          "PREPARING" as OrderStatus,
          "ON_THE_WAY" as OrderStatus,
        ],
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Активні замовлення</h1>
      <p className="text-gray-500 mb-8">
        Тут показані замовлення, які очікують на обробку або виконання.
      </p>
      <OrdersTable orders={activeOrders} />
    </div>
  );
}
