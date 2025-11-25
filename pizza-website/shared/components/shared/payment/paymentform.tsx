"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

type CheckoutPageProps = {
  orderId: number;
  amount: number;
};

const CheckoutPage = ({ orderId, amount }: CheckoutPageProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const cleanedOrigin = origin.replace(/\/$/, "");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${cleanedOrigin}/payment/success?orderId=${orderId}&amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Оплату не вдалося завершити");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md shadow-lg">
      <PaymentElement />

      {errorMessage && (
        <div className="text-red-500 mt-3 text-sm">{errorMessage}</div>
      )}

      <button
        disabled={!stripe || !elements || loading}
        className="text-white w-full p-4 bg-black mt-4 rounded-md font-bold disabled:opacity-50"
      >
        {loading ? "Обробка..." : `Сплатити ${amount} грн`}
      </button>
    </form>
  );
};

export default CheckoutPage;
