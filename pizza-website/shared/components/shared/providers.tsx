"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { CustomerOrderNotification } from "./customer-order-notification";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.id) setUserId(Number(data.id));
      } catch (e) {}
    };

    fetchMe();
  }, []);

  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
      <NextTopLoader />
      <CustomerOrderNotification userId={userId} />
    </>
  );
};
