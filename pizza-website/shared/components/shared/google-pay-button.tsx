"use client";

import { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

type Props = { orderId: number };

export default function GooglePayButton({ orderId }: Props) {
  const [available, setAvailable] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return;
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) return;

      // Create payment intent on server
      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!data?.clientSecret) return;

      const paymentRequest = stripe.paymentRequest({
        country: 'UA',
        currency: 'uah',
        total: { label: `Order #${orderId}`, amount: data.amount ?? 0 },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await paymentRequest.canMakePayment();
      if (!mounted) return;
      if (result) {
        setAvailable(true);
        const elements = stripe.elements();
        const prButton = elements.create('paymentRequestButton', {
          paymentRequest,
        });
        try {
          prButton.mount(buttonRef.current!);
        } catch (e) {
          console.warn('Failed to mount paymentRequestButton', e);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (!available) return null;

  return <div ref={buttonRef} />;
}
