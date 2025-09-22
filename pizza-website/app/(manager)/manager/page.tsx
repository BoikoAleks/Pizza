// ФАЙЛ: app/manager/page.tsx
import { getUserSession } from "@/shared/lib/get-user-session";
import Link from "next/link";
import {
  ListChecks,
  ListOrdered,
  ChartNoAxesCombined,
  UtensilsCrossed,
} from "lucide-react";

// Масив для зручного рендерингу карток
const dashboardLinks = [
  {
    href: "/manager/active-orders",
    title: "Активні замовлення",
    description: "Перегляд та обробка замовлень, що очікують виконання.",
    Icon: ListChecks,
  },
  {
    href: "/manager/orders",
    title: "Всі замовлення",
    description: "Архів усіх замовлень: виконаних, активних та скасованих.",
    Icon: ListOrdered,
  },
  {
    href: "/manager/menu",
    title: "Управління меню",
    description: "Редагування піц, напоїв, інгредієнтів та категорій.",
    Icon: UtensilsCrossed,
  },
  {
    href: "/manager/analytics",
    title: "Аналітика",
    description: "Звіти про продажі та ключові показники ефективності.",
    Icon: ChartNoAxesCombined,
  },
];

export default async function ManagerDashboardPage() {
  const session = await getUserSession();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Вітаємо, {session?.name}!</h1>
      <p className="text-gray-500 mb-8">
        Оберіть розділ для продовження роботи.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardLinks.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group block p-6 bg-white rounded-lg border hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary transition-colors">
                <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <p className="mt-3 text-gray-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
