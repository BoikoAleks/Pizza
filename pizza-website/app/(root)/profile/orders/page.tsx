import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getUserSession();

  if (!session?.id) {
    console.log(
      "Користувач не авторизований або ID відсутній. Перенаправлення..."
    );
    redirect("/not-auth");
  }

  const userIdToSearch = Number(session.id);

  const orders = await prisma.order.findMany({
    where: { userId: userIdToSearch },
    orderBy: { createdAt: "desc" },
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
                Статус: <span className="font-semibold">{order.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
