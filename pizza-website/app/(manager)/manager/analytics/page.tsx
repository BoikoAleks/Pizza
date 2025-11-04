import { WhiteBlock } from "@/shared/components/shared/white-block";
import { getSalesAnalytics } from "@/shared/lib";
import { RevenueByDayPoint } from "@/shared/lib/get-sales-analytics";
import { OrderStatus } from "@prisma/client";

const PERIOD_DAYS = 30;
const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
});

const fullDateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "long",
});

export default async function ManagerAnalyticsPage() {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - (PERIOD_DAYS - 1));
  from.setHours(0, 0, 0, 0);

  const { revenueByDay, totals, bestSellers } = await getSalesAnalytics({
    from,
    to: now,
    statuses: [OrderStatus.SUCCEEDED],
  });

  const periodLabel = `${formatShortDate(from)} — ${formatShortDate(now)}`;
  const topBestSellers = bestSellers.slice(0, 5);
  const daysCount = revenueByDay.length || PERIOD_DAYS;
  const ordersPerDay = totals.orders / daysCount;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Аналітика продажів</h1>
        <p className="text-sm text-gray-500 mt-2">Період: {periodLabel}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Дохід"
          value={formatCurrency(totals.revenue)}
          description="Сума підтверджених замовлень"
        />
        <StatsCard
          label="Кількість замовлень"
          value={String(totals.orders)}
          description={`≈ ${ordersPerDay.toFixed(1)} на день`}
        />
        <StatsCard
          label="Середній чек"
          value={formatCurrency(totals.averageOrderValue)}
          description="Середнє значення за обраний проміжок"
        />
        <StatsCard
          label="Топова піца"
          value={topBestSellers[0]?.productName ?? "—"}
          description={
            topBestSellers[0]
              ? `${topBestSellers[0].quantity} шт. · ${formatCurrency(topBestSellers[0].revenue)}`
              : "Немає даних"
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <WhiteBlock
          title="Динаміка замовлень"
          className="lg:col-span-2"
          contentClassName="space-y-6"
        >
          <OrdersTrend data={revenueByDay} />
          <OrdersTable data={revenueByDay} />
        </WhiteBlock>

        <WhiteBlock title="Топ продажів" contentClassName="space-y-4">
          <BestSellersList items={topBestSellers} />
        </WhiteBlock>
      </section>
    </div>
  );
}

type StatsCardProps = {
  label: string;
  value: string;
  description?: string;
};

function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
      {description ? (
        <p className="mt-3 text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}

type OrdersTrendProps = {
  data: RevenueByDayPoint[];
};

function OrdersTrend({ data }: OrdersTrendProps) {
  const trendMessage = getTrendEmptyState(data);
  if (trendMessage) {
    return <p className="text-sm text-gray-500">{trendMessage}</p>;
  }

  const points = buildTrendPoints(data);
  const gradientId = "revenue-gradient";
  const firstPointDate = data[0]?.date;
  const lastPointDate = data[data.length - 1]?.date;

  return (
    <div className="space-y-4">
      <div className="relative h-48 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
              <stop
                offset="100%"
                stopColor="var(--primary)"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.15"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points.join(" ")}
          />
          <polygon
            points={`0,100 ${points.join(" ")} 100,100`}
            fill={`url(#${gradientId})`}
            opacity="0.4"
          />
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatShortDate(firstPointDate)}</span>
        <span>{formatShortDate(lastPointDate)}</span>
      </div>
    </div>
  );
}

type OrdersTableProps = {
  data: RevenueByDayPoint[];
};

function OrdersTable({ data }: OrdersTableProps) {
  if (data.length === 0) {
    return null;
  }

  const lastPoints = data.slice(-10).reverse();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Дата</th>
            <th className="px-4 py-3">Замовлень</th>
          </tr>
        </thead>
        <tbody>
          {lastPoints.map((point) => (
            <tr key={point.date} className="even:bg-white odd:bg-gray-50/40">
              <td className="px-4 py-3 font-medium text-gray-700">
                {formatFullDate(point.date)}
              </td>
              <td className="px-4 py-3 text-gray-600">{point.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type BestSellersListProps = {
  items: {
    productId: number;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
};

function BestSellersList({ items }: BestSellersListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Немає підтверджених продажів за обраний період.
      </p>
    );
  }

  const maxQuantity = Math.max(...items.map((item) => item.quantity)) || 1;

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percentage = item.quantity / maxQuantity;
        const width = `${Math.round(percentage * 100)}%`;

        return (
          <div
            key={item.productId}
            className="rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-500">
                  {item.quantity} шт. · {formatCurrency(item.revenue)}
                </p>
              </div>
              <span className="text-xs font-medium text-primary">{width}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));

const formatShortDate = (input?: string | Date) => {
  if (!input) {
    return "";
  }

  return shortDateFormatter.format(
    typeof input === "string" ? new Date(input) : input,
  );
};

const formatFullDate = (input: string | Date) =>
  fullDateFormatter.format(typeof input === "string" ? new Date(input) : input);

const getTrendEmptyState = (data: RevenueByDayPoint[]) => {
  if (data.length === 0) {
    return "За обраний період немає замовлень.";
  }

  if (data.every((point) => point.orders === 0)) {
    return "Замовлень ще не було у цей період.";
  }

  if (data.length < 2) {
    return "Потрібно більше даних, щоб показати динаміку.";
  }

  return null;
};

const buildTrendPoints = (data: RevenueByDayPoint[]) => {
  const maxOrders = Math.max(...data.map((point) => point.orders)) || 1;

  return data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (point.orders / maxOrders) * 100;
    return `${x},${y}`;
  });
};
