import { OrdersTable } from "../../_components/orders-table";
import { getOrdersWithParsedItems } from "@/shared/lib/get-orders-with-parsed-items";
import { Prisma, OrderStatus } from "@prisma/client";

import { Pagination } from "@/shared/components/shared/pagination";
import { prisma } from "@/prisma/prisma-client";
import { SearchParams } from "@/shared/components/shared";
import { OrdersFilters } from "../../_components/orders-filters";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: SearchParams;
}

const ORDERS_PER_PAGE = 10;

export default async function ManagerAllOrdersPage({ searchParams }: Props) {
  const params = (await searchParams) as unknown as Record<
    string,
    string | undefined
  >;
  const status = params.status as OrderStatus | undefined;
  const query = params.query as string | undefined;
  const page = Number(params.page) || 1;

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(query && {
      OR: [
        { id: isNaN(Number(query)) ? undefined : Number(query) },
        { fullName: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  const orders = await getOrdersWithParsedItems({
    where,
    take: ORDERS_PER_PAGE,
    skip: (page - 1) * ORDERS_PER_PAGE,
  });

  const totalOrders = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Всі замовлення</h1>
          <p className="text-gray-500 mt-1">
            Керуйте та переглядайте історію всіх замовлень.
          </p>
        </div>
      </div>

      <OrdersFilters />

      <div className="mt-8">
        <OrdersTable orders={orders} />
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
