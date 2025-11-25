"use client";

import convertToSubcurrency from "@/shared/lib/convertToSubcurrency";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./paymentform";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PaymentPageProps = {
  orderId: number;
  amount: number;
};

export default function PaymentPage({ orderId, amount }: PaymentPageProps) {
  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Оплата замовлення</h1>
        <h2 className="text-2xl">Замовлення #{orderId}</h2>
        <p className="text-lg mt-2">
          Сума до оплати: <span className="font-bold">{amount} грн</span>
        </p>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "uah",
        }}
      >
        <PaymentForm orderId={orderId} amount={amount} />
      </Elements>
    </main>
  );
}
