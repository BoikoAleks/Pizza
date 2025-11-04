import { prisma } from "@/prisma/prisma-client";
import { OrderStatus, Prisma } from "@prisma/client";
import { ParsedCartItem } from "./get-orders-with-parsed-items";

const DEFAULT_STATUSES = [OrderStatus.SUCCEEDED];

export type SalesAnalyticsFilters = {
  from?: Date;
  to?: Date;
  statuses?: OrderStatus[];
};

export type SalesTotals = {
  revenue: number;
  orders: number;
  averageOrderValue: number;
};

export type RevenueByDayPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type BestSeller = {
  productId: number;
  productName: string;
  quantity: number;
  revenue: number;
};

export type SalesAnalyticsResult = {
  totals: SalesTotals;
  revenueByDay: RevenueByDayPoint[];
  bestSellers: BestSeller[];
};

export async function getSalesAnalytics(
  filters: SalesAnalyticsFilters = {}
): Promise<SalesAnalyticsResult> {
  const { from, to, statuses = DEFAULT_STATUSES } = filters;

  const where: Prisma.OrderWhereInput = {
    status: { in: statuses },
  };

  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = from;
    }
    if (to) {
      where.createdAt.lte = to;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  if (orders.length === 0) {
    return {
      totals: { revenue: 0, orders: 0, averageOrderValue: 0 },
      revenueByDay: [],
      bestSellers: [],
    };
  }

  const productMap = new Map<number, BestSeller>();
  const dayMap = new Map<string, { revenue: number; orders: number }>();

  let revenue = 0;

  for (const order of orders) {
    revenue += order.totalAmount;

    const dayKey = formatDateKey(order.createdAt);
    const dayEntry = dayMap.get(dayKey) ?? { revenue: 0, orders: 0 };
    dayEntry.revenue += order.totalAmount;
    dayEntry.orders += 1;
    dayMap.set(dayKey, dayEntry);

    const parsedItems = safeParseItems(order.items);
    for (const item of parsedItems) {
      const productId = item.productItem?.product?.id ?? item.productItem?.productId;
      if (!productId) {
        continue;
      }

      const productName = item.productItem?.product?.name ?? `Продукт #${productId}`;
      const itemRevenue = (item.productItem?.price ?? 0) * item.quantity;

      const productEntry = productMap.get(productId) ?? {
        productId,
        productName,
        quantity: 0,
        revenue: 0,
      };

      productEntry.quantity += item.quantity;
      productEntry.revenue += itemRevenue;
      productMap.set(productId, productEntry);
    }
  }

  const start = normalizeStart(from ?? orders[0]?.createdAt);
  const finish = normalizeEnd(to ?? orders[orders.length - 1]?.createdAt);

  const revenueByDay: RevenueByDayPoint[] = [];
  for (let cursor = new Date(start); cursor <= finish; cursor.setDate(cursor.getDate() + 1)) {
    const key = formatDateKey(cursor);
    const entry = dayMap.get(key) ?? { revenue: 0, orders: 0 };
    revenueByDay.push({ date: key, revenue: entry.revenue, orders: entry.orders });
  }

  const totals: SalesTotals = {
    revenue,
    orders: orders.length,
    averageOrderValue: orders.length === 0 ? 0 : Number((revenue / orders.length).toFixed(2)),
  };

  const bestSellers = Array.from(productMap.values()).sort((a, b) => {
    if (b.quantity === a.quantity) {
      return b.revenue - a.revenue;
    }
    return b.quantity - a.quantity;
  });

  return {
    totals,
    revenueByDay,
    bestSellers,
  };
}

function safeParseItems(raw: unknown): ParsedCartItem[] {
  if (Array.isArray(raw)) {
    return raw as ParsedCartItem[];
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as ParsedCartItem[]) : [];
    } catch (error) {
      console.error("[getSalesAnalytics] Failed to parse order items", error);
      return [];
    }
  }

  if (raw && typeof raw === "object") {
    return [];
  }

  return [];
}

function formatDateKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function normalizeStart(date?: Date): Date {
  const value = date ? new Date(date) : new Date();
  value.setHours(0, 0, 0, 0);
  return value;
}

function normalizeEnd(date?: Date): Date {
  const value = date ? new Date(date) : new Date();
  value.setHours(23, 59, 59, 999);
  return value;
}