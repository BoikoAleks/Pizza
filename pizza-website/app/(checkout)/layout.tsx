import { Container, Header } from "@/shared/components/shared";
import { Suspense } from "react";

export const metadata = {
  title: "Pizza Website",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F4F1EE]">
      <Header hasSearch={false} hasCart={false} className="border-gray-200" />
      <Container>
        <Suspense></Suspense>
        {children}
      </Container>
    </main>
  );
}
