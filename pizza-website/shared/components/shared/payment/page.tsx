"use client";

import { useEffect, useState } from "react";
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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPaymentIntent = async () => {
      try {
        setErrorMessage(undefined);
        setClientSecret(null);

        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (!response.ok || !data?.clientSecret) {
          setErrorMessage(data?.error ?? "Не вдалося підготувати оплату");
          setClientSecret(null);
          return;
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        if (!isMounted || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }

        setErrorMessage("Сталася помилка під час підготовки оплати");
        setClientSecret(null);
      }
    };

    fetchPaymentIntent();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [orderId]);

  const renderBody = () => {
    if (errorMessage) {
      return (
        <p className="text-red-500 bg-white bg-opacity-80 rounded-md p-4">
          {errorMessage}
        </p>
      );
    }

    if (!clientSecret) {
      return (
        <div className="flex items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white"
            role="status"
          >
            <span className="sr-only">Завантаження...</span>
          </div>
        </div>
      );
    }

    return (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret }}
        key={clientSecret}
      >
        <PaymentForm orderId={orderId} amount={amount} />
      </Elements>
    );
  };

  return (
    <main className="max-w-3xl mx-auto p-6 text-white text-center border m-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Оплата замовлення</h1>
        <h2 className="text-xl">Замовлення #{orderId}</h2>
        <p className="text-lg mt-2">
          Сума до оплати: <span className="font-bold">{amount} грн</span>
        </p>
      </div>

      {renderBody()}
    </main>
  );
}
