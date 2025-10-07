"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PaymentSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paidOrder = searchParams.get("paidOrder");
    if (paidOrder) {
      toast.success(`Замовлення #${paidOrder} успішно оплачено`);
      // Remove the query param without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("paidOrder");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return null;
}
