import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";
import {
  getOrdersWithParsedItems,
  PIZZA_CRUSTS,
} from "@/shared/lib/get-orders-with-parsed-items";

export default async function OrdersPage() {
  const session = await getUserSession();

  if (!session?.id) {
    console.log(
      "Користувач не авторизований або ID відсутній. Перенаправлення..."
    );
    redirect("/not-auth");
  }

  const userIdToSearch = Number(session.id);

  const orders = await getOrdersWithParsedItems({
    where: { userId: userIdToSearch },
  });

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="text-2xl font-bold mb-6">Історія замовлень</h2>
      {orders.length === 0 ? (
        <p>У вас ще немає замовлень.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-3.5 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="font-bold">Замовлення №{order.id}</p>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2">
                Сума:{" "}
                <span className="font-semibold">{order.totalAmount} грн</span>
              </p>
              <p>
                Статус:{" "}
                <span className="font-semibold">
                  {(() => {
                    const map: Record<string, string> = {
                      PENDING: "В очікуванні",
                      PREPARING: "Готується",
                      ON_THE_WAY: "В дорозі",
                      SUCCEEDED: "Виконано",
                      CANCELLED: "Скасовано",
                    };
                    return map[String(order.status)] || String(order.status);
                  })()}
                </span>
              </p>

              {/* Collapsible details with ordered items */}
              <details className="mt-3" role="group">
                <summary className="cursor-pointer text-sm text-[var(--primary)]">
                  Показати вміст замовлення
                </summary>
                <div className="mt-2 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-2 bg-white rounded border">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold">
                            {item.productItem.product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.productItem.size
                              ? `${item.productItem.size} см`
                              : null}
                            {item.productItem.pizzaType
                              ? ` • ${PIZZA_CRUSTS[item.productItem.pizzaType]}`
                              : null}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          x{item.quantity}
                        </div>
                      </div>
                      {item.ingredients && item.ingredients.length > 0 && (
                        <div className="text-sm text-gray-600 mt-2">
                          Інгредієнти:{" "}
                          {item.ingredients.map((i) => i.name).join(", ")}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 mt-2">
                        Ціна:{" "}
                        <span className="font-semibold">
                          {item.productItem.price} грн
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
