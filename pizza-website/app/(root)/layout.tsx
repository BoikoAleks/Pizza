import type { Metadata } from "next";

import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
  title: "Pizza Website",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    // Просто повертаємо контент, який буде вкладено в кореневий layout
    <main className="min-h-screen">
      <Header />
      {children}
      {modal}
    </main>
  );
}
