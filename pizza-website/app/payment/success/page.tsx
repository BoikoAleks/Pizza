"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const REDIRECT_DELAY_SECONDS = 5;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_SECONDS);

  const amount = searchParams.get("amount") ?? "0";
  const orderId = searchParams.get("orderId") ?? "";

  const formattedAmount = useMemo(() => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) {
      return "0 грн";
    }

    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0,
    }).format(numeric);
  }, [amount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-fuchsia-500 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white/10 backdrop-blur rounded-3xl border border-white/20 shadow-2xl p-10 text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 rounded-full p-3">
              <CheckCircle2 size={48} className="text-lime-300" />
            </div>
          </div>

          <h1 className="text-4xl font-semibold mb-2">
            Оплату успішно завершено!
          </h1>
          {orderId ? (
            <p className="text-white/80 mb-6">
              Замовлення <span className="font-semibold">#{orderId}</span>{" "}
              сплачено.
            </p>
          ) : (
            <p className="text-white/80 mb-6">Дякуємо, що обрали Next Pizza!</p>
          )}

          <div className="bg-white text-purple-600 rounded-2xl px-6 py-5 text-3xl font-bold inline-block mb-8">
            {formattedAmount}
          </div>

          <p className="text-sm text-white/70 mb-6">
            Ми перенаправимо вас на головну сторінку за {secondsLeft} с.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-purple-50 transition"
            >
              Повернутися на головну
            </Link>
            <Link
              href="/profile/orders"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/40 font-semibold hover:border-white transition"
            >
              Переглянути замовлення
            </Link>
          </div>
        </div>
      </main>

      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-fuchsia-800">
        <div className="px-4 py-3 text-center text-white/80 text-sm">
          &copy; {new Date().getFullYear()} Republic Pizza. Всі права захищено.
        </div>
      </div>
    </div>
  );
}
