import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
// Створимо цю дію далі
import { Button } from "@/shared/components/ui";
import { createCheckoutSession } from "@/app/actions";
import { loadStripe } from "@stripe/stripe-js";

export default async function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const awaitedParams = await params;
  const orderId = Number(awaitedParams.orderId);

  if (isNaN(orderId)) {
    return notFound();
  }
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("Missing Stripe publishable key");
  }
  
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold">Оплата замовлення #{order.id}</h1>
      <p className="mt-4 text-lg">
        Сума до сплати: <b className="text-2xl">{order.totalAmount} ₴</b>
      </p>

      <div className="mt-8 max-w-sm mx-auto">
        {/* Ця форма викличе нашу серверну дію */}
        <form action={createCheckoutSession}>
          {/* Ми передаємо orderId через приховане поле */}
          <input type="hidden" name="orderId" value={order.id} />
          <Button type="submit" className="w-full h-14 rounded-lg text-lg">
            Перейти до оплати
          </Button>
        </form>
      </div>
    </div>
  );
}
